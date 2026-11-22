import React, { useMemo, useState } from 'react';
import styles from './lecture02.module.css';

type MissingChoice = 'delete' | 'mean' | 'predict';

type MathTag = 'mi' | 'mn' | 'mo' | 'mrow' | 'msub' | 'msup' | 'msqrt' | 'munderover' | 'mfrac';
const mathNode = (tag: MathTag, ...children: React.ReactNode[]) => React.createElement(tag as React.ElementType, null, ...children);
const mi = (value: string) => mathNode('mi', value);
const mn = (value: string | number) => mathNode('mn', String(value));
const mo = (value: string) => mathNode('mo', value);
const mrow = (...children: React.ReactNode[]) => mathNode('mrow', ...children);
const sub = (base: React.ReactNode, index: React.ReactNode) => mathNode('msub', base, index);
const sup = (base: React.ReactNode, exponent: React.ReactNode) => mathNode('msup', base, exponent);

export function EuclideanDistanceFormula() {
  const index = mathNode('munderover', mo('∑'), mrow(mi('k'), mo('='), mn(1)), mi('p'));
  const featureGap = mrow(mo('('), sub(mi('x'), mrow(mi('i'), mi('k'))), mo('−'), sub(mi('x'), mrow(mi('j'), mi('k'))), mo(')'));
  const distance = mrow(mi('d'), mo('('), sub(mi('x'), mi('i')), mo(','), sub(mi('x'), mi('j')), mo(')'), mo('='), mathNode('msqrt', mrow(index, sup(featureGap, mn(2)))));
  return <figure className={styles.formulaBox} aria-labelledby="euclidean-distance-caption">
    <p className={styles.formulaLabel}>Euclidean distance · combine all p features</p>
    <div className={styles.formulaMathViewport} role="math" aria-label="Distance between rows i and j equals the square root of the sum, over all p features, of each feature difference squared.">
      {React.createElement('math' as React.ElementType, { display: 'block' }, distance)}
    </div>
    <figcaption id="euclidean-distance-caption">For feature 1, feature 2, …, through feature p: find the gap, square it, add the squared gaps, then take the square root.</figcaption>
  </figure>;
}

export function NrmseFormula() {
  const trueValues = sub(mi('X'), mi('true'));
  const imputedValues = sub(mi('X'), mi('imputed'));
  const difference = mrow(mo('('), trueValues, mo('−'), imputedValues, mo(')'));
  const numerator = mrow(mi('mean'), mo('('), sup(difference, mn(2)), mo(')'));
  const denominator = mrow(mi('Var'), mo('('), trueValues, mo(')'));
  const formula = mrow(mi('NRMSE'), mo('='), mathNode('msqrt', mathNode('mfrac', numerator, denominator)));
  return <figure className={styles.formulaBox} aria-labelledby="nrmse-caption">
    <p className={styles.formulaLabel}>Numerical imputation · normalized error</p>
    <div className={styles.formulaMathViewport} role="math" aria-label="Normalized root mean squared error equals the square root of the mean squared difference between the true and imputed values divided by the variance of the true values.">
      {React.createElement('math' as React.ElementType, { display: 'block' }, formula)}
    </div>
    <figcaption id="nrmse-caption">Square the errors, average them, divide by the variance of the true values, then take the square root. Lower is better.</figcaption>
  </figure>;
}

export function BayesianRidgeFormula() {
  const response = sub(mi('X'), mi('j'));
  const otherFeatures = sub(mi('X'), mrow(mo('−'), mi('j')));
  const conditional = mrow(response, mo('|'), otherFeatures, mo(','), mi('β'), mo(','), sup(mi('σ'), mn(2)), mo('∼'), mi('𝒩'), mo('('), sub(mi('μ'), mi('j')), mo(','), sup(mi('σ'), mn(2)), mo(')'));
  const mean = mrow(sub(mi('μ'), mi('j')), mo('='), sub(mi('β'), mn(0)), mo('+'), sup(otherFeatures, mi('T')), mi('β'));
  return <figure className={styles.formulaBox} aria-labelledby="bayesian-ridge-caption">
    <p className={styles.formulaLabel}>Bayesian Ridge · conditional model</p>
    <div className={styles.formulaMathViewport} role="math" aria-label="X j conditional on other features follows a normal distribution with mean mu j and variance sigma squared; mu j equals beta zero plus X minus j transpose beta.">
      {React.createElement('math' as React.ElementType, { display: 'block' }, conditional)}
      {React.createElement('math' as React.ElementType, { display: 'block' }, mean)}
    </div>
    <figcaption id="bayesian-ridge-caption">The value in one column is modelled using the other columns. The conditional mean is linear in those features.</figcaption>
  </figure>;
}

