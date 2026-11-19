import React, { useState } from 'react';
import styles from './lecture05.module.css';

const cases = [
  {
    label: 'The borrowed average',
    tag: 'PREPROCESSING',
    setup: 'Before cross-validation, an analyst standardizes every row using the mean and standard deviation of the complete dataset.',
    leak: true,
    verdict: 'Information crossed the fold boundary.',
    why: 'Validation features helped determine the transformation applied to training data. Their labels stayed hidden, but their distribution did not.',
    fix: 'Split first. Fit the scaler on each training fold, then transform that fold’s validation data. Put scaling, imputation, and the estimator in one pipeline.',
  },
  {
    label: 'The clue from tomorrow',
    tag: 'PREDICTION TIME',
    setup: 'A credit-risk model predicts default at application time. One feature counts collection calls made after the customer defaulted.',
    leak: true,
    verdict: 'The feature arrives after the prediction moment.',
    why: 'The feature records a consequence of the outcome. A perfect cross-validation score cannot make it available at application time.',
    fix: 'Write down the prediction timestamp, then check when every feature is created, recorded, and available to the system.',
  },
  {
    label: 'The familiar customer',
    tag: 'SPLIT DESIGN',
    setup: 'The goal is to predict for new customers. Randomly splitting transactions puts some customers in both training and validation.',
    leak: true,
    verdict: 'The split lets the model meet the same customer twice.',
    why: 'Customer-specific patterns can carry across the boundary. The score may describe repeat observations of known customers, not new ones.',
    fix: 'Use grouped splitting so every row from one customer stays in a single fold. If deployment predicts for existing customers, design the evaluation for that task instead.',
  },
  {
    label: 'Tomorrow’s demand',
    tag: 'TIME ORDER',
    setup: 'A team forecasts next week’s demand but randomly shuffles dates, letting later months appear in training while earlier months are validated.',
    leak: true,
    verdict: 'The model learned from the future it is asked to predict.',
    why: 'Random folds do not recreate a forward-looking forecast when time changes what information is available.',
    fix: 'Train on earlier periods and validate on later ones. Move the cutoff forward for rolling-origin evaluation; add a gap when windows overlap or data arrive late.',
  },
  {
    label: 'The test that gave advice',
    tag: 'MODEL SELECTION',
    setup: 'A researcher checks the test score, changes the feature set, checks again, and keeps the version with the best test result.',
    leak: true,
    verdict: 'The test set has become part of model selection.',
    why: 'No coefficients were fitted on test rows, but the sequence of decisions learned from test feedback. The reported best score is now optimistic.',
    fix: 'Use development data for iteration. Reserve the test for a final evaluation; if it has already guided choices, get a fresh test set or evaluate the full selection procedure with nested cross-validation.',
  },
];

export function LeakageDetective() {
  const [selected, setSelected] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const scenario = cases[selected];
  const choose = (index: number) => { setSelected(index); setRevealed(false); };

  return <section className={styles.detective} aria-labelledby="detective-title">
    <div className={styles.detectiveTop}>
      <div><p className={styles.eyebrow}>THE EXPERIMENT ROOM · CASE FILES</p><h2 id="detective-title">Find the leak.</h2><p>Read the workflow. Decide whether information crossed a boundary it should have respected, then reveal the diagnosis.</p></div>
      <div className={styles.caseCounter}><strong>0{selected + 1}</strong><span>/ 0{cases.length}</span><i style={{ width: `${(selected + 1) / cases.length * 100}%` }} /></div>
    </div>
    <div className={styles.caseTabs} role="group" aria-label="Choose a leakage case">
      {cases.map((item, index) => <button key={item.label} type="button" aria-pressed={selected === index} className={selected === index ? styles.caseActive : styles.caseTab} onClick={() => choose(index)}><span>CASE 0{index + 1}</span><strong>{item.label}</strong></button>)}
    </div>
    <article className={styles.caseFile}>
      <div className={styles.caseMeta}><span>{scenario.tag}</span><span>FIELD REPORT · {String(selected + 1).padStart(2, '0')}</span></div>
      <p className={styles.caseSetup}>{scenario.setup}</p>
      {!revealed ? <div className={styles.verdictPrompt}>
        <p>Where does information flow?</p>
        <div><button type="button" onClick={() => setRevealed(true)}>Inspect the workflow <span aria-hidden="true">↗</span></button></div>
      </div> : <div className={styles.diagnosis} role="status">
        <div className={styles.flowSketch} aria-label="Information from held-out data crossed into the model development process">
          <span>HELD-OUT<br />INFORMATION</span><b aria-hidden="true">···</b><i aria-hidden="true">↗</i><span>MODEL<br />DECISIONS</span>
        </div>
        <div><p className={styles.verdict}>LEAK FOUND <span aria-hidden="true">↗</span></p><h3>{scenario.verdict}</h3><p>{scenario.why}</p><p className={styles.fix}><strong>Repair:</strong> {scenario.fix}</p></div>
      </div>}
    </article>
    <p className={styles.finePrint}>The word “leakage” covers several failures. The common question is: did the experiment use information that would be unavailable for the decision it claims to evaluate?</p>
  </section>;
}

export function LeakagePipeline() {
  return <div className={styles.pipeline} role="img" aria-label="Within each cross-validation round, fit preprocessing and the model on the training fold, then score on the held-out fold">
    <div className={styles.pipelineHeader}><span>ONE VALIDATION ROUND</span><b>LEARN → APPLY → SCORE</b></div>
    <div className={styles.pipelineFlow}>
      <div className={styles.dataBlock}><span>TRAIN FOLD</span><strong>Fit imputer<br />Fit scaler<br />Fit model</strong></div>
      <i aria-hidden="true">→</i>
      <div className={styles.dataBlock}><span>FITTED PIPELINE</span><strong>Transform<br />Predict</strong></div>
      <i aria-hidden="true">→</i>
      <div className={`${styles.dataBlock} ${styles.validationBlock}`}><span>HELD-OUT FOLD</span><strong>Transform<br />Score only</strong></div>
    </div>
    <p>Every learned step stays inside the training fold. The held-out fold only receives the fitted pipeline’s predictions.</p>
  </div>;
}

export function PredictionMomentCheck() {
  const [checked, setChecked] = useState(false);
  return <section className={styles.momentCard}>
    <div><p className={styles.eyebrow}>BEFORE YOU ADD A FEATURE</p><h3>Ask it one question.</h3><p>“Would this value be known, recorded, and available at the exact moment the prediction is made?”</p></div>
    <button type="button" aria-pressed={checked} onClick={() => setChecked(!checked)}>{checked ? 'Checklist opened ✓' : 'Open the checklist →'}</button>
    {checked && <ul className={styles.momentList}><li>Define the prediction time and target window.</li><li>Trace the feature’s source and timestamp, not just its column name.</li><li>Check reporting delays, revisions, and downstream consequences.</li><li>Repeat the audit after joins and aggregations.</li></ul>}
  </section>;
}
