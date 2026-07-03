# Codex Parallel Web Preview

This folder is a Codex-labeled static preview of the Perioperative Diabetes Medication Management web app.

It is intentionally separate from the root `index.html`, which remains the Claude/current production line. Static hosts such as Vercel, GitHub Pages, and Cloudflare Pages can serve this copy at `/codex/` after the folder is pushed to the repository.

Starting point:
- Based on Claude's `phase-3/print-styling` branch at commit `5d362ca`.

Codex additions:
- Visible "Codex parallel preview" label.
- Patient-sheet protocol chips.
- Sharper clinician status badges.
- Structured alert/caution/info flag cards.
- Focus-visible, keyboard, reduced-motion, and high-contrast accessibility polish.

Clinical logic was not changed.
