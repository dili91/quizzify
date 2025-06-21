import { Octokit } from '@octokit/rest';

// Initialize GitHub API client
const octokit = new Octokit({
  auth: process.env.QUIZZIFY_GITHUB_TOKEN,
});

export interface GitHubRepository {
  owner: string;
  name: string;
  description: string;
  language: string;
  topics: string[];
  defaultBranch: string;
  size: number;
  stars: number;
  forks: number;
}

export interface GitHubFile {
  path: string;
  content: string;
  type: 'code' | 'config' | 'documentation';
  size: number;
}

export interface GitHubContentItem {
  name: string;
  path: string;
  type: 'file' | 'dir' | 'submodule' | 'symlink';
  size: number;
  sha: string;
  url: string;
  git_url: string | null;
  html_url: string | null;
  download_url: string | null;
  _links?: {
    self: string;
    git: string | null;
    html: string | null;
  };
}

export interface RepositoryAnalysis {
  name: string;
  description: string;
  language: string;
  topics: string[];
  readmeContent?: string;
  mainFiles: GitHubFile[];
}

export class GitHubService {
  private static instance: GitHubService;
  
  private constructor() {}
  
  static getInstance(): GitHubService {
    if (!GitHubService.instance) {
      GitHubService.instance = new GitHubService();
    }
    return GitHubService.instance;
  }

