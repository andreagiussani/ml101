import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import styles from './material.module.css';

export default function Material(): React.ReactElement {
  return <Layout>
    <Head><title>Material · ML101</title><meta name="description" content="Lecture materials for ML101" /></Head>
    <main className={styles.main}>
      <p className={styles.label}>ML101 · COURSE MATERIAL</p>
      <h1>Material</h1>
      <p className={styles.intro}>Explore the lecture notes and interactive material.</p>
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
    </main>
  </Layout>;
}
