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
        <p className={styles.intro}>An interactive textbook for undergraduate students. Explore how machine learning learns from examples, and what we can responsibly infer when information is incomplete.</p>
        <div className={styles.lectureGrid} aria-label="Course material">
          <Link className={styles.lectureCard} to="/lectures/ml101-01">
            <span className={styles.lectureLabel}>LECTURE 01</span>
            <span className={styles.lectureTitle}>What is Machine Learning?</span>
            <span className={styles.lectureSubtitle}>A short history of an old idea.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
          <Link className={styles.lectureCard} to="/lectures/ml101-02">
            <span className={styles.lectureLabel}>LECTURE 02</span>
            <span className={styles.lectureTitle}>Can we trust our data?</span>
            <span className={styles.lectureSubtitle}>When information is incomplete.</span>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
