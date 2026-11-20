import React, { useMemo, useState } from 'react';
import styles from './lecture06.module.css';

const students = [
  { id: 'A', x: 2, y: 7 },
  { id: 'B', x: 3, y: 10 },
  { id: 'C', x: 7, y: 16 },
  { id: 'D', x: 8, y: 15 },
];

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const sse = (values: number[]) => { const center = mean(values); return values.reduce((sum, value) => sum + (value - center) ** 2, 0); };
const round = (value: number, digits = 2) => Number(value.toFixed(digits));

function splitAt(threshold: number) {
  const left = students.filter((student) => student.x <= threshold);
  const right = students.filter((student) => student.x > threshold);
  const leftMean = mean(left.map((student) => student.y));
  const rightMean = mean(right.map((student) => student.y));
  return { left, right, leftMean, rightMean, error: sse(left.map((s) => s.y)) + sse(right.map((s) => s.y)) };
}

const bestTreeSplit = splitAt(5);
const stumpError = sse(students.map((student) => student.y));

export function Lecture06Hero() {
  return <header className={styles.hero}>
    <div className={styles.heroText}>
      <p className={styles.kicker}>ML101 · FIELD NOTES 06</p>
      <h1>One question.<br />One correction.</h1>
      <p>A tree divides the world into regions. Boosting learns what to add when those regions still miss something.</p>
      <nav className={styles.heroNav} aria-label="Lecture sections"><a href="#trees">01 · Trees</a><a href="#boosting">02 · Boosting</a></nav>
    </div>
    <div className={styles.heroArt} role="img" aria-label="A decision tree branches into regions, then small corrections accumulate into a prediction">
      <div className={styles.treeRoot}>ASK A QUESTION</div>
      <div className={styles.branch}><span>YES</span><span>NO</span></div>
      <div className={styles.leafRow}><i>REGION 1</i><i>REGION 2</i></div>
      <div className={styles.correctionLabel}>THEN ADD WHAT IS STILL MISSING</div>
      <div className={styles.corrections}><b>F₀</b><span>+</span><b>ηh₁</b><span>+</span><b>ηh₂</b><span>+</span><b>…</b></div>
    </div>
    <span className={styles.heroIndex}>LECTURE 06</span>
  </header>;
}

function RegressionPlot({ threshold }: { threshold: number }) {
  const { leftMean, rightMean } = splitAt(threshold);
  const x = (value: number) => 48 + value / 10 * 440;
  const y = (value: number) => 270 - (value - 5) / 14 * 220;
  return <svg className={styles.plot} viewBox="0 0 520 320" role="img" aria-label={`Regression tree split at ${threshold.toFixed(1)} study hours. Left leaf predicts ${leftMean.toFixed(1)}, right leaf predicts ${rightMean.toFixed(1)}.`}>
    {[5, 10, 15].map((tick) => <g key={tick}><line x1="48" x2="488" y1={y(tick)} y2={y(tick)} className={styles.gridLine} /><text x="36" y={y(tick) + 4} textAnchor="end" className={styles.axisText}>{tick}</text></g>)}
    {[0, 2, 4, 6, 8, 10].map((tick) => <g key={tick}><line x1={x(tick)} x2={x(tick)} y1="50" y2="270" className={styles.gridLineSoft} /><text x={x(tick)} y="292" textAnchor="middle" className={styles.axisText}>{tick}</text></g>)}
    <line x1="48" x2="488" y1="270" y2="270" className={styles.axisLine} />
    <line x1="48" x2="48" y1="50" y2="270" className={styles.axisLine} />
    <path d={`M ${x(0)} ${y(leftMean)} H ${x(threshold)} V ${y(rightMean)} H ${x(10)}`} className={styles.treeStep} />
    <line x1={x(threshold)} x2={x(threshold)} y1="50" y2="270" className={styles.thresholdLine} />
    <rect x={x(threshold) - 32} y="25" width="64" height="22" rx="11" className={styles.thresholdTag} />
    <text x={x(threshold)} y="40" textAnchor="middle" className={styles.thresholdTagText}>{threshold.toFixed(1)} h</text>
    {students.map((student) => <g key={student.id}><circle cx={x(student.x)} cy={y(student.y)} r="6" className={student.x <= threshold ? styles.pointLeft : styles.pointRight} /><text x={x(student.x)} y={y(student.y) - 11} textAnchor="middle" className={styles.pointLabel}>{student.id}</text></g>)}
    <text x="268" y="316" textAnchor="middle" className={styles.axisTitle}>Study time (hours / week)</text>
    <text x="14" y="159" textAnchor="middle" transform="rotate(-90 14 159)" className={styles.axisTitle}>Predicted grade</text>
  </svg>;
}

