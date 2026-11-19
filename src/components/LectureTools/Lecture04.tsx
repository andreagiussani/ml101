import React, { useState } from 'react';
import styles from './lecture04.module.css';

const candidates = [
  { lambda: '0.001', scores: [0.31, 0.16, 0.24, 0.20, 0.33] },
  { lambda: '0.01', scores: [0.22, 0.20, 0.24, 0.21, 0.24] },
  { lambda: '0.1', scores: [0.17, 0.15, 0.19, 0.16, 0.20] },
  { lambda: '1', scores: [0.24, 0.18, 0.30, 0.22, 0.27] },
];
const average = (scores: number[]) => scores.reduce((sum, value) => sum + value, 0) / scores.length;
const winningIndex = candidates.reduce((winner, candidate, index) => average(candidate.scores) < average(candidates[winner].scores) ? index : winner, 0);

const mathNode = (tag: string, ...children: React.ReactNode[]) => React.createElement(tag as React.ElementType, null, ...children);
const mi = (value: string) => mathNode('mi', value);
const mo = (value: string) => mathNode('mo', value);
const mn = (value: string) => mathNode('mn', value);
const mrow = (...children: React.ReactNode[]) => mathNode('mrow', ...children);

export function CrossValidationFormula() {
  const prediction = mathNode('msubsup', mathNode('mover', mi('f'), mo('^')), mi('λ'), mrow(mo('('), mo('−'), mi('k'), mo(')')));
  const formula = mrow(
    mathNode('msub', mathNode('mover', mi('R'), mo('^')), mi('CV')), mo('('), mi('λ'), mo(')'), mo('='),
    mathNode('mfrac', mn('1'), mi('n')),
    mathNode('munderover', mo('∑'), mrow(mi('k'), mo('='), mn('1')), mi('K')),
    mathNode('munder', mo('∑'), mrow(mi('i'), mo('∈'), mathNode('msub', mi('V'), mi('k')))),
    mi('L'), mo('('), mathNode('msub', mi('y'), mi('i')), mo(','), prediction, mo('('), mathNode('msub', mi('x'), mi('i')), mo(')'), mo(')'),
  );
  const equalFoldFormula = mrow(
    mathNode('msub', mathNode('mover', mi('R'), mo('^')), mi('CV')), mo('('), mi('λ'), mo(')'), mo('='),
    mathNode('mfrac', mn('1'), mi('K')),
    mathNode('munderover', mo('∑'), mrow(mi('k'), mo('='), mn('1')), mi('K')),
    mathNode('msub', mathNode('mover', mi('R'), mo('^')), mi('k')), mo('('), mi('λ'), mo(')'),
  );
  return <div className={styles.formulaCard}>
    <div className={styles.formulaViewport}>
      {React.createElement('math' as React.ElementType, { display: 'block', 'aria-label': 'Cross-validation risk for lambda equals one over n times the sum over folds k from one to K and observations i in validation fold k of capital L of y i and the prediction from the model fitted without fold k.' }, formula)}
    </div>
    <p><strong>n</strong> is the number of development observations; <strong>V<sub>k</sub></strong> is the set of observations in fold <em>k</em>; and <strong>f̂<sup>(−k)</sup><sub>λ</sub></strong> is the model fitted without that fold. Each observation contributes one loss, from the round when it was held out.</p>
    <p className={styles.equalFold}>With equally sized folds, this is the familiar average of the K fold-average losses:
      <span className={styles.formulaViewport}>{React.createElement('math' as React.ElementType, { display: 'block', 'aria-label': 'Cross-validation risk for lambda equals one over K times the sum over k from one to K of the average loss in fold k.' }, equalFoldFormula)}</span>
    </p>
  </div>;
}

const splitExamples = [
  { score: '0.18', validation: [1, 6] },
  { score: '0.25', validation: [2, 5] },
  { score: '0.21', validation: [0, 4] },
];

export function SingleSplitChart() {
  const [selected, setSelected] = useState(0);
  return <section className={styles.splitChart} aria-labelledby="single-split-title">
    <div className={styles.splitChartHeading}><div><p className={styles.eyebrow}>ONE RANDOM DRAW</p><h3 id="single-split-title">A split is a sample too.</h3></div><span className={styles.labStamp}>ILLUSTRATIVE</span></div>
    <p>Set the final test set aside first. Inside development data, one random assignment makes a fit set and a validation set. Change the split to see how the validation score can move.</p>
    <div className={styles.dataPartition} role="img" aria-label="All observations are divided into 75 percent development data and 25 percent untouched test data">
      <div className={styles.developmentPart}><strong>Development data</strong><span>75% · use to fit and choose</span></div>
      <div className={styles.testPart}><strong>Test data</strong><span>25% · seal until the end</span></div>
    </div>
    <p className={styles.partitionCaption}>Then make one 75 / 25 fit–validation split <em>inside the development data</em>:</p>
    <div className={styles.splitRows} role="group" aria-label="Choose an illustrative random split">
      {splitExamples.map((example, row) => <button type="button" key={example.score} aria-pressed={selected === row} className={`${styles.splitRow} ${selected === row ? styles.splitRowActive : ''}`} onClick={() => setSelected(row)}>
        <span className={styles.splitName}>Split {row + 1}</span>
        <span className={styles.splitCells}>{Array.from({ length: 8 }, (_, cell) => <i key={cell} className={example.validation.includes(cell) ? styles.splitValidation : styles.splitTrain} />)}</span>
        <span className={styles.splitScore}>{example.score}<small>loss</small></span>
      </button>)}
    </div>
    <p className={styles.splitLegend}><i className={styles.splitTrain} /> Fit · 75% <i className={styles.splitValidation} /> Validate · 25%</p>
    <p className={styles.splitReadout} aria-live="polite">Selected split: <strong>{selected + 1}</strong> · validation loss <strong>{splitExamples[selected].score}</strong>. The test set remains untouched.</p>
  </section>;
}

