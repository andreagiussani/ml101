# ML101 — Introduction to Machine Learning

## Run locally
Requires Node.js 18 or later.

```bash
npm ci
npm start
```

Open the local URL `http://localhost:3000/ml101/`. The Material page lists available lecture notes; Lecture 01 is at `/lectures/ml101-01`. The site navigation also links to Home and About.
## Build and typecheck

```bash
npm run typecheck
npm run build
```

The build checks internal links and emits the static site into `build/`.

## Add a future lecture

Write a new MDX document in `docs/` with a unique `id` and `slug`, then add its document ID to `sidebars.ts`. Only published lectures should be linked in the navigation. Interactive chapter elements live in `src/components/LectureTools`; global design tokens and Docusaurus styles are in `src/css/custom.css`.

## Content source

Lecture 01 follows `ML101_01_Intro.pdf`. Its selected references and historical citations are drawn from the deck’s final slide.