export function TreeSplitLab() {
  const [threshold, setThreshold] = useState(5);
  const [alpha, setAlpha] = useState(10);
  const current = splitAt(threshold);
  const stumpCost = stumpError + alpha;
  const splitCost = current.error + 2 * alpha;
  const chooseSplit = splitCost < stumpCost;
  const reduction = stumpError - current.error;
  return <section className={styles.lab} aria-labelledby="tree-lab-title">
    <div className={styles.labHeading}><div><p className={styles.eyebrow}>REGRESSION TREE · LIVE SPLIT</p><h3 id="tree-lab-title">Move the question.</h3></div><span className={styles.synthetic}>SYNTHETIC CLASSROOM EXAMPLE</span></div>
    <p className={styles.labIntro}>Four students, one target: final grade G3. Drag the study-time threshold. The tree assigns each leaf its own mean, then the plot and squared error update.</p>
    <div className={styles.splitLayout}>
      <div className={styles.plotFrame}><RegressionPlot threshold={threshold} /><div className={styles.plotLegend}><span><i className={styles.legendLeft} /> Left leaf</span><span><i className={styles.legendRight} /> Right leaf</span><span><i className={styles.legendDots} /> Observed grade</span></div></div>
      <div className={styles.controls}>
        <label htmlFor="tree-threshold">Question threshold <strong>{threshold.toFixed(1)} hours</strong></label>
        <input id="tree-threshold" type="range" min="2.5" max="7.5" step="0.1" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} />
        <p className={styles.controlHint}>“Study time ≤ {threshold.toFixed(1)}?”</p>
        <div className={styles.leafStats}><div><span>YES · {current.left.map((student) => student.id).join(', ')}</span><strong>{current.leftMean.toFixed(1)}</strong><small>mean grade</small></div><div><span>NO · {current.right.map((student) => student.id).join(', ')}</span><strong>{current.rightMean.toFixed(1)}</strong><small>mean grade</small></div></div>
        <div className={styles.metric}><span>Within-leaf SSE</span><strong>{current.error.toFixed(2)}</strong><small>reduction from stump: {reduction.toFixed(2)}</small></div>
      </div>
    </div>
    <div className={styles.mathBand}><span>THE TREE’S PREDICTION</span><strong>f̂(x) = Σ<sub>m=1</sub><sup>M</sup> c<sub>m</sub> · 𝟙[x ∈ R<sub>m</sub>]</strong><p>Each terminal region R<sub>m</sub> gets one constant c<sub>m</sub>. Under squared error, that constant is the mean outcome in the leaf.</p></div>
    <div className={styles.pruning}>
      <div><p className={styles.eyebrow}>REGULARIZE THE TREE</p><h4>How expensive is another leaf?</h4><p>Cost-complexity pruning adds α for every leaf. Compare the current split with a one-leaf stump.</p></div>
      <div className={styles.pruneControl}><label htmlFor="tree-alpha">Leaf penalty α <strong>{alpha}</strong></label><input id="tree-alpha" type="range" min="0" max="60" step="1" value={alpha} onChange={(event) => setAlpha(Number(event.target.value))} /><div className={styles.costCompare}><span>Stump: 54 + α = <b>{stumpCost.toFixed(1)}</b></span><span>Split: {current.error.toFixed(1)} + 2α = <b>{splitCost.toFixed(1)}</b></span></div><p className={styles.costWinner} aria-live="polite">{chooseSplit ? 'Keep the split: its fit improvement is worth the extra leaf.' : 'Prune to the stump: the extra leaf costs more than it saves.'}</p></div>
    </div>
    <p className={styles.footnote}>For this four-row example, the best split is between 3 and 7 hours: SSE falls from 54 to 5, a reduction of 49. The α scale depends on how the loss is defined and how many observations are used.</p>
  </section>;
}

