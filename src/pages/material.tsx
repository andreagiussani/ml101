import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import styles from './material.module.css';

export default function Material(): React.ReactElement {
  return <Layout>
    <Head><title>Explore · ML101</title><meta name="description" content="Explore machine learning topics and interactive examples" /></Head>
    <main className={styles.main}>
      <p className={styles.label}>ML101 · COURSE MATERIAL</p>
      <h1>Material</h1>
      <p className={styles.intro}>Explore clear explanations, worked examples, and interactive tools.</p>
      <Link className={styles.card} to="/lectures/ml101-01">
        <span className={styles.copy}><strong>What is Machine Learning?</strong><small>A short history of an old idea.</small></span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
      <Link className={styles.card} to="/lectures/ml101-02">
        <span className={styles.copy}><strong>Can we trust our data?</strong><small>When information is incomplete.</small></span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
      <Link className={styles.card} to="/lectures/ml101-03">
        <span className={styles.copy}><strong>Can we trust a perfect fit?</strong><small>The price of fitting the data.</small></span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
      <Link className={styles.card} to="/lectures/ml101-04">
        <span className={styles.copy}><strong>Trust, but verify</strong><small>Cross-validation, model selection, and the score you should trust.</small></span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
      <Link className={styles.card} to="/lectures/ml101-05">
        <span className={styles.copy}><strong>Data leakage: follow the information</strong><small>Find the hidden paths that make an experiment look better than it is.</small></span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
      <Link className={styles.card} to="/lectures/ml101-06">
        <span className={styles.copy}><strong>Trees and boosting: one question, one correction</strong><small>Explore decision trees, loss gradients, and sequential corrections.</small></span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </Link>
      <section className={styles.appendix} aria-labelledby="appendix-heading">
        <h2 id="appendix-heading" className={styles.sectionTitle}>Appendix</h2>
        <p className={styles.sectionIntro}>Optional algebra and worked calculations.</p>
        <Link className={styles.card} to="/lectures/lasso-math">
          <span className={styles.copy}><strong>LASSO: The Algebra Behind Zero</strong><small>Why a coefficient can become exactly zero.</small></span>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </Link>
        <Link className={styles.card} to="/lectures/math-examples">
          <span className={styles.copy}><strong>Trees &amp; Boosting: Worked Calculations</strong><small>Step-by-step calculations for regression trees and gradient boosting.</small></span>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  </Layout>;
}
