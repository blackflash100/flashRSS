# FlashRSS - Contributing Guide

Thank you for your interest in contributing to FlashRSS! 🎉

## Development Environment Setup

1. **Fork and clone the repository:**
```bash
git clone https://github.com/blackflash100/flashRSS.git
cd flashRSS
```

2. **Install dependencies:**
```bash
# Linux/macOS
./install.sh

# Windows
install.bat

# or manually
npm install
cd client && npm install && npm run build
```

3. **Start development servers:**
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend (development mode)
cd client
npm run dev
```

## Coding Standards

### JavaScript/React
- Use ES6+ syntax.
- Prefer functional components.
- Use meaningful variable names.
- Comment your code (especially for complex logic).

### CSS/Tailwind
- Use Tailwind utility classes.
- Keep custom CSS to a minimum.
- Apply responsive design principles.

### Commit Messages
Write meaningful commit messages:
```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code formatting fix
refactor: Code restructuring
test: Adding/fixing tests
```

## Pull Request Process

1. **Create a feature branch:**
```bash
git checkout -b feature/amazing-feature
```

2. **Make your changes and test them.**

3. **Commit:**
```bash
git commit -m "feat: Add amazing feature"
```

4. **Push:**
```bash
git push origin feature/amazing-feature
```

5. **Open a Pull Request:**
   - Write a descriptive title.
   - Explain the changes in detail.
   - Reference any related issues.

## Feature Suggestions

For new feature suggestions:
1. Open an issue first.
2. Discuss the feature.
3. Start development after receiving approval.

## Error Reporting

When you find a bug:
1. Open an issue.
2. Include steps to reproduce the error.
3. Describe the expected and actual behavior.
4. Share your system information (OS, Node.js version, etc.).

## Code Review

All PRs are reviewed for:
- Code quality.
- Test coverage.
- Documentation.
- Performance impacts.

## Questions?

You can ask questions in GitHub Discussions!

Thank you! 🙏