const gini = (p: number) => 2 * p * (1 - p);
const entropy = (p: number) => p === 0 || p === 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);

export function ClassificationImpurityLab() {
  const [probability, setProbability] = useState(0.5);
  const width = 440; const height = 180;
  const px = (p: number) => 45 + p * width;
  const py = (value: number) => 190 - value * height;
  const curve = (fn: (p: number) => number) => Array.from({ length: 41 }, (_, i) => { const p = i / 40; return `${i === 0 ? 'M' : 'L'} ${px(p)} ${py(fn(p))}`; }).join(' ');
  return <section className={styles.impurityLab} aria-labelledby="impurity-title">
    <div><p className={styles.eyebrow}>CLASSIFICATION TREE · NODE PURITY</p><h3 id="impurity-title">A split should make the leaves more certain.</h3><p>For a binary outcome, p is the share of class 1 in a node. Move p to compare two impurity measures.</p></div>
    <div className={styles.impurityGrid}>
      <div className={styles.impurityPlot}><svg viewBox="0 0 520 225" role="img" aria-label="Gini impurity and binary entropy curves over class probability p, with a marker at the selected probability">
        {[0, .5, 1].map((tick) => <g key={tick}><line x1="45" x2="485" y1={py(tick)} y2={py(tick)} className={styles.gridLine} /><text x="37" y={py(tick) + 4} textAnchor="end" className={styles.axisText}>{tick.toFixed(1)}</text></g>)}
        <path d={curve(gini)} className={styles.giniLine} /><path d={curve(entropy)} className={styles.entropyLine} />
        <line x1={px(probability)} x2={px(probability)} y1="10" y2="190" className={styles.impurityMarker} />
        <circle cx={px(probability)} cy={py(gini(probability))} r="5" className={styles.giniPoint} /><circle cx={px(probability)} cy={py(entropy(probability))} r="5" className={styles.entropyPoint} />
        {[0, .25, .5, .75, 1].map((tick) => <text key={tick} x={px(tick)} y="213" textAnchor="middle" className={styles.axisText}>{tick.toFixed(2)}</text>)}
      </svg><div className={styles.curveLegend}><span><i className={styles.giniSwatch} /> Gini · 2p(1−p)</span><span><i className={styles.entropySwatch} /> Entropy · −p log₂p − (1−p)log₂(1−p)</span></div></div>
      <div className={styles.impurityControls}><label htmlFor="class-proportion">Class 1 proportion <strong>p = {probability.toFixed(2)}</strong></label><input id="class-proportion" type="range" min="0" max="1" step="0.01" value={probability} onChange={(event) => setProbability(Number(event.target.value))} /><div className={styles.impurityReadout}><div><span>Gini impurity</span><strong>{gini(probability).toFixed(3)}</strong></div><div><span>Entropy (bits)</span><strong>{entropy(probability).toFixed(3)}</strong></div></div><p>{probability === 0 || probability === 1 ? 'A pure node: every observed label belongs to one class.' : probability === .5 ? 'Maximum uncertainty: the classes are evenly represented.' : 'More mixing means more impurity; a split is useful when its weighted child impurity falls.'}</p></div>
    </div>
    <p className={styles.footnote}>CART chooses a split by reducing weighted child-node impurity. A pure training leaf can still be a poor prediction for new data if it contains too few observations.</p>
  </section>;
}

