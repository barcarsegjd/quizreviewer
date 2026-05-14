# MLS Quiz Reviewer App — Beta 3.4 Visual + Matching Fix

This release focuses on the bugs reported after Beta 3.3.1.

## Fixed

- Rebuilt chemistry structure sketches as inline SVGs, so no missing-image path bugs.
- Improved structure accuracy for common MLS121 chemistry structures including aromatic compounds, alcohols, ethers, aldehydes, ketones, and carboxylic acids.
- Kept structure answers hidden while answering; MolView-compatible name, SMILES, and formula show only after reveal/review.
- True/False choices are no longer shuffled and always appear as True then False.
- Matching-type questions now show a context box explaining the matching task and the exact prompt to match.
- Matching choices now include clearer contextual notes.
- Choice cards, matching boxes, and structure panels were refined for better responsiveness on phone and desktop.
- AI Study Coach, Progress Tracker, Puter/DeepSeek/Gemini modes, and Netlify configuration are retained.

## Install

Copy `src/App.jsx` into your project's `src/App.jsx`.

If using the full ZIP, copy the `netlify` folder and `netlify.toml` too.

Then run:

```bash
npm run dev
```

Deploy from the project root:

```bash
netlify deploy --prod
```
