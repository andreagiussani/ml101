# ML101 — Introduction to Machine Learning

## Run locally
Requires Node.js 18 or later.

```bash
npm ci
npm start
```

Open the local URL `http://localhost:3000/ml101/`. The Material page lists available lectures: Lecture 01 is at `/lectures/ml101-01`, and Lecture 02 is at `/lectures/ml101-02`. The site navigation also links to Home and About.
## Build and typecheck

```bash
npm run typecheck
npm run build
```

The build checks internal links and emits the static site into `build/`.

## Add a future lecture

Write a new MDX document in `docs/` with a unique `id` and `slug`, then add its document ID to `sidebars.ts`. Only published lectures should be linked in the navigation. Interactive chapter elements live in `src/components/LectureTools`; global design tokens and Docusaurus styles are in `src/css/custom.css`.

## Content source

Lecture 01 follows `ML101_01_Intro.pdf`; Lecture 02 follows `ML101_02_Data.pdf`. Selected references and historical citations are drawn from the decks.

## Licensing and reuse

- **Website code** is licensed under the MIT License in [`LICENSE`](LICENSE).
- **Original educational text and student-facing explanations for Lectures 01 and 02** are licensed under CC BY 4.0; see [`CONTENT-LICENSE.md`](CONTENT-LICENSE.md).
- Suggested attribution for reused course material: **Andrea Giussani (2026), probablyml.com.** Please indicate if you adapted the material and retain citations to the original sources.
- The source lecture PDF, logos and trademarks, cited papers and books, and other third-party material are excluded from these licenses unless explicitly stated. Reuse them under their own terms.
