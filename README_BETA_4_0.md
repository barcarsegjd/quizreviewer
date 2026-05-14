# Quiz Reviewer — Beta 4.0

A student-friendly quiz reviewer with instant feedback, progress tracking, dark mode, accessibility settings, and study coach options.

## Install locally

```bash
npm install
npm run dev
```

## GitHub Pages

This package includes `.github/workflows/deploy.yml` for GitHub Pages deployment. Make sure `vite.config.js` uses the correct repository base path.

For this repo:

```js
base: "/quizreviewer/"
```

## Do not commit generated folders

Keep these out of GitHub:

```text
node_modules/
dist/
release/
.netlify/
.env
.env.local
```