export function Lecture04Hero() {
  return <header className={styles.hero}>
    <div className={styles.heroCopy}>
      <p className={styles.heroKicker}><span /> ML101 · FIELD NOTES 04</p>
      <h1>Trust,<br />but verify.</h1>
      <p className={styles.heroDek}>A model aced the practice test. Would you trust it with the real one?</p>
      <a className={styles.heroLink} href="#the-exam">See how we test a model <span aria-hidden="true">↓</span></a>
    </div>
    <div className={styles.examArt} aria-label="Three separate stages: learn, choose, and judge">
      <div className={`${styles.paper} ${styles.paperBack}`}><span>EXAM 01</span><i>•••</i><i>••</i></div>
      <div className={`${styles.paper} ${styles.paperMiddle}`}><span>EXAM 02</span><i>••</i><i>•••</i></div>
      <div className={`${styles.paper} ${styles.paperFront}`}><span>FINAL</span><b>?</b><small>KEEP SEALED</small></div>
      <span className={styles.artCaption}>LEARN <b>→</b> CHOOSE <b>→</b> JUDGE</span>
    </div>
    <span className={styles.heroIndex}>04 / 07</span>
  </header>;
}

export function CrossValidationLab() {
  const [selected, setSelected] = useState(winningIndex);
  const [fold, setFold] = useState(0);
  const model = candidates[selected];
  const bestMean = average(candidates[winningIndex].scores);
  return <section className={styles.lab} aria-labelledby="cv-lab-title">
    <div className={styles.labHeader}><div><p className={styles.eyebrow}>THE FIVE-EXAM LAB</p><h3 id="cv-lab-title">Same candidates. Five different rooms.</h3></div><span className={styles.labStamp}>ILLUSTRATIVE DATA</span></div>
    <p>Each candidate λ gets evaluated on the same five folds. Pick a row, then tap a fold to inspect that particular exam. Lower loss is better.</p>
    <div className={styles.foldStrip} role="group" aria-label="Inspect one validation fold">
      {model.scores.map((score, index) => <button type="button" key={index} aria-pressed={fold === index} className={fold === index ? styles.foldActive : styles.fold} onClick={() => setFold(index)}><span>FOLD 0{index + 1}</span><strong>{score.toFixed(2)}</strong></button>)}
    </div>
    <div className={styles.scoreBoard}>
      {candidates.map((candidate, index) => {
        const mean = average(candidate.scores);
        return <button key={candidate.lambda} type="button" className={`${styles.scoreRow} ${selected === index ? styles.scoreRowActive : ''}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>
          <span className={styles.lambdaLabel}>λ = {candidate.lambda}</span>
          <span className={styles.barTrack}><i style={{ width: `${Math.min(100, mean / 0.35 * 100)}%` }} /></span>
          <span className={styles.meanLabel}>{mean.toFixed(3)} <small>mean</small></span>
          {index === winningIndex && <span className={styles.winnerTag}>LOWEST</span>}
        </button>;
      })}
    </div>
    <div className={styles.labReadout} aria-live="polite"><span className={styles.readoutIcon}>↳</span><p><strong>λ = {model.lambda}</strong> scores {model.scores[fold].toFixed(2)} on fold 0{fold + 1}, and averages <strong>{average(model.scores).toFixed(3)}</strong> across all five. {selected === winningIndex ? 'It wins this illustrative comparison.' : `The lowest mean here is ${bestMean.toFixed(3)} at λ = ${candidates[winningIndex].lambda}.`}</p></div>
    <p className={styles.finePrint}>All losses are invented for teaching. In practice, reuse the same folds for every candidate so the comparison is fair.</p>
  </section>;
}

export function FinalExamReveal() {
  const [revealed, setRevealed] = useState(false);
  return <section className={styles.finalExam} aria-labelledby="final-exam-title">
    <div className={styles.finalCopy}><p className={styles.eyebrow}>THE SEALED ENVELOPE</p><h3 id="final-exam-title">One last exam.<br />One honest answer.</h3><p>After choosing λ using development data, refit the chosen model on all development data. Then evaluate it once on the untouched test set.</p><p className={styles.finalFine}>This example score is fictional. The point is the boundary: once inspected, the test result must not steer another round of choices.</p></div>
    <div className={`${styles.envelope} ${revealed ? styles.envelopeOpen : ''}`}>
      <span className={styles.envelopeLabel}>FINAL TEST SCORE</span>
      {revealed ? <><strong className={styles.finalScore}>0.19</strong><span className={styles.envelopeSub}>ONE READ. FILED.</span></> : <><div className={styles.seal} aria-hidden="true">?</div><button type="button" className={styles.openButton} onClick={() => setRevealed(true)}>Evaluate once <span aria-hidden="true">↗</span></button></>}
    </div>
  </section>;
}