function BoostingHistory({ eta, stages }: { eta: number; stages: number }) {
  const path = useMemo(() => Array.from({ length: stages + 1 }, (_, m) => {
    const left = 8.5 + (12 - 8.5) * (1 - eta) ** m;
    const right = 15.5 + (12 - 15.5) * (1 - eta) ** m;
    const error = 5 + 49 * (1 - eta) ** (2 * m);
    return { m, left, right, error };
  }), [eta, stages]);
  const x = (m: number) => 40 + m / 10 * 300;
  const y = (grade: number) => 154 - (grade - 7) / 11 * 126;
  const sseY = (value: number) => 154 - (value - 5) / 49 * 126;
  const leftLine = path.map((point, i) => `${i === 0 ? 'M' : 'L'} ${x(point.m)} ${y(point.left)}`).join(' ');
  const rightLine = path.map((point, i) => `${i === 0 ? 'M' : 'L'} ${x(point.m)} ${y(point.right)}`).join(' ');
  const errorLine = path.map((point, i) => `${i === 0 ? 'M' : 'L'} ${x(point.m)} ${sseY(point.error)}`).join(' ');
  return <div className={styles.boostPlots}>
    <div className={styles.miniPlot}><p className={styles.plotLabel}>LEAF PREDICTIONS · GRADES</p><svg viewBox="0 0 370 190" role="img" aria-label={`After ${stages} trees at learning rate ${eta.toFixed(1)}, the low-study prediction is ${path[stages].left.toFixed(2)} and high-study prediction is ${path[stages].right.toFixed(2)}; they approach 8.5 and 15.5.`}>
      {[8.5, 12, 15.5].map((v) => <g key={v}><line x1="40" x2="340" y1={y(v)} y2={y(v)} className={styles.gridLine} /><text x="32" y={y(v) + 4} textAnchor="end" className={styles.axisText}>{v}</text></g>)}
      <path d={leftLine} className={styles.lowPredictionLine} /><path d={rightLine} className={styles.highPredictionLine} />
      <line x1="40" x2="340" y1={y(8.5)} y2={y(8.5)} className={styles.targetDash} /><line x1="40" x2="340" y1={y(15.5)} y2={y(15.5)} className={styles.targetDash} />
      {path.map((point) => <g key={point.m}><circle cx={x(point.m)} cy={y(point.left)} r={point.m === stages ? 4.5 : 2.5} className={styles.lowPredictionPoint} /><circle cx={x(point.m)} cy={y(point.right)} r={point.m === stages ? 4.5 : 2.5} className={styles.highPredictionPoint} /></g>)}
      <text x="40" y="176" className={styles.axisText}>0 trees</text><text x="340" y="176" textAnchor="end" className={styles.axisText}>10 trees</text>
    </svg><div className={styles.curveLegend}><span><i className={styles.lowSwatch} /> Low-study leaf</span><span><i className={styles.highSwatch} /> High-study leaf</span><span><i className={styles.targetSwatch} /> Leaf target</span></div></div>
    <div className={styles.miniPlot}><p className={styles.plotLabel}>TRAINING SSE · LOWER IS BETTER</p><svg viewBox="0 0 370 190" role="img" aria-label={`Training sum of squared errors decreases from 54 to ${path[stages].error.toFixed(2)} after ${stages} trees.`}>
      {[5, 30, 54].map((v) => <g key={v}><line x1="40" x2="340" y1={sseY(v)} y2={sseY(v)} className={styles.gridLine} /><text x="32" y={sseY(v) + 4} textAnchor="end" className={styles.axisText}>{v}</text></g>)}
      <path d={errorLine} className={styles.errorLine} />
      {path.map((point) => <circle key={point.m} cx={x(point.m)} cy={sseY(point.error)} r={point.m === stages ? 5 : 3} className={point.m === stages ? styles.activeErrorPoint : styles.errorPoint} />)}
      <text x="40" y="176" className={styles.axisText}>0 trees</text><text x="340" y="176" textAnchor="end" className={styles.axisText}>10 trees</text>
    </svg><p className={styles.chartNote}>For this fixed split: SSE = 5 + 49(1 − η)<sup>2M</sup>. The remaining 5 is within-leaf variation.</p></div>
  </div>;
}