const choices: Array<{ value: MissingChoice; label: string }> = [
  { value: 'delete', label: 'Remove rows with missing values' },
  { value: 'mean', label: 'Fill missing income with the mean' },
  { value: 'predict', label: 'Use other available features to estimate it' },
];

export function MissingDataDecision() {
  const [choice, setChoice] = useState<MissingChoice | null>(null);
  const feedback: Record<MissingChoice, string> = {
    delete: 'Quick, but it discards observations. If the chance of missingness is related to income, the remaining data may no longer represent the customers you care about.',
    mean: 'Simple, but it replaces individual values with one constant and can flatten differences in the data. It does not explain why income is missing.',
    predict: 'Other features may help estimate income, but an imputed value is still a prediction. It depends on the variables and assumptions used.',
  };
  return <section className={styles.exercise} aria-labelledby="missing-decision-title">
    <p className={styles.eyebrow}>You have 30 minutes</p>
    <h3 id="missing-decision-title">A dataset is missing some customer incomes. Your manager needs it ready. What would you do?</h3>
    <fieldset className={styles.choices}>
      <legend>Choose a first response</legend>
      {choices.map((item) => <label className={styles.choice} key={item.value}>
        <input type="radio" name="missing-data-choice" checked={choice === item.value} onChange={() => setChoice(item.value)} />
        {item.label}
      </label>)}
    </fieldset>
    {choice && <p className={styles.feedback} role="status">{feedback[choice]}</p>}
    <p className={styles.caption}>There is no automatic fix: the consequences depend on what is missing and why.</p>
  </section>;
}

const incomeData = [
  { id: 'A', age: 30, income: 40.0 },
  { id: 'B', age: 39, income: 40.1 },
  { id: 'D', age: 36, income: 40.5 },
  { id: 'E', age: 42, income: 42.0 },
  { id: 'F', age: 24, income: 39.0 },
];

export function KNNImputationExplorer() {
  const [k, setK] = useState(3);
  const neighbors = useMemo(() => [...incomeData].sort((a, b) => Math.abs(a.age - 38) - Math.abs(b.age - 38)).slice(0, k), [k]);
  const estimate = neighbors.reduce((sum, row) => sum + row.income, 0) / neighbors.length;
  const left = 76;
  const top = 26;
  const plotWidth = 560;
  const plotHeight = 240;
  const x = (age: number) => left + ((age - 24) / 18) * plotWidth;
  const y = (income: number) => top + ((42.5 - income) / 4) * plotHeight;
  const nearestIds = new Set(neighbors.map((row) => row.id));
  const money = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(Math.round(estimate * 1000));

  return <section className={styles.graphCard} aria-labelledby="knn-imputation-title">
    <p className={styles.eyebrow}>Interactive graph · K-nearest neighbours</p>
    <h3 id="knn-imputation-title">Who is near the customer with missing income?</h3>
    <p className={styles.intro}>Customer C is 38 years old, but her income is missing. Here we use age as the only comparison feature and average the incomes of the nearest <em>k</em> customers.</p>
    <div className={styles.controlRow}>
      <label htmlFor="knn-k-slider">Number of neighbours (<em>k</em>): <output htmlFor="knn-k-slider">{k}</output></label>
      <input id="knn-k-slider" type="range" min="1" max="5" step="1" value={k} onChange={(event) => setK(Number(event.target.value))} aria-valuetext={`${k} ${k === 1 ? 'neighbor' : 'neighbors'}`} />
    </div>
    <figure className={styles.graphFigure}>
      <svg viewBox="0 0 680 330" role="img" aria-labelledby="knn-graph-title knn-graph-desc">
        <title id="knn-graph-title">Customer age and income with the nearest neighbours highlighted</title>
        <desc id="knn-graph-desc">Five observed customers are plotted. Customer C is at age 38 with missing income. The {k} closest customers by age are highlighted, giving a mean income estimate of {money} euros.</desc>
        {[39, 40, 41, 42].map((tick) => <g key={tick}>
          <line className={styles.gridLine} x1={left} x2={left + plotWidth} y1={y(tick)} y2={y(tick)} />
          <text className={styles.tickLabel} x={left - 12} y={y(tick) + 4} textAnchor="end">€{tick}k</text>
        </g>)}
        {[24, 28, 32, 36, 40, 42].map((tick) => <g key={tick}>
          <line className={styles.tickLine} x1={x(tick)} x2={x(tick)} y1={top + plotHeight} y2={top + plotHeight + 5} />
          <text className={styles.tickLabel} x={x(tick)} y={top + plotHeight + 23} textAnchor="middle">{tick}</text>
        </g>)}
        <line className={styles.axis} x1={left} x2={left} y1={top} y2={top + plotHeight} />
        <line className={styles.axis} x1={left} x2={left + plotWidth} y1={top + plotHeight} y2={top + plotHeight} />
        <text className={styles.axisLabel} x={left + plotWidth / 2} y="324" textAnchor="middle">Customer age (years)</text>
        <text className={styles.axisLabel} transform={`translate(18 ${top + plotHeight / 2}) rotate(-90)`} textAnchor="middle">Annual income</text>
        <line className={styles.queryLine} x1={x(38)} x2={x(38)} y1={top} y2={top + plotHeight} />
        {neighbors.map((row) => <line key={`link-${row.id}`} className={styles.neighborLink} x1={x(38)} x2={x(row.age)} y1={y(estimate)} y2={y(row.income)} />)}
        {incomeData.map((row) => <g key={row.id}>
          <circle className={nearestIds.has(row.id) ? styles.nearestPoint : styles.distantPoint} cx={x(row.age)} cy={y(row.income)} r={nearestIds.has(row.id) ? 8 : 6} />
          <text className={styles.pointLabel} x={x(row.age) + 10} y={y(row.income) - 9}>{row.id}</text>
        </g>)}
        <polygon className={styles.estimatePoint} points={`${x(38)},${y(estimate) - 9} ${x(38) + 9},${y(estimate)} ${x(38)},${y(estimate) + 9} ${x(38) - 9},${y(estimate)}`} />
        <text className={styles.queryLabel} x={x(38) + 9} y={top + 15}>C · income missing</text>
      </svg>
      <figcaption>Illustrative values for this KNNImputer example; income is shown in thousands of euros.</figcaption>
    </figure>
    <p className={styles.liveResult} aria-live="polite"><strong>With k = {k}:</strong> nearest customers {neighbors.map((row) => row.id).join(', ')} → estimated income <strong>€{money}</strong>.</p>
    <p className={styles.note}>Changing <em>k</em> changes which observations contribute and can change the estimate. This toy graph uses age alone; real distance calculations may use several observed features.</p>
  </section>;
}

