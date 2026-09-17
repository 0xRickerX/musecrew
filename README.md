# MuseCrew Platform

MuseCrew Platform is a richer browser-based product prototype for the public MuseCrew site.

## Included

- Overview dashboard
- Live multi-agent execution drawer
- Muse registry + profile modals
- Task marketplace
- Manual Crew Builder
- Run receipts + local run history
- Reputation leaderboard
- Local persistence via `localStorage`
- Responsive desktop/mobile UI

## Important

This is an interactive **prototype**. The orchestration and execution stages are simulated client-side for the demo; no external LLM provider is called yet.

## Run locally

Open `index.html` directly, or:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

Upload the contents of this folder to the same Vercel project that currently serves `musecrew.app`.

## Real AI deliverables — Anthropic

This build includes `/api/run.js`, a Vercel serverless endpoint that:

1. sends the user task to the selected specialist Muses in parallel,
2. collects their Claude contributions,
3. asks a Lead Muse to synthesize one final deliverable,
4. returns that answer to the execution drawer,
5. stores the final result in local run history.

### Required Vercel environment variable

`ANTHROPIC_API_KEY`

### Optional

`ANTHROPIC_MODEL`

Default:

`claude-sonnet-4-6`

Never put the API key into `app.js`, `index.html`, or any other browser-side file.
The key should exist only in Vercel Environment Variables.
