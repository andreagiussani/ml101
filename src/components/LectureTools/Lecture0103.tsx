import React from 'react';
import styles from './lecture0103.module.css';

export function Lecture01Hero() {
  return <header className={`${styles.hero} ${styles.learning}`}>
    <div className={styles.copy}><p className={styles.kicker}>MACHINE LEARNING</p><h1>Examples<br />become rules.</h1><p>A learning procedure turns experience into a model, then uses that model to make a prediction.</p><a href="#1-what-is-machine-learning">Follow the path <span aria-hidden="true">↓</span></a></div>
    <div className={styles.art} role="img" aria-label="Examples flow into a learning procedure, which produces a model used to make a prediction.">
      <div className={styles.examples}><span>EXAMPLES</span><b>x₁ · y₁</b><b>x₂ · y₂</b><b>x₃ · y₃</b></div><i className={styles.arrow}>→</i><div className={styles.machine}><span>LEARNING<br />PROCEDURE</span><b>↗</b></div><i className={styles.arrow}>→</i><div className={styles.prediction}><span>MODEL</span><b>ŷ</b><small>NEW CASE</small></div>
    </div><span className={styles.index}>01 / 07</span>
  </header>;
}

export function Lecture02Hero() {
  return <header className={`${styles.hero} ${styles.incomplete}`}>
    <div className={styles.copy}><p className={styles.kicker}>INCOMPLETE DATA</p><h1>What’s missing<br />matters.</h1><p>A blank cell is not just a formatting problem. It raises a question about what we know, and why.</p><a href="#1-the-missing-value-in-the-spreadsheet">Inspect the gap <span aria-hidden="true">↓</span></a></div>
    <div className={`${styles.art} ${styles.tableArt}`} role="img" aria-label="A small customer data table contains a missing income value, highlighted for investigation.">
      <div className={styles.table}><div className={styles.tableHead}><span>CUSTOMER</span><span>AGE</span><span>INCOME</span></div><div><b>A</b><span>25</span><span>35</span></div><div><b>B</b><span>42</span><span>85</span></div><div><b>C</b><span>38</span><span className={styles.missing}>? <small>UNKNOWN</small></span></div><div><b>D</b><span>51</span><span>95</span></div></div>
      <div className={styles.note}><span>BEFORE FILLING</span><b>Ask why<br />it’s missing.</b><i aria-hidden="true">↖</i></div>
    </div><span className={styles.index}>02 / 07</span>
  </header>;
}

export function Lecture03Hero() {
  return <header className={`${styles.hero} ${styles.fit}`}>
    <div className={styles.copy}><p className={styles.kicker}>GENERALIZATION</p><h1>A perfect fit<br />can still…<br />fail.</h1><p>The goal is not to memorize the sample. It is to learn a pattern that survives new data.</p><a href="#1-when-a-close-fit-misses-the-point">Compare the curves <span aria-hidden="true">↓</span></a></div>
    <div className={`${styles.art} ${styles.plot}`} role="img" aria-label="A restrained smooth curve follows the underlying pattern while a wavy curve overfits sample points.">
      <svg viewBox="0 0 440 280" aria-hidden="true"><path className={styles.grid} d="M45 35V235H410M45 185H410M45 135H410M45 85H410"/><path className={styles.truth} d="M52 207 C105 195 115 108 175 112 S248 192 298 155 S355 65 402 58"/><path className={styles.overfit} d="M52 207 C72 190 81 184 95 174 S116 104 134 98 S150 128 171 114 S190 112 207 142 S225 190 245 180 S267 163 286 155 S310 138 322 122 S332 65 352 66 S369 82 382 69 S394 54 402 58"/>{[[52,207],[95,174],[134,98],[171,114],[207,142],[245,180],[286,155],[322,122],[352,66],[402,58]].map(([cx,cy],i)=><circle key={i} className={styles.point} cx={cx} cy={cy} r="4.5" />)}</svg>
      <div className={styles.plotLabels}><span><i className={styles.truthKey}/>Underlying pattern</span><span><i className={styles.overfitKey}/>Training fit</span></div>
    </div><span className={styles.index}>03 / 07</span>
  </header>;
}
