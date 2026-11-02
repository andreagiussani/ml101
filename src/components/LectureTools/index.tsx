import React, { useState } from 'react';
import styles from './styles.module.css';

export function DiscussionQuestion({ children }: { children: React.ReactNode }) {
  return <aside className={styles.question}><span className={styles.eyebrow}>Pause and consider</span><p>{children}</p></aside>;
}

export function ExperienceTaskPerformance() {
  const [part, setPart] = useState<'E' | 'T' | 'P'>('E');
  const detail = {
    E: ['Experience', 'The examples or practice the system learns from.'],
    T: ['Task', 'The activity the system is meant to perform.'],
    P: ['Performance', 'How we judge how well it performs that task.'],
  } as const;
  return <div className={styles.panel}>
    <div className={styles.tabs} role="group" aria-label="Explore Experience, Task, and Performance">
      {(['E', 'T', 'P'] as const).map((key) => <button key={key} type="button" aria-pressed={part === key} className={part === key ? styles.activeTab : styles.tab} onClick={() => setPart(key)}>{key}</button>)}
    </div>
    <div className={styles.tabContent} aria-live="polite"><strong>{detail[part][0]}</strong><p>{detail[part][1]}</p></div>
  </div>;
}

export function ProgrammingComparison() {
  const [mode, setMode] = useState<'traditional' | 'learning'>('traditional');
  const learning = mode === 'learning';
  return <div className={styles.panel}>
    <div className={styles.switcher} role="group" aria-label="Choose a programming approach">
      <button type="button" aria-pressed={!learning} className={!learning ? styles.activeTab : styles.tab} onClick={() => setMode('traditional')}>Traditional programming</button>
      <button type="button" aria-pressed={learning} className={learning ? styles.activeTab : styles.tab} onClick={() => setMode('learning')}>Supervised learning</button>
    </div>
    <div className={styles.flow} aria-live="polite">
      {learning ? <><span>Examples: inputs + correct answers</span><b aria-hidden="true">→</b><span className={styles.highlight}>Learning algorithm</span><b aria-hidden="true">→</b><span>Learned pattern for new inputs</span></> : <><span>Data + rules written by a programmer</span><b aria-hidden="true">→</b><span className={styles.highlight}>Computer</span><b aria-hidden="true">→</b><span>Output</span></>}
    </div>
    <p className={styles.caption} aria-live="polite">{learning ? 'The examples show the system what answers go with which inputs.' : 'The programmer specifies the rules that transform data into an output.'}</p>
  </div>;
}

export function PredictionVsCausation() {
  return <div className={styles.twoColumns}>
    <article className={styles.questionCard}><span className={styles.eyebrow}>Prediction</span><h3>Given a customer’s income, how likely are they to default?</h3><p>Suppose we observe that customers with lower income are more likely to default on their loans.</p><span className={styles.tag}>Forecast an outcome</span></article>
    <article className={`${styles.questionCard} ${styles.causal}`}><span className={styles.eyebrow}>Causation</span><h3>If we increased that customer’s income, would their probability of default decrease?</h3><p>This asks about the effect of a change, not only an observed association.</p><span className={styles.tag}>Ask about an effect</span></article>
    <p className={styles.note}>A prediction can be useful without explaining why an outcome occurs. Predictive accuracy by itself does not establish a causal relationship.</p>
  </div>;
}

const milestones = [
  { year: '1950s', title: 'Early learning programs', text: 'Early programs explored machine learning, alongside ideas about artificial neural networks. The field’s central question was already how a machine could improve through experience.' },
  { year: '1980s', title: 'Decision trees & backpropagation', text: 'Decision trees and backpropagation became part of the expanding set of methods for learning from examples.' },
  { year: '1990s', title: 'Regularization, SVMs, ensembles', text: 'Regularization, support vector machines, bagging, and boosting added influential approaches to the toolbox.' },
  { year: '2001', title: 'Random Forests & Gradient Boosting', text: 'Random Forests and Gradient Boosting became prominent ensemble approaches, combining multiple models.' },
  { year: '2012', title: 'AlexNet & ImageNet', text: 'AlexNet’s ImageNet result brought renewed attention to deep neural networks and the role of large image datasets and computing.' },
  { year: '2017', title: 'Transformers', text: 'The Transformer architecture introduced a new approach to sequence modeling that would become influential in language tasks.' },
  { year: '2020', title: 'GPT-3', text: 'GPT-3 demonstrated large-scale language modeling and brought broad attention to the capabilities of generative models.' },
];

export function MLHistoryTimeline() {
  const [selected, setSelected] = useState(0);
  const item = milestones[selected];
  return <div className={styles.timeline}>
    <div className={styles.timelineTrack} role="group" aria-label="Select a machine learning history milestone">
      {milestones.map((milestone, index) => <button type="button" key={milestone.year} aria-pressed={selected === index} aria-label={`${milestone.year}: ${milestone.title}`} className={selected === index ? styles.milestoneSelected : styles.milestone} onClick={() => setSelected(index)}><span className={styles.dot} /><span>{milestone.year}</span></button>)}
    </div>
    <article className={styles.milestoneDetail} aria-live="polite"><span className={styles.eyebrow}>{item.year}</span><h3>{item.title}</h3><p>{item.text}</p></article>
    <p className={styles.caption}>Each milestone added to the toolbox. New techniques did not make every earlier method obsolete.</p>
  </div>;
}

export function AlgorithmsDataCompute() {
  return <figure className={styles.ingredients}>
    <div className={styles.ingredientRow}><span><strong>Algorithms</strong><small>Better architectures and training techniques</small></span><span aria-hidden="true">×</span><span><strong>Data</strong><small>More digital examples and useful benchmarks</small></span><span aria-hidden="true">×</span><span><strong>Compute</strong><small>GPUs, specialized hardware, scalable systems</small></span></div>
    <div className={styles.result}>Progress</div>
    <figcaption>Progress ≈ Algorithms × Data × Compute <span>— a teaching metaphor, not a scientific equation.</span></figcaption>
  </figure>;
}
