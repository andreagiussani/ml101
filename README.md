# ML101

An interactive introduction to machine learning, with visual explanations and worked examples.

## Explore the material

- [What is machine learning?](https://probablyml.com/lectures/ml101-01)
- [Missing data and imputation](https://probablyml.com/lectures/ml101-02)
- [Generalization and regularization](https://probablyml.com/lectures/ml101-03)
- [Cross-validation and model selection](https://probablyml.com/lectures/ml101-04)
- [Data leakage](https://probablyml.com/lectures/ml101-05)
- [Decision trees and boosting](https://probablyml.com/lectures/ml101-06)
- [LASSO: The Algebra Behind Zero](https://probablyml.com/lectures/lasso-math)
- [Trees & Boosting: Worked Calculations](https://probablyml.com/lectures/math-examples)

## Run locally

Requires Node.js 18 or later.

```bash
npm ci
npm start
```

Open the local URL printed by Docusaurus (typically `http://localhost:3000/ml101/`).

## Build and typecheck

```bash
npm run typecheck
npm run build
```

The production site is generated in `build/`.

## Project structure

Pages are written in `docs/`. Interactive examples live in `src/components/LectureTools/`, and shared site styles live in `src/css/custom.css`.

## Licensing

- Website code: MIT; see [`LICENSE`](LICENSE).
- Original educational text for Lectures 01–03: CC BY 4.0; see [`CONTENT-LICENSE.md`](CONTENT-LICENSE.md).
- Source lecture materials, third-party references, logos, and trademarks are not covered by these licenses unless stated otherwise.
