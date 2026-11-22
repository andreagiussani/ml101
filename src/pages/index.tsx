import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home(): React.ReactElement {
  return (
    <Layout>
      <Head><title>ML101 — Introduction to Machine Learning</title><meta name="description" content="ML101, an interactive introduction to machine learning for undergraduate students" /></Head>
      <main className={styles.main}>
        <div className={styles.kicker}><span className={styles.kickerMark} /> A course in machine learning</div>
        <h1>ML101 — Introduction to<br className={styles.desktopBreak} /> Machine Learning</h1>
        <p className={styles.question}>How do we turn imperfect data into reliable predictions?</p>
        <p className={styles.intro}>An interactive textbook for undergraduate students. Explore how machine learning learns from examples, handles incomplete information, controls complexity, and earns a trustworthy score.</p>
        <div className={styles.lectureGrid} aria-label="Machine learning topics">
          <Link className={styles.lectureCard} to="/lectures/ml101-01">
            <span className={styles.lectureTitle}>What is Machine Learning?</span>
            <span className={styles.lectureSubtitle}>A short history of an old idea.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.lectureCard} to="/lectures/ml101-02">
            <span className={styles.lectureTitle}>Can we trust our data?</span>
            <span className={styles.lectureSubtitle}>When information is incomplete.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.lectureCard} to="/lectures/ml101-03">
            <span className={styles.lectureTitle}>Can we trust a perfect fit?</span>
            <span className={styles.lectureSubtitle}>The price of fitting the data.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.lectureCard} to="/lectures/ml101-04">
            <span className={styles.lectureTitle}>Trust, but verify</span>
            <span className={styles.lectureSubtitle}>Cross-validation, model selection, and the score you should trust.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.lectureCard} to="/lectures/ml101-05">
            <span className={styles.lectureTitle}>Data leakage</span>
            <span className={styles.lectureSubtitle}>Follow the information. Find the hidden path to an untrustworthy score.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.lectureCard} to="/lectures/ml101-06">
            <span className={styles.lectureTitle}>Trees and boosting</span>
            <span className={styles.lectureSubtitle}>One question. One correction. Explore the math and watch the models learn.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
        </div>
        <section className={styles.appendix} aria-labelledby="appendix-heading">
          <h2 id="appendix-heading" className={styles.sectionTitle}>Appendix</h2>
          <p className={styles.sectionIntro}>Optional algebra and worked calculations.</p>
          <div className={styles.lectureGrid} aria-label="Appendix material">
          <Link className={styles.lectureCard} to="/lectures/lasso-math">
            <span className={styles.lectureTitle}>LASSO: The Algebra Behind Zero</span>
            <span className={styles.lectureSubtitle}>Why a coefficient can become exactly zero.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.lectureCard} to="/lectures/math-examples">
            <span className={styles.lectureTitle}>Trees &amp; boosting: worked calculations</span>
            <span className={styles.lectureSubtitle}>Worked calculations for tree splits, pruning, residuals, and gradient boosting.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
