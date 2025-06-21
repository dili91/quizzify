# Quizzify 🧠

Turn any GitHub repository into an interactive quiz to test your knowledge and learn more about the codebase.

## 🚀 Features

- **GitHub Repository Integration**: Input any GitHub repository URL to generate a quiz
- **Interactive Quiz Experience**: Multiple choice questions with explanations
- **Progress Tracking**: Visual progress bar and question navigation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Feedback**: Immediate feedback on answers with explanations
- **Score Tracking**: Final score display with percentage calculation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (ready for deployment)
- **Future**: LLM API integration for dynamic quiz generation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quizzify.git
   cd quizzify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Enter a GitHub URL**: Paste any GitHub repository URL in the input field
2. **Generate Quiz**: Click "Generate Quiz" to create questions based on the repository
3. **Take the Quiz**: Answer multiple choice questions about the repository
4. **Review Results**: See your score and explanations for each question

### Example Repositories

Try these pre-configured examples:
- [facebook/react](https://github.com/facebook/react) - React library questions
- [vercel/next.js](https://github.com/vercel/next.js) - Next.js framework questions

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── GitHubInput.tsx    # GitHub URL input component
│   └── Quiz.tsx           # Quiz display component
└── services/              # Business logic
    └── quizService.ts     # Quiz generation service
```

## 🔧 Development

### Current Implementation

The application currently uses hardcoded quiz data for demonstration purposes. The quiz generation service (`src/services/quizService.ts`) includes:

- Pre-configured quizzes for React and Next.js repositories
- A default quiz for any other repository
- Simulated API delay for realistic user experience

### Future Enhancements

1. **LLM Integration**: Replace hardcoded data with dynamic quiz generation using LLM APIs
2. **GitHub API Integration**: Fetch repository metadata and content
3. **Quiz Customization**: Allow users to customize quiz difficulty and topic focus
4. **User Authentication**: Add user accounts and quiz history
5. **Social Features**: Share quizzes and compare scores
6. **Advanced Analytics**: Detailed performance insights and learning recommendations

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Deploy automatically** on every push to main branch
3. **Custom domain** (optional)

### Manual Deployment

```bash
npm run build
npm start
```

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

### Phase 2: LLM Integration 🚧
- [ ] Integrate with OpenAI API or similar LLM service
- [ ] Implement repository content analysis
- [ ] Dynamic quiz generation based on repository content
- [ ] Question quality and relevance improvements

### Phase 3: Enhanced Features 📋
- [ ] GitHub API integration for repository metadata
- [ ] User authentication and quiz history
- [ ] Advanced analytics and insights
- [ ] Quiz customization options

## 🐛 Known Issues

- Currently uses hardcoded quiz data (will be resolved with LLM integration)
- Limited to specific repository examples (will be expanded with dynamic generation)

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/quizzify/issues) page
2. Create a new issue for bugs or feature requests
3. Contact the development team

---

**Made with ❤️ for the developer community**
