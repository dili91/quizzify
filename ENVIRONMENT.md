# Environment Setup for Phase 2 - LLM Integration

## Required Environment Variables

To enable LLM-powered quiz generation, you need to set up the following environment variables:

### 1. OpenAI API Key
```bash
QUIZZIFY_OPENAI_API_KEY=your_openai_api_key_here
```
- Get your API key from: https://platform.openai.com/api-keys
- Required for generating dynamic quiz questions

### 2. GitHub Token
```bash
QUIZZIFY_GITHUB_TOKEN=your_github_token_here
```
- Create a token at: https://github.com/settings/tokens
- Required scopes: `public_repo`, `read:user`
- Used for fetching repository metadata and content

## Setup Instructions

### Local Development
1. Create a `.env.local` file in the project root
2. Add the environment variables above
3. Restart your development server

### Vercel Deployment
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add both `QUIZZIFY_OPENAI_API_KEY` and `QUIZZIFY_GITHUB_TOKEN`
4. Redeploy your application

## Optional Configuration

You can customize LLM behavior with these optional variables:
```bash
QUIZZIFY_LLM_MODEL=gpt-4              # Default: gpt-4
QUIZZIFY_LLM_MAX_TOKENS=2000          # Default: 2000
QUIZZIFY_LLM_TEMPERATURE=0.7          # Default: 0.7
```

## Fallback Behavior

If API keys are not configured:
- The application will use hardcoded quiz data
- All existing functionality remains available
- No errors will be thrown

## Testing API Connections

You can test if your APIs are working by visiting:
- `/api/health` - Check overall health and API status
- `/api/quiz?test=connections` - Test specific API connections

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- GitHub token only needs public repository access
- Consider using Vercel's environment variable encryption
- Quizzify-specific prefixes prevent conflicts with other projects 