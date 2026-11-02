import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home(): React.ReactElement {
  return (
    <Layout>
      <Head><title>ML101 — Introduction to Machine Learning</title><meta name="description" content="ML101, a university course for undergraduate Economics students" /></Head>
      <main className={styles.main}>
        <div className={styles.kicker}><span className={styles.kickerMark} /> A course in machine learning</div>
        <h1>ML101 — Introduction to<br className={styles.desktopBreak} /> Machine Learning</h1>
        <p className={styles.question}>How do we turn imperfect data into reliable predictions?</p>
        <p className={styles.intro}>An interactive textbook for undergraduate Economics students. Begin with the question at the heart of the course, then explore how machine learning grew from an old idea into a practical way to learn from examples.</p>
        <Link className={styles.lectureCard} to="/lectures/ml101-01">
          <span className={styles.lectureLabel}>START HERE · LECTURE 01</span>
          <span className={styles.lectureTitle}>What is Machine Learning?</span>
          <span className={styles.lectureSubtitle}>A short history of an old idea.</span>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </Link>
        <p className={styles.note}>One lecture, explored in depth. The chapter follows the ideas introduced in class and leaves space for you to pause, compare, and question.</p>
      </main>
    </Layout>
  );
}
