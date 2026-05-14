# Quiz App with AI Tutor

## Files
- `src/App.jsx` - updated React app with AI Tutor buttons.
- `netlify/functions/ai-tutor.mjs` - secure serverless backend for the OpenAI request.
- `netlify.toml` - Netlify Functions config.
- `.env.example` - environment variable names.

## Local development
The app still works with `npm run dev`. If the AI backend is not running, the app automatically uses the offline tutor fallback.

For the real online AI tutor locally, install Netlify CLI and run:

```bash
npm install -g netlify-cli
netlify dev
```

## Netlify deployment
Add these environment variables in Netlify:

```text
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Then deploy the project.
