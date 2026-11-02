import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './about.module.css';

export default function About(): React.ReactElement {
  return <Layout><Head><title>About · ML101</title><meta name="description" content="About ML101 and its author, Andrea Giussani" /></Head><main className={styles.main}>
    <p className={styles.label}>ABOUT THIS TEXTBOOK</p>
    <h1>Learning alongside the lecture.</h1>
    <p>ML101 is an interactive companion to an Introduction to Machine Learning course for undergraduate Economics students. It turns lecture ideas into a readable chapter with prompts and small interactions for reflection.</p>
    <section className={styles.aboutMe} aria-labelledby="about-me-heading">
      <p className={styles.label}>A NOTE ABOUT ME</p>
      <h2 id="about-me-heading">Andrea Giussani</h2>
      <p>I’m a Platform Engineer by passion, with a mathematical background that somehow ended in a PhD in Statistics and Probability. Apparently, after all that probability, I decided to spend my time making servers predictable.</p>
      <p>I like machine learning best when it has to work with real data, not just look good on a slide. Away from the screen, I enjoy ski touring, alpinism, and trail running - activities where the forecast is more of a suggestion.</p>
      <a className={styles.profileLink} href="https://ch.linkedin.com/in/andrea-giussani" target="_blank" rel="noreferrer">Find me on LinkedIn <span aria-hidden="true">↗</span></a>
    </section>
    <p className={styles.disclaimer}>ML101 is an independent course resource and does not imply official Bocconi University endorsement.</p>
  </main></Layout>;
}
