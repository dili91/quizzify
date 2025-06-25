# Quizzify 🧠

[![Quizzify]](https://www.loom.com/embed/ab188a25e7f24220b5d5b56181febbee?sid=0d947c08-4655-4a5d-adf1-6bb805813327)

Turn any GitHub repository into an interactive quiz to test your knowledge and learn more about the codebase.

## 📝 About This Project

This project was **entirely implemented using [Cursor](https://cursor.sh)**, the AI-powered code editor, as a **Proof of Concept (PoC)** to evaluate the IDE's capabilities for rapid application development. 

### Key Points:
- **No manual coding**: All code was generated and implemented through Cursor's AI assistance
- **No tests included**: As this is a PoC focused on development speed and AI capabilities, comprehensive testing was not prioritized
- **Rapid development**: The entire application was built from scratch in a short timeframe
- **AI-first approach**: Demonstrates how AI can accelerate full-stack development

This serves as a demonstration of Cursor's ability to understand complex requirements, generate appropriate code, and maintain consistency across a full application stack.

## 🚀 Features

- **GitHub Repository Integration**: Input any GitHub repository URL to generate a quiz
- **AI-Powered Quiz Generation**: Dynamic quiz creation using OpenAI GPT-4
- **Categorized Questions**: Questions organized into Domain (60%), Code (30%), and General (10%) categories
- **Interactive Quiz Experience**: Multiple choice questions with explanations
- **Progress Tracking**: Visual progress bar and question navigation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Immediate feedback on answers with explanations
- **Score Tracking**: Final score display with percentage calculation
- **Smart Fallbacks**: Graceful degradation when APIs are unavailable

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI Integration**: OpenAI GPT-4 API
- **GitHub Integration**: Octokit REST API

## 📦 Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quizzify.git
   cd quizzify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the project root:
   ```bash
   QUIZZIFY_OPENAI_API_KEY=your_openai_api_key_here
   QUIZZIFY_GITHUB_TOKEN=your_github_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Enter a GitHub URL**: Paste any GitHub repository URL in the input field
2. **Generate Quiz**: Click "Generate Quiz" to create AI-powered questions based on the repository
3. **Take the Quiz**: Answer 10 categorized multiple choice questions about the repository
4. **Review Results**: See your score and explanations for each question

### Example Repositories

Try these pre-configured examples:
- [facebook/react](https://github.com/facebook/react) - React library questions
- [vercel/next.js](https://github.com/vercel/next.js) - Next.js framework questions

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoint
│   │   └── quiz/          # Quiz generation endpoint
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GitHubInput.tsx    # GitHub URL input component
│   └── Quiz.tsx           # Quiz display component
└── services/              # Business logic
    ├── githubService.ts   # GitHub API integration
    ├── llmService.ts      # OpenAI LLM integration
    └── quizService.ts     # Quiz generation service
```

## 🔧 Development

### Current Implementation

The application now features full AI-powered quiz generation:

- **OpenAI GPT-4 Integration**: Dynamic quiz generation based on repository content
- **GitHub API Integration**: Repository analysis using Octokit
- **Categorized Questions**: 10 questions distributed as 6 domain, 3 code, 1 general
- **Smart Content Analysis**: Analyzes README, key files, and repository metadata
- **Fallback System**: Graceful degradation to hardcoded data when APIs are unavailable
- **Environment Management**: Secure API key handling with QUIZZIFY_ prefix

### Key Features

1. **Repository Analysis**: 
   - Fetches repository metadata, topics, and description
   - Analyzes README content and key source files
   - Identifies technology stack and project structure

2. **AI-Powered Quiz Generation**:
   - Generates contextually relevant questions
   - Provides detailed explanations for correct answers
   - Categorizes questions by type (Domain/Code/General)

3. **User Experience**:
   - Visual category badges for each question
   - Progress tracking and navigation
   - Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Basic UI/UX implementation
- [x] GitHub URL input and validation
- [x] Interactive quiz component
- [x] Hardcoded quiz data
- [x] Responsive design

### Phase 2: LLM Integration ✅
- [x] Integrate with OpenAI API (GPT-4)
- [x] Implement repository content analysis
- [x] Dynamic quiz generation based on repository content
- [x] Question quality and relevance improvements
- [x] Categorized questions (Domain/Code/General)
- [x] Smart fallback system
- [x] Environment variable management
- [x] GitHub API integration for repository metadata

### Phase 3: Enhanced Features 📋
- [ ] User authentication and quiz history
- [ ] Advanced analytics and insights
- [ ] Quiz customization options
- [ ] Social features and sharing
- [ ] Performance optimizations
- [ ] Advanced quiz types (matching, fill-in-the-blank)
- [ ] Multi-provider LLM support (Claude, Llama, local models)

## 🔧 Environment Variables

The application requires the following environment variables for local development:

- `QUIZZIFY_OPENAI_API_KEY`: Your OpenAI API key for GPT-4 access
- `QUIZZIFY_GITHUB_TOKEN`: Your GitHub personal access token for repository access

These are automatically loaded from `.env.local` in development.