export function DistanceScaleExplorer() {
  const [standardized, setStandardized] = useState(false);
  const metrics = standardized
    ? [
      { name: 'Age', value: 1, text: '(10 / 10)² = 1' },
      { name: 'Income', value: 0.0001, text: '(100 / 10,000)² = 0.0001' },
    ]
    : [
      { name: 'Age', value: 100, text: '10² = 100' },
      { name: 'Income', value: 10000, text: '100² = 10,000' },
    ];
  const maxValue = Math.max(...metrics.map((item) => item.value));
  return <section className={styles.graphCard} aria-labelledby="scale-distance-title">
    <p className={styles.eyebrow}>Interactive graph · Distance and scale</p>
    <h3 id="scale-distance-title">Can a large number dominate similarity?</h3>
    <p className={styles.intro}>Two customers differ by 10 years of age and €100 of income. Compare the squared contributions to Euclidean distance.</p>
    <div className={styles.toggleGroup} role="group" aria-label="Choose distance scale">
      <button type="button" aria-pressed={!standardized} className={!standardized ? styles.selectedButton : styles.button} onClick={() => setStandardized(false)}>Raw differences</button>
      <button type="button" aria-pressed={standardized} className={standardized ? styles.selectedButton : styles.button} onClick={() => setStandardized(true)}>After standardization</button>
    </div>
    <div className={styles.barChart} aria-live="polite" aria-label={standardized ? 'After standardization: age contributes 1 and income contributes 0.0001 to squared distance' : 'Raw squared distance contributions: age 100 and income 10000'}>
      {metrics.map((item) => <div className={styles.barRow} key={item.name}>
        <div className={styles.barHead}><strong>{item.name}</strong><code>{item.text}</code></div>
        <div className={styles.barTrack}><span className={item.name === 'Income' ? styles.incomeBar : styles.ageBar} style={{ width: `${Math.max((item.value / maxValue) * 100, 1.5)}%` }} /></div>
      </div>)}
      <p className={styles.scaleReadout}>{standardized ? 'Assumed standard deviations: age = 10 years; income = €10,000.' : 'The income difference contributes 100 times more than the age difference.'}</p>
    </div>
    <p className={styles.note}>The bars show each contribution relative to the largest one in the selected view. The standardized deviations are assumptions from the slide example.</p>
  </section>;
}