export function BoostingLab() {
  const [eta, setEta] = useState(0.5);
  const [stages, setStages] = useState(1);
  const history = Array.from({ length: stages + 1 }, (_, m) => ({ m, left: 8.5 + 3.5 * (1 - eta) ** m, right: 15.5 - 3.5 * (1 - eta) ** m }));
  const current = history[stages];
  const residuals = students.map((student) => ({ ...student, prediction: student.x <= 5 ? current.left : current.right, residual: student.y - (student.x <= 5 ? current.left : current.right) }));
  const sseNow = 5 + 49 * (1 - eta) ** (2 * stages);
  const firstLeftUpdate = mean(students.filter((student) => student.x <= 5).map((student) => student.y - 12));
  const firstRightUpdate = mean(students.filter((student) => student.x > 5).map((student) => student.y - 12));
  return <section className={styles.boostLab} aria-labelledby="boost-lab-title">
    <div className={styles.labHeading}><div><p className={styles.eyebrow}>BOOSTING · A SEQUENCE OF CORRECTIONS</p><h3 id="boost-lab-title">Teach the model to try again.</h3></div><span className={styles.synthetic}>SAME FOUR STUDENTS</span></div>
    <p className={styles.labIntro}>Start with the average grade. A small tree learns the residuals, then we add only a fraction of its correction. Move the learning rate and number of trees to watch the ensemble evolve.</p>
    <div className={styles.boostControls}>
      <div><label htmlFor="boost-rate">Learning rate η <strong>{eta.toFixed(1)}</strong></label><input id="boost-rate" type="range" min="0.1" max="1" step="0.1" value={eta} onChange={(event) => setEta(Number(event.target.value))} /><p>What fraction of each correction do we add?</p></div>
      <div><label htmlFor="boost-stages">Number of trees M <strong>{stages}</strong></label><input id="boost-stages" type="range" min="0" max="10" step="1" value={stages} onChange={(event) => setStages(Number(event.target.value))} /><p>How many correction steps have we taken?</p></div>
    </div>
    <div className={styles.boostEquation}><span>STAGEWISE UPDATE</span><strong>F<sub>m</sub>(x) = F<sub>m−1</sub>(x) + η h<sub>m</sub>(x)</strong><p>For tree 1, F₀ = 12; the residual means are {firstLeftUpdate.toFixed(1)} and +{firstRightUpdate.toFixed(1)}. With η = {eta.toFixed(1)}, the first predictions are {(12 + eta * firstLeftUpdate).toFixed(2)} and {(12 + eta * firstRightUpdate).toFixed(2)}.</p></div>
    <BoostingHistory eta={eta} stages={stages} />
    <div className={styles.currentModel}><div><span>AFTER {stages} {stages === 1 ? 'TREE' : 'TREES'}</span><strong>Training SSE {sseNow.toFixed(2)}</strong><small>leaf targets: 8.5 and 15.5</small></div><div><span>WHAT THE MODEL CURRENTLY PREDICTS</span><strong>Low study: {current.left.toFixed(2)} <i>·</i> High study: {current.right.toFixed(2)}</strong><small>Correction tree output is a change, not a final prediction.</small></div></div>
    <div className={styles.residualTableWrap}><table className={styles.residualTable}><caption>Residuals after the selected number of correction trees</caption><thead><tr><th>Student</th><th>Observed y</th><th>Current F<sub>M</sub></th><th>Residual y − F<sub>M</sub></th></tr></thead><tbody>{residuals.map((student) => <tr key={student.id}><th>{student.id}</th><td>{student.y}</td><td>{student.prediction.toFixed(2)}</td><td className={student.residual >= 0 ? styles.positiveResidual : styles.negativeResidual}>{student.residual > 0 ? '+' : ''}{student.residual.toFixed(2)}</td></tr>)}</tbody></table></div>
    <p className={styles.footnote}>This teaching animation keeps the same 5-hour split at every stage. Real gradient boosting can choose different features and splits as the pseudo-residuals change.</p>
  </section>;
}

