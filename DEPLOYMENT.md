# Deployment Guide for Quizzify

This guide will help you deploy Quizzify to Vercel, the recommended hosting platform for Next.js applications.

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (for future LLM integration)
   - Go to Project Settings → Environment Variables
   - Add the following variables when implementing LLM features:
     ```
     LLM_API_KEY=your_api_key_here
     GITHUB_TOKEN=your_github_token_here
     ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Confirm deployment settings
   - Deploy!

## 🔧 Environment Variables

When you're ready to integrate LLM APIs, add these environment variables in your Vercel project settings:

### Required for LLM Integration
```
LLM_API_KEY=your_openai_or_anthropic_api_key
LLM_PROVIDER=openai_or_anthropic
LLM_MODEL=gpt-4_or_claude-3
```

### Optional for Enhanced Features
```
GITHUB_TOKEN=your_github_personal_access_token
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

## 🌐 Custom Domain

1. **Add Custom Domain**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - No additional configuration needed

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable Vercel Analytics in Project Settings
- Get insights into performance and usage

### Health Check
- Your app includes a health check endpoint: `/api/health`
- Monitor application status and uptime

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to your main branch:

1. **Make changes to your code**
2. **Push to GitHub**
3. **Vercel automatically builds and deploys**
4. **Preview deployments for pull requests**

## 🚨 Troubleshooting

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally

### Environment Variables
- Ensure all required env vars are set in Vercel
- Check for typos in variable names
- Restart deployment after adding new variables

### Performance Issues
- Enable Vercel Analytics to identify bottlenecks
- Use Next.js Image optimization
- Implement proper caching strategies

## 📈 Scaling

Vercel automatically scales your application:
- **Hobby Plan**: 100GB bandwidth/month
- **Pro Plan**: 1TB bandwidth/month
- **Enterprise**: Custom limits

## 🔒 Security

- Vercel provides DDoS protection
- Automatic SSL certificates
- Environment variables are encrypted
- No server management required

## 📞 Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Your Quizzify app is now live! 🎉**

Visit your deployment URL to start creating quizzes from GitHub repositories. 