export function RelationshipShapeExplorer() {
  const [shape, setShape] = useState<'line' | 'curve'>('curve');
  const isCurve = shape === 'curve';
  return <section className={styles.graphCard} aria-labelledby="relationship-shape-title">
    <p className={styles.eyebrow}>Interactive graph · A relationship need not be straight</p>
    <h3 id="relationship-shape-title">Can one straight-line relationship describe heating and cooling?</h3>
    <p className={styles.intro}>Imagine electricity use is higher in cold weather, lower in mild weather, and higher again in hot weather.</p>
    <div className={styles.toggleGroup} role="group" aria-label="Choose a schematic relationship">
      <button type="button" aria-pressed={!isCurve} className={!isCurve ? styles.selectedButton : styles.button} onClick={() => setShape('line')}>One straight line</button>
      <button type="button" aria-pressed={isCurve} className={isCurve ? styles.selectedButton : styles.button} onClick={() => setShape('curve')}>Heating and cooling pattern</button>
    </div>
    <figure className={styles.graphFigure}>
      <svg viewBox="0 0 620 300" role="img" aria-labelledby="shape-graph-title shape-graph-desc">
        <title id="shape-graph-title">Schematic electricity use by temperature</title>
        <desc id="shape-graph-desc">{isCurve ? 'A U-shaped illustrative relationship: electricity use is high in colder and hotter temperatures and lower in mild weather.' : 'A single straight line cannot follow the illustrative rise in electricity use at both cold and hot temperatures.'}</desc>
        <line className={styles.axis} x1="80" x2="580" y1="238" y2="238" />
        <line className={styles.axis} x1="80" x2="80" y1="38" y2="238" />
        <line className={styles.mildLine} x1="330" x2="330" y1="42" y2="238" />
        <text className={styles.axisLabel} transform="translate(27 140) rotate(-90)" textAnchor="middle">Electricity use</text>
        <text className={styles.axisLabel} x="330" y="283" textAnchor="middle">Temperature</text>
        <text className={styles.tickLabel} x="82" y="260">Cooler</text>
        <text className={styles.tickLabel} x="330" y="260" textAnchor="middle">Mild</text>
        <text className={styles.tickLabel} x="578" y="260" textAnchor="end">Warmer</text>
        <path className={isCurve ? styles.curve : styles.line} d={isCurve ? 'M 92 62 C 180 65, 216 195, 330 205 C 444 195, 480 65, 568 62' : 'M 92 70 L 568 195'} />
      </svg>
      <figcaption>Schematic relationship; these are not measured data.</figcaption>
    </figure>
    <p className={styles.liveResult} aria-live="polite">{isCurve ? 'The U-shape captures higher use at both temperature extremes.' : 'A simple linear trend cannot rise at both ends and fall in the middle.'}</p>
    <p className={styles.note}>A linear model can represent this shape if useful nonlinear features are supplied. The question is what relationship the model is given the ability to express.</p>
  </section>;
}

const missForestSteps = [
  { title: 'Initialize', detail: 'Start with the incomplete table and create initial values for missing numerical and categorical entries.' },
  { title: 'Order variables', detail: 'Order the variables by increasing proportion of missing values.' },
  { title: 'Predict and update', detail: 'For each variable, fit a forest using rows where that variable is observed; predict its missing entries and update the working table.' },
  { title: 'Repeat and compare', detail: 'Repeat the passes. Compare successive imputations and use the paper’s stopping criterion to decide when to stop.' },
];

export function MissForestStepper() {
  const [step, setStep] = useState(0);
  const current = missForestSteps[step];
  return <section className={styles.exercise} aria-labelledby="missforest-title">
    <p className={styles.eyebrow}>Interactive process · MissForest</p>
    <h3 id="missforest-title">What if several columns are incomplete?</h3>
    <div className={styles.stepTrack} role="group" aria-label="Explore the simplified MissForest process">
      {missForestSteps.map((item, index) => <button type="button" key={item.title} aria-pressed={step === index} className={step === index ? styles.stepSelected : styles.stepButton} onClick={() => setStep(index)}><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</button>)}
    </div>
    <p className={styles.feedback} aria-live="polite"><strong>{current.title}.</strong> {current.detail}</p>
    <p className={styles.caption}>Simplified teaching view of the paper’s algorithm; the stopping rule compares changes between iterations.</p>
  </section>;
}
