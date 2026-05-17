# Quiz Reviewer • Beta 6.0

A student-friendly quiz reviewer with final-exam practice sets, instant feedback, mistake review, progress tracking, timer, settings, and study coach support.

## Main fixes

- Fixed the GitHub Pages build error caused by a malformed quiz-bank constant.
- Cleaned the final-exam release labels to Beta 6.0.
- Preserved all final exam, lecture, lab, focus, and mixed-practice quizzes.
- Kept naming and identification questions in multiple-choice format.
- Kept True/False ordered as True then False.
- Kept matching choices free of visible internal answer letters.
- Kept mistake-only and whole-quiz review after submission.
- Kept timer, progress tracker, settings, accessibility options, dark mode, and Puter-based Deepseek/Gemini Study Coach.

## GitHub Pages notes

This release includes `.github/workflows/deploy.yml` and a Vite `base` of `/quizreviewer/`.

If your GitHub repository name is not `quizreviewer`, change the `base` value in `vite.config.js` to match your repository name.

## Do not upload generated folders

Keep these out of GitHub:

```txt
node_modules/
dist/
release/
.netlify/
.env
```
