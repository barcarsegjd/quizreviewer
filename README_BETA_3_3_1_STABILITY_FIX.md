# MLS Quiz App — Beta 3.3.1 Stability Fix

This update focuses on stability, scoring accuracy, answer checking, AI fallback behavior, and deployment readiness.

## Fixed / refined

- Stabilized answer checking after choice shuffling.
- Added a safety layer so the correct answer is always kept in the shuffled choices.
- Deduplicated repeated choices per item.
- Fixed auto-next so it will not accidentally skip another item if the user manually navigates before the timer finishes.
- Added a submit confirmation when unanswered items remain.
- Prevented duplicate progress records from rapid repeated submit clicks.
- Added item-level score display after reveal.
- Kept all 10 quizzes integrated.
- Kept Progress Tracker and AI Provider Switcher.
- Kept Gemini API, DeepSeek API, Puter Gemini, Puter DeepSeek, and Offline Tutor modes.

## Deploy

From the project root, run:

```bash
npm run build
netlify deploy --prod
```

Use the project root folder, not the `src` folder.

## Environment variables for server AI modes

Only needed if you use Netlify server AI modes:

```text
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
DEEPSEEK_API_KEY=your_key
DEEPSEEK_MODEL=deepseek-chat
```

Puter AI modes do not require your own API key.