  /**
   * Parse GitHub URL to extract owner and repository name
   */
  parseGitHubUrl(url: string): { owner: string; name: string } {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL format');
    }
    return { owner: match[1], name: match[2] };
  }

  /**
   * Get repository metadata
   */
  async getRepositoryInfo(url: string): Promise<GitHubRepository> {
    const { owner, name } = this.parseGitHubUrl(url);
    
    try {
      const [repoResponse, topicsResponse] = await Promise.all([
        octokit.repos.get({ owner, repo: name }),
        octokit.repos.getAllTopics({ owner, repo: name })
      ]);

      return {
        owner,
        name: repoResponse.data.name,
        description: repoResponse.data.description || '',
        language: repoResponse.data.language || 'Unknown',
        topics: topicsResponse.data.names,
        defaultBranch: repoResponse.data.default_branch,
        size: repoResponse.data.size,
        stars: repoResponse.data.stargazers_count,
        forks: repoResponse.data.forks_count
      };
    } catch (error) {
      console.error('Failed to fetch repository info:', error);
      throw new Error('Failed to fetch repository information');
    }
  }

  /**
   * Get repository contents (files and directories)
   */
  async getRepositoryContents(owner: string, repo: string, path: string = ''): Promise<GitHubContentItem[]> {
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error('Failed to fetch repository contents:', error);
      return [];
    }
  }

  /**
   * Get file content
   */
  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    try {
      const response = await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      if ('content' in response.data) {
        // Decode base64 content
        return Buffer.from(response.data.content, 'base64').toString('utf-8');
      }
      
      throw new Error('File content not found');
    } catch (error) {
      console.error('Failed to fetch file content:', error);
      throw new Error(`Failed to fetch file content: ${path}`);
    }
  }

  /**
   * Analyze repository and extract relevant files
   */
  async analyzeRepository(url: string): Promise<RepositoryAnalysis> {
    const repoInfo = await this.getRepositoryInfo(url);
    const { owner, name } = this.parseGitHubUrl(url);
    
    // Get repository contents
    const contents = await this.getRepositoryContents(owner, name);
    
    // Select relevant files
    const relevantFiles = await this.selectRelevantFiles(owner, name, contents);
    
    // Get README content
    let readmeContent: string | undefined;
    try {
      const readmeFile = contents.find(file => 
        file.name.toLowerCase().includes('readme') && 
        file.name.match(/\.(md|txt|rst)$/)
      );
      if (readmeFile) {
        readmeContent = await this.getFileContent(owner, name, readmeFile.path);
      }
    } catch (error) {
      console.warn('Failed to fetch README:', error);
    }

    return {
      name: repoInfo.name,
      description: repoInfo.description,
      language: repoInfo.language,
      topics: repoInfo.topics,
      readmeContent,
      mainFiles: relevantFiles
    };
  }

  /**
   * Select relevant files for analysis
   */
  private async selectRelevantFiles(owner: string, repo: string, contents: GitHubContentItem[]): Promise<GitHubFile[]> {
    const relevantFiles: GitHubFile[] = [];
    const processedPaths = new Set<string>();

    // Define file priorities based on language
    const priorities = this.getFilePriorities();

    // Sort files by priority
    const sortedContents = contents
      .filter(file => !this.shouldIgnoreFile(file))
      .sort((a, b) => {
        const priorityA = this.getFilePriority(a.path, priorities);
        const priorityB = this.getFilePriority(b.path, priorities);
        return priorityB - priorityA;
      });

    // Process top files (limit to avoid token limits)
    for (const file of sortedContents.slice(0, 15)) {
      if (processedPaths.has(file.path)) continue;
      
      try {
        const content = await this.getFileContent(owner, repo, file.path);
        const type = this.getFileType(file.path);
        
        relevantFiles.push({
          path: file.path,
          content: this.sanitizeContent(content),
          type,
          size: file.size
        });
        
        processedPaths.add(file.path);
      } catch (error) {
        console.warn(`Failed to process file ${file.path}:`, error);
      }
    }

    return relevantFiles;
  }

  /**
   * Get file priorities based on language
   */
  private getFilePriorities(): Record<string, number> {
    return {
      'README.md': 10,
      'package.json': 9,
      'requirements.txt': 9,
      'Cargo.toml': 9,
      'go.mod': 9,
      'pom.xml': 9,
      'build.gradle': 9,
      'index.js': 8,
      'main.js': 8,
      'App.js': 8,
      'main.py': 8,
      'app.py': 8,
      'main.go': 8,
      'main.rs': 8,
      'Program.cs': 8,
      'src/': 7,
      'components/': 6,
      'utils/': 5,
      'lib/': 5,
      'tests/': 3,
      'test/': 3,
      '__tests__/': 3,
      'docs/': 4,
      'documentation/': 4
    };
  }

  /**
   * Get priority for a specific file
   */
  private getFilePriority(path: string, priorities: Record<string, number>): number {
    for (const [pattern, priority] of Object.entries(priorities)) {
      if (path.includes(pattern)) {
        return priority;
      }
    }
    return 0;
  }

  /**
   * Determine if file should be ignored
   */
  private shouldIgnoreFile(file: GitHubContentItem): boolean {
    // Skip directories (GitHub API returns type: 'dir' for directories)
    if (file.type === 'dir') {
      return true;
    }

    const ignorePatterns = [
      'node_modules/',
      '.git/',
      '.github/',
      'dist/',
      'build/',
      '.next/',
      'coverage/',
      '.DS_Store',
      'yarn.lock',
      'package-lock.json'
    ];

    // Check for exact matches first
    const hasExactMatch = ignorePatterns.some(pattern => 
      file.path.includes(pattern) || file.name === pattern
    );

    if (hasExactMatch) return true;

    // Check for file extensions that should be ignored
    const ignoredExtensions = ['.log', '.lock'];
    const hasIgnoredExtension = ignoredExtensions.some(ext => 
      file.name.endsWith(ext)
    );

    return hasIgnoredExtension;
  }

  /**
   * Get file type based on path
   */
  private getFileType(path: string): 'code' | 'config' | 'documentation' {
    const configExtensions = ['.json', '.yaml', '.yml', '.toml', '.ini', '.conf'];
    const docExtensions = ['.md', '.txt', '.rst', '.adoc'];
    
    if (configExtensions.some(ext => path.endsWith(ext))) {
      return 'config';
    }
    
    if (docExtensions.some(ext => path.endsWith(ext))) {
      return 'documentation';
    }
    
    return 'code';
  }

  /**
   * Sanitize content for LLM (remove sensitive info, limit size)
   */
  private sanitizeContent(content: string): string {
    return content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/console\.log\([^)]*\)/g, '') // Remove console logs
      .replace(/password\s*=\s*['"][^'"]*['"]/g, 'password = "***"') // Mask passwords
      .replace(/api_key\s*=\s*['"][^'"]*['"]/g, 'api_key = "***"') // Mask API keys
      .substring(0, 2000); // Limit content size
  }

  /**
   * Test GitHub API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await octokit.rateLimit.get();
      return true;
    } catch (error) {
      console.error('GitHub API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const githubService = GitHubService.getInstance(); 