export function LogisticGradientCard() {
  return <div className={styles.logisticCard}>
    <div><p className={styles.eyebrow}>SAME IDEA · A DIFFERENT LOSS</p><h3>For classification, correct the probability.</h3><p>Let F(x) be a log-odds score and p(x) = σ(F(x)). With binary log loss, the negative gradient is y − p: observed class minus predicted probability.</p></div>
    <div className={styles.logisticMath}><span>LOGISTIC LOSS</span><strong>L(y,F) = −y log p − (1−y) log(1−p)</strong><span>NEGATIVE GRADIENT</span><strong>−∂L / ∂F = y − p</strong><small>The next tree predicts a correction to the score; applying σ turns the updated score into a probability.</small></div>
  </div>;
}

const validationSketch = [49, 39, 32, 26, 22, 20, 19, 20, 23, 27, 33];

export function EarlyStoppingLab() {
  const [trees, setTrees] = useState(6);
  const x = (m: number) => 42 + m / 10 * 430;
  const y = (loss: number) => 182 - (loss - 15) / 40 * 145;
  const training = validationSketch.map((_, m) => 49 * Math.exp(-m * 0.22) + 5);
  const line = (values: number[]) => values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const valBest = Math.min(...validationSketch);
  const bestTrees = validationSketch.indexOf(valBest);
  return <section className={styles.stopLab} aria-labelledby="stop-title">
    <div><p className={styles.eyebrow}>THE STOPPING QUESTION</p><h3 id="stop-title">More trees are not a free lunch.</h3><p>Training loss often keeps falling. Validation loss can stop improving as later trees start fitting sample-specific noise. Drag M to inspect this <strong>illustrative, invented curve</strong>.</p></div>
    <div className={styles.stopPlot}><svg viewBox="0 0 500 220" role="img" aria-label={`Illustrative training and validation losses versus number of trees. Selected ${trees} trees; the illustrative minimum validation loss occurs at ${bestTrees} trees.`}>
      {[20, 40, 55].map((tick) => <g key={tick}><line x1="42" x2="472" y1={y(tick)} y2={y(tick)} className={styles.gridLine} /><text x="34" y={y(tick) + 4} textAnchor="end" className={styles.axisText}>{tick}</text></g>)}
      <path d={line(training)} className={styles.trainCurve} /><path d={line(validationSketch)} className={styles.validationCurve} />
      <line x1={x(trees)} x2={x(trees)} y1="28" y2="182" className={styles.selectedTreeLine} />
      <circle cx={x(trees)} cy={y(training[trees])} r="5" className={styles.trainPoint} /><circle cx={x(trees)} cy={y(validationSketch[trees])} r="5" className={styles.validationPoint} />
      <circle cx={x(bestTrees)} cy={y(valBest)} r="8" className={styles.bestRing} />
      <text x="42" y="205" className={styles.axisText}>0 trees</text><text x="472" y="205" textAnchor="end" className={styles.axisText}>10 trees</text>
    </svg><div className={styles.curveLegend}><span><i className={styles.trainSwatch} /> Training loss</span><span><i className={styles.validationSwatch} /> Validation loss</span><span><i className={styles.bestSwatch} /> Lowest here</span></div></div>
    <div className={styles.stopSlider}><label htmlFor="early-stop">Selected iteration M <strong>{trees}</strong></label><input id="early-stop" type="range" min="0" max="10" step="1" value={trees} onChange={(event) => setTrees(Number(event.target.value))} /><p>At M = {trees}, the validation loss in this invented sketch is {validationSketch[trees]}. The minimum shown is {valBest} at M = {bestTrees}. Real validation curves are noisy and need not be U-shaped.</p></div>
  </section>;
}
