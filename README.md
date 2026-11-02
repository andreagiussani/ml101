# ML101 — Introduction to Machine Learning

An interactive textbook for an undergraduate Economics course. The site currently contains **Lecture 01 only**, based on the opening lecture brief. Built with Docusaurus 3, React, TypeScript, and MDX.

## Run locally

Requires Node.js 18 or later.

```bash
npm ci
npm start
```

Open the local URL printed by Docusaurus. The Material page lists available lecture notes; Lecture 01 is at `/lectures/ml101-01`. The site navigation also links to Home and About.

## Build and typecheck

```bash
npm run typecheck
npm run build
```

The build checks internal links and emits the static site into `build/`.

## Add a future lecture

Write a new MDX document in `docs/` with a unique `id` and `slug`, then add its document ID to `sidebars.ts`. Only published lectures should be linked in the navigation. Interactive chapter elements live in `src/components/LectureTools`; global design tokens and Docusaurus styles are in `src/css/custom.css`.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main` and on manual runs. In the repository settings, enable **GitHub Pages** with **GitHub Actions** as the build and deployment source.

By default, the workflow derives the project name and owner from `GITHUB_REPOSITORY`. For `USERNAME/ml101`, the built site uses `https://USERNAME.github.io` as its site URL and `/ml101/` as its base path, producing the initial address `https://USERNAME.github.io/ml101/`.

Optional repository variables can override the defaults:

- `SITE_URL`: origin only, such as `https://USERNAME.github.io` or `https://learn.example.edu`.
- `BASE_URL`: path with leading and trailing slash, such as `/ml101/` or `/`.

### Custom domain later

Add the domain in the repository’s Pages settings and configure its DNS records with your domain provider. Set the `SITE_URL` and `BASE_URL` repository variables to the domain origin and deployment path (usually `/`), then redeploy. GitHub Pages manages the custom-domain `CNAME` setting; verify HTTPS is enabled in Pages settings after DNS propagates.

## Content source

Lecture 01 follows `ML101_01_Intro.pdf`. Its selected references and historical citations are drawn from the deck’s final slide.
