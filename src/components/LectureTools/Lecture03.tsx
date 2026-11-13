import React, { useMemo, useState } from 'react';
import styles from './lecture03.module.css';

const observations = [
  [-1.85, 33], [-1.73, 35], [-1.62, 39], [-1.4, 31], [-1.18, 46], [-0.96, 39], [-0.73, 50],
  [-0.5, 42], [-0.27, 55], [-0.05, 48], [0.18, 61], [0.4, 53], [0.63, 67],
  [0.86, 57], [1.08, 72], [1.3, 62], [1.52, 76], [1.64, 68], [1.73, 78], [1.93, 91],
];
const modelInfo = {
  constant: { label: 'A · Degree 0', heading: 'A constant misses the trend.', detail: 'Its restrictive shape cannot follow the systematic relationship in this illustration. That is the high-bias end of the story.' },
  moderate: { label: 'B · Degree 2', heading: 'A restrained curve follows the broad pattern.', detail: 'It does not pass through every point, and that can be useful: the small deviations may be sample noise rather than a pattern worth reproducing.' },
  flexible: { label: 'C · Degree 12', heading: 'The most flexible curve follows the sample closely.', detail: 'That close training fit also follows irregularities that may be noise. The curve can behave very differently on new observations.' },
};

function polynomialFit(points: number[][], degree: number): number[] {
  const columns = Array.from({ length: degree + 1 }, (_, power) => points.map(([x]) => (x / 2) ** power));
  const orthogonal: number[][] = [];
  const upper = Array.from({ length: degree + 1 }, () => Array(degree + 1).fill(0) as number[]);
  columns.forEach((column, j) => {
    const vector = [...column];
    for (let pass = 0; pass < 2; pass += 1) {
      for (let i = 0; i < j; i += 1) {
        const projection = orthogonal[i].reduce((sum, value, k) => sum + value * vector[k], 0);
        upper[i][j] += projection;
        vector.forEach((value, k) => { vector[k] = value - projection * orthogonal[i][k]; });
      }
    }
    const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    upper[j][j] = magnitude;
    orthogonal.push(vector.map((value) => value / magnitude));
  });
  const response = points.map(([, y]) => y);
  const projected = orthogonal.map((column) => column.reduce((sum, value, i) => sum + value * response[i], 0));
  const coefficients = Array(degree + 1).fill(0) as number[];
  for (let i = degree; i >= 0; i -= 1) {
    coefficients[i] = (projected[i] - coefficients.slice(i + 1).reduce((sum, value, offset) => sum + upper[i][i + 1 + offset] * value, 0)) / upper[i][i];
  }
  return coefficients;
}

function polynomialValue(coefficients: number[], x: number): number {
  return coefficients.reduceRight((value, coefficient) => coefficient + (x / 2) * value, 0);
}

export function ModelFitExplorer() {
  const [choice, setChoice] = useState<keyof typeof modelInfo | null>(null);
  const [showNext, setShowNext] = useState(false);
  const left = 58;
  const top = 24;
  const width = 524;
  const height = 230;
  const x = (value: number) => left + ((value + 2) / 4) * width;
  const y = (value: number) => top + ((100 - value) / 100) * height;
  const curvePaths = useMemo(() => {
    const models = { constant: 0, moderate: 2, flexible: 12 } as const;
    return Object.fromEntries(Object.entries(models).map(([name, degree]) => {
      const coefficients = polynomialFit(observations, degree);
      const path = Array.from({ length: 121 }, (_, index) => -2 + (index / 120) * 4).map((value, index) => {
        const prediction = polynomialValue(coefficients, value);
        return `${index === 0 ? 'M' : 'L'}${x(value).toFixed(1)} ${y(prediction).toFixed(1)}`;
      }).join(' ');
      return [name, path];
    })) as Record<keyof typeof modelInfo, string>;
  }, []);
  return <section className={styles.explorer} aria-labelledby="model-fit-title">
    <p className={styles.eyebrow}>First, reward the best fit</p>
    <h3 id="model-fit-title">Which model follows these observations most closely?</h3>
    <p className={styles.intro}>For now, look only at the training points. Select the curve that best reproduces the data you have already seen.</p>
    <figure className={styles.plotFrame}>
      <svg viewBox="0 0 630 320" role="img" aria-labelledby="model-fit-graph-title model-fit-graph-desc">
        <title id="model-fit-graph-title">Three candidate curves for experience and income</title>
        <desc id="model-fit-graph-desc">Illustrative training observations by standardized experience. The selected fitted model appears after you choose a degree; the simulated underlying signal appears after the next reveal.</desc>
        {[20, 40, 60, 80, 100].map((tick) => <g key={tick}><line className={styles.grid} x1={left} x2={left + width} y1={y(tick)} y2={y(tick)} /><text className={styles.tick} x={left - 9} y={y(tick) + 4} textAnchor="end">{tick}</text></g>)}
        <line className={styles.axis} x1={left} x2={left} y1={top} y2={top + height} />
        <line className={styles.axis} x1={left} x2={left + width} y1={top + height} y2={top + height} />
        <text className={styles.axisLabel} x={left + width / 2} y="300" textAnchor="middle">Experience (scaled)</text>
        <text className={styles.axisLabel} transform="translate(17 140) rotate(-90)" textAnchor="middle">Income (illustrative)</text>
        {showNext && <path className={styles.truthCurve} d="M58 226 C175 202 250 174 330 148 C415 122 500 90 582 56" />}
        <defs><clipPath id="model-fit-plot-clip"><rect x={left} y={top} width={width} height={height} /></clipPath></defs>
        {choice && <path clipPath="url(#model-fit-plot-clip)" className={choice === 'flexible' ? styles.selectedFlexible : styles.selectedModel} d={curvePaths[choice]} />}
        {observations.map(([xValue, yValue], index) => <circle key={index} className={styles.observation} cx={x(xValue)} cy={y(yValue)} r="5" />)}
      </svg>
      <figcaption>{showNext ? 'Simulated illustration: the dashed curve is the latent signal. In real data, the analyst does not know it.' : choice ? 'Least-squares polynomial fit · the underlying signal remains hidden.' : 'Synthetic training sample, n = 20 · select a model to see its fit.'}</figcaption>
    </figure>
    <div className={styles.modelChoices} role="group" aria-label="Choose a model for a new prediction">
      {(Object.keys(modelInfo) as Array<keyof typeof modelInfo>).map((key) => <button key={key} type="button" aria-pressed={choice === key} className={choice === key ? styles.modelSelected : styles.modelButton} onClick={() => { setChoice(key); setShowNext(false); }}>{modelInfo[key].label}</button>)}
    </div>
    {choice && <div className={styles.reveal} aria-live="polite"><strong>{choice === 'flexible' ? 'Degree 12 follows the training sample most closely.' : modelInfo[choice].heading}</strong><p>{choice === 'flexible' ? 'If matching the observations we already have were the only goal, this model would be attractive: its curve tracks their individual ups and downs.' : modelInfo[choice].detail}</p>{!showNext && <button type="button" className={styles.nextQuestion} onClick={() => setShowNext(true)}>Now reveal the new-observation question <span aria-hidden="true">→</span></button>}{showNext && <p className={styles.nextQuestionText}><strong>Would you trust this same curve on a new sample?</strong> The dashed line is the simulated signal that generated the data. The high-degree curve also chases some sample-specific noise.</p>}</div>}
    <p className={styles.note}>The training sample rewards a close fit. The scientific question is whether the fitted relationship will hold beyond those points.</p>
  </section>;
}

const samplePaths = {
  moderate: [
    'M58 224 C180 203 250 175 330 148 S505 87 582 60', 'M58 239 C170 209 256 184 330 154 S501 95 582 52',
    'M58 215 C168 197 254 166 330 151 S500 82 582 67', 'M58 230 C176 192 248 181 330 145 S495 103 582 49',
    'M58 218 C175 207 256 171 330 160 S493 80 582 58', 'M58 241 C177 215 261 179 330 143 S495 96 582 72',
    'M58 221 C176 196 251 168 330 152 S508 91 582 55', 'M58 233 C171 201 258 186 330 147 S496 86 582 63',
  ],
  flexible: [
    'M58 240 C91 229 87 194 120 215 S155 169 184 199 S218 145 244 183 S285 123 311 174 S344 99 370 152 S402 72 428 122 S461 61 486 105 S530 25 548 75 S572 32 582 43',
    'M58 224 C89 189 102 246 130 209 S163 233 194 176 S227 224 251 160 S286 192 315 138 S348 167 374 121 S405 147 438 91 S472 125 500 69 S538 85 557 39 S576 61 582 18',
    'M58 245 C86 204 107 213 129 231 S160 182 188 211 S218 162 247 186 S276 115 304 161 S339 139 363 153 S393 78 419 118 S453 111 480 126 S519 37 540 64 S564 14 582 36',
    'M58 222 C87 245 103 180 133 206 S163 158 191 194 S221 135 250 162 S280 190 306 141 S340 99 366 137 S398 157 422 94 S451 47 482 92 S513 126 537 63 S563 74 582 28',
    'M58 235 C91 194 104 208 132 228 S164 187 190 203 S221 147 247 181 S281 138 307 166 S339 112 365 148 S396 84 421 127 S452 73 481 108 S511 47 541 80 S565 27 582 49',
    'M58 247 C88 226 101 205 130 215 S164 243 189 191 S220 180 248 148 S276 163 305 122 S337 158 364 109 S394 113 424 140 S452 67 480 95 S509 115 539 48 S563 37 582 23',
    'M58 228 C86 192 108 239 133 210 S164 201 190 222 S222 146 250 171 S281 120 306 152 S337 187 364 126 S396 77 423 107 S454 136 480 88 S511 64 540 93 S566 19 582 41',
    'M58 243 C90 220 105 189 131 218 S163 174 190 195 S220 233 247 156 S278 143 305 178 S338 119 365 156 S396 83 423 132 S452 91 481 115 S510 42 540 71 S565 53 582 21',
  ],
};

export function SampleSensitivityExplorer() {
  const [degree, setDegree] = useState<'moderate' | 'flexible'>('moderate');
  const paths = samplePaths[degree];
  return <section className={styles.explorer} aria-labelledby="sample-sensitivity-title">
    <p className={styles.eyebrow}>Same population · new sample</p>
    <h3 id="sample-sensitivity-title">Do these fitted models change when the sample changes?</h3>
    <p className={styles.intro}>Each small panel shows a fit from a different sample drawn from the same simulated population. Switch model families to compare their stability.</p>
    <div className={styles.modelChoices} role="group" aria-label="Choose polynomial degree">
      <button type="button" aria-pressed={degree === 'moderate'} className={degree === 'moderate' ? styles.modelSelected : styles.modelButton} onClick={() => setDegree('moderate')}>Degree 2 · moderate</button>
      <button type="button" aria-pressed={degree === 'flexible'} className={degree === 'flexible' ? styles.modelSelected : styles.modelButton} onClick={() => setDegree('flexible')}>Degree 12 · flexible</button>
    </div>
    <div className={styles.sampleGrid} role="img" aria-label={`Eight fitted curves from independent samples. ${degree === 'moderate' ? 'Degree two fits remain close to each other.' : 'Degree twelve fits vary sharply from sample to sample.'}`}>
      {paths.map((path, index) => <div className={styles.sampleTile} key={`${degree}-${index}`}>
        <span>Sample {String(index + 1).padStart(2, '0')}</span>
        <svg viewBox="40 24 560 245" aria-hidden="true" focusable="false">
          <path d="M58 226 C175 198 258 170 330 148 C416 121 500 89 582 56" className={styles.sampleTruth} />
          <path d={path} className={styles.samplePath} />
        </svg>
      </div>)}
    </div>
    <div className={styles.legend} aria-label="Plot legend"><span className={styles.legendDashed} aria-hidden="true" /> Fixed population relationship <span className={styles.legendSolid} aria-hidden="true" /> Fitted model for each sample</div>
    <p className={styles.reveal} aria-live="polite">{degree === 'moderate' ? <><strong>Relatively stable.</strong> The fits vary, but stay near one another and the shared signal.</> : <><strong>Sample-sensitive.</strong> The degree-12 curves wander apart even though the underlying population is unchanged.</>}</p>
    <p className={styles.note}>The dotted curve is the fixed underlying relationship used to generate these simulated samples; we know it here because we made the simulation. In real data, that population curve is unknown. Eight samples · n = 20 per sample · same scale.</p>
  </section>;
}

export function BiasVarianceExplorer() {
  const [complexity, setComplexity] = useState<'restrictive' | 'balanced' | 'flexible'>('balanced');
  const profiles = {
    restrictive: { bias: 'high', variance: 'low', biasWidth: '86%', varianceWidth: '24%', text: 'The model is too restrictive to follow important structure. Its predictions tend to be stable, but systematically miss the pattern.' },
    balanced: { bias: 'moderate', variance: 'moderate', biasWidth: '48%', varianceWidth: '47%', text: 'The model can capture the broad pattern while avoiding some sample-specific variation. This is a useful trade-off to seek, not a guarantee of best performance.' },
    flexible: { bias: 'low', variance: 'high', biasWidth: '19%', varianceWidth: '84%', text: 'The model can follow complex patterns, but its fitted predictions may move sharply when the sample changes.' },
  };
  const profile = profiles[complexity];
  return <section className={styles.explorer} aria-labelledby="bias-variance-title">
    <p className={styles.eyebrow}>A balance, not a magic setting</p>
    <h3 id="bias-variance-title">Which error is more visible here?</h3>
    <p className={styles.intro}>Choose a model description to see how bias and variance can move in opposite directions. The indicators are qualitative, not measurements.</p>
    <div className={styles.modelChoices} role="group" aria-label="Choose model complexity">
      <button type="button" aria-pressed={complexity === 'restrictive'} className={complexity === 'restrictive' ? styles.modelSelected : styles.modelButton} onClick={() => setComplexity('restrictive')}>Restrictive</button>
      <button type="button" aria-pressed={complexity === 'balanced'} className={complexity === 'balanced' ? styles.modelSelected : styles.modelButton} onClick={() => setComplexity('balanced')}>A balance</button>
      <button type="button" aria-pressed={complexity === 'flexible'} className={complexity === 'flexible' ? styles.modelSelected : styles.modelButton} onClick={() => setComplexity('flexible')}>Highly flexible</button>
    </div>
    <div className={styles.profile} aria-live="polite">
      <div className={styles.profileRow}><strong>Squared bias <span>{profile.bias}</span></strong><div className={styles.profileTrack}><i className={styles.biasFill} style={{ width: profile.biasWidth }} /></div></div>
      <div className={styles.profileRow}><strong>Variance <span>{profile.variance}</span></strong><div className={styles.profileTrack}><i className={styles.varianceFill} style={{ width: profile.varianceWidth }} /></div></div>
      <div className={styles.profileRow}><strong>Irreducible noise <span>still present</span></strong><div className={styles.profileTrack}><i className={styles.noiseFill} /></div></div>
      <p>{profile.text}</p>
      <div className={styles.errorBalance}><span>Expected prediction error</span><b>Bias² + Variance + Noise</b></div>
    </div>
    <p className={styles.note}>A little bias may buy a lot of stability. The actual trade-off depends on the data and model family.</p>
  </section>;
}

type PenaltyGeometry = 'ridge' | 'lasso';

type FormulaName = 'decomposition' | 'olsObjective' | 'olsVariance' | 'regularizedObjective' | 'ridgePenalty' | 'lassoPenalty' | 'elasticPenalty' | 'ridgeRule' | 'lassoRule';

const mathNode = (name: string, ...children: React.ReactNode[]) => React.createElement(name as React.ElementType, null, ...children);
const mi = (value: string) => mathNode('mi', value);
const mn = (value: string) => mathNode('mn', value);
const mo = (value: string) => React.createElement('mo', { stretchy: 'false' }, value);
const row = (...items: React.ReactNode[]) => mathNode('mrow', ...items);
const sub = (base: React.ReactNode, index: React.ReactNode) => mathNode('msub', base, index);
const sup = (base: React.ReactNode, index: React.ReactNode) => mathNode('msup', base, index);
const norm = (value: React.ReactNode) => row(mo('‖'), value, mo('‖'));
const fHat = mathNode('mover', mi('f'), mo('ˆ'));
const fHatAtX = row(fHat, mo('('), mi('x'), mo(')'));
const fHatFromD = sub(fHat, mi('D'));
const fHatDAtX = row(fHatFromD, mo('('), mi('x'), mo(')'));
const betaHat = mathNode('mover', mi('β'), mo('ˆ'));
const betaOlsHat = sup(betaHat, mi('OLS'));
const sigmaSquared = sup(mi('σ'), mn('2'));

function formulaContent(formula: FormulaName): React.ReactNode[] {
  switch (formula) {
    case 'decomposition':
      return [row(
        sub(mi('E'), row(mi('D'), mo(','), mi('Y|x'))),
        row(mo('['), sup(row(mi('Y'), mo('−'), fHatDAtX), mn('2')), mo(']')),
        mo('='),
        sup(row(sub(mi('E'), mi('D')), row(fHatDAtX, mo('−'), row(mi('f'), mo('('), mi('x'), mo(')')))), mn('2')),
        mo('+'),
        row(sub(mi('Var'), mi('D')), fHatDAtX),
        mo('+'), sigmaSquared,
      )];
    case 'olsObjective':
      return [row(betaOlsHat, mo('='), mathNode('munder', row(mi('arg'), mo(' min')), mi('β')), sup(sub(norm(row(mi('y'), mo('−'), mi('X'), mi('β'))), mn('2')), mn('2')))];
    case 'olsVariance':
      return [row(mi('Var'), mo('('), betaOlsHat, mo('|'), mi('X'), mo(')'), mo('='), sigmaSquared, row(mo('('), sup(row(mi('X'), mo('ᵀ'), mi('X')), mn('−1')), mo(')')))];
    case 'regularizedObjective':
      return [row(
        betaHat, mo('='),
        mathNode('munder', row(mi('arg'), mo(' min')), row(mi('β₀'), mo(','), mi('β'))),
        row(mo('['),
          mathNode('mfrac', mn('1'), row(mn('2'), mi('n'))),
          sup(sub(norm(row(mi('y'), mo('−'), mi('β₀'), mi('1'), mo('−'), mi('Xβ'))), mn('2')), mn('2')),
          mo('+'), mi('λ'), mi('P'), mo('('), mi('β'), mo(')'), mo(']'),
        ),
      )];
    case 'ridgePenalty':
      return [row(mi('P'), mo('('), mi('β'), mo(')'), mo('='), mathNode('munderover', mo('∑'), mn('j=1'), mi('p')), sup(sub(mi('β'), mi('j')), mn('2')))];
    case 'lassoPenalty':
      return [row(mi('P'), mo('('), mi('β'), mo(')'), mo('='), mathNode('munderover', mo('∑'), mn('j=1'), mi('p')), mo('|'), sub(mi('β'), mi('j')), mo('|'))];
    case 'elasticPenalty':
      return [mathNode('mtable',
        mathNode('mtr', mathNode('mtd', row(
          mi('P'), mo('('), mi('β'), mo(')'), mo('='), mi('α'),
          mathNode('munderover', mo('∑'), mn('j=1'), mi('p')), mo('|'), sub(mi('β'), mi('j')), mo('|'),
        ))),
        mathNode('mtr', mathNode('mtd', row(
          mo('+'), mathNode('mfrac', row(mn('1'), mo('−'), mi('α')), mn('2')),
          mathNode('munderover', mo('∑'), mn('j=1'), mi('p')), sup(sub(mi('β'), mi('j')), mn('2')),
        ))),
      )];
    case 'ridgeRule':
      return [row(sub(betaHat, mi('j')), mo('='), mathNode('mfrac', sub(betaOlsHat, mi('j')), row(mn('1'), mo('+'), mn('2'), mi('λ'))))];
    case 'lassoRule':
      return [row(sub(betaHat, mi('j')), mo('='), mi('sign'), row(mo('('), sub(mi('z'), mi('j')), mo(')')), sub(row(mo('('), mo('|'), sub(mi('z'), mi('j')), mo('|'), mo('−'), mi('λ'), mo(')')), mo('+')))];
  }
}

const formulaLabels: Record<FormulaName, string> = {
  decomposition: 'Expected squared prediction error equals squared bias plus variance plus irreducible noise.',
  olsObjective: 'Ordinary least squares chooses beta to minimize the squared norm of y minus X beta.',
  olsVariance: 'Conditional variance of the OLS coefficient vector equals sigma squared times the inverse of X transpose X.',
  regularizedObjective: 'Estimated coefficients minimize one over two n times the squared residual norm plus lambda times a coefficient penalty.',
  ridgePenalty: 'Ridge penalty: sum from j equals one to p of beta j squared.',
  lassoPenalty: 'LASSO penalty: sum from j equals one to p of the absolute value of beta j.',
  elasticPenalty: 'Elastic Net penalty: alpha times the L1 penalty plus one minus alpha over two times the L2 penalty.',
  ridgeRule: 'Ridge estimate equals the ordinary least squares estimate divided by one plus two lambda.',
  lassoRule: 'LASSO estimate equals the sign of z j times the positive part of absolute z j minus lambda.',
};

function MathDisplay({ formula }: { formula: FormulaName }) {
  const root = React.createElement('math' as React.ElementType, { display: 'block', 'aria-label': formulaLabels[formula] }, formulaContent(formula));
  return <div className={styles.mathViewport}>{root}</div>;
}

export function FormulaCallout({ title, note, formula }: { title: string; note: string; formula: FormulaName }) {
  return <figure className={styles.equationCard}>
    <p className={styles.eyebrow}>{title}</p>
    <MathDisplay formula={formula} />
    <figcaption>{note}</figcaption>
  </figure>;
}

export function PenaltySummary() {
  const methods: Array<{ title: string; formula: FormulaName; detail: string }> = [
    { title: 'Ridge · L2', formula: 'ridgePenalty', detail: 'Shrink coefficients continuously toward zero.' },
    { title: 'LASSO · L1', formula: 'lassoPenalty', detail: 'Shrink coefficients; some can become exactly zero.' },
    { title: 'Elastic Net', formula: 'elasticPenalty', detail: 'Combine sparsity with an L2 component for correlated features.' },
  ];
  return <div className={styles.penaltyGrid}>
    {methods.map((method) => <section className={styles.penaltyCard} key={method.formula}>
      <h3>{method.title}</h3><MathDisplay formula={method.formula} /><p>{method.detail}</p>
    </section>)}
  </div>;
}

export function PenaltyGeometryExplorer() {
  const [method, setMethod] = useState<PenaltyGeometry>('ridge');
  const isLasso = method === 'lasso';
  return <section className={styles.explorer} aria-labelledby="geometry-title">
    <p className={styles.eyebrow}>The geometry of sparsity</p>
    <h3 id="geometry-title">Why can LASSO land exactly on zero?</h3>
    <p className={styles.intro}>Both methods limit coefficient size. Select a shape to see why an L1 constraint can produce exact zeros.</p>
    <div className={styles.geometryChoice} role="group" aria-label="Select a penalty geometry">
      <button type="button" aria-pressed={method === 'ridge'} className={method === 'ridge' ? styles.modelSelected : styles.modelButton} onClick={() => setMethod('ridge')}>Ridge · L2 circle</button>
      <button type="button" aria-pressed={method === 'lasso'} className={method === 'lasso' ? styles.modelSelected : styles.modelButton} onClick={() => setMethod('lasso')}>LASSO · L1 diamond</button>
    </div>
    <div className={styles.geometryStage} aria-live="polite">
      <svg viewBox="0 0 360 240" role="img" aria-labelledby="geometry-graph-title geometry-graph-desc">
        <title id="geometry-graph-title">{isLasso ? 'LASSO diamond with a sharp axis corner' : 'Ridge circle with a smooth boundary'}</title>
        <desc id="geometry-graph-desc">The OLS estimate lies outside the selected coefficient constraint. The innermost matching error contour touches the constraint boundary at the regularized estimate. Both estimates lie on the boundary in this constrained example.</desc>
        <line className={styles.geometryAxis} x1="26" x2="338" y1="150" y2="150" /><line className={styles.geometryAxis} x1="110" x2="110" y1="22" y2="218" />
        <circle className={styles.geometryContour} cx="218.5" cy="132.5" r="24" /><circle className={styles.geometryContour} cx="218.5" cy="132.5" r="66" />
        <circle className={styles.geometrySelectedContour} cx="218.5" cy="132.5" r={isLasso ? 42.3 : 40} />
        {isLasso ? <polygon className={styles.geometryDiamond} points="110,80 180,150 110,220 40,150" /> : <circle className={styles.geometryCircle} cx="110" cy="150" r="70" />}
        <circle className={styles.geometryOls} cx="218.5" cy="132.5" r="5" /><circle className={styles.geometryEstimate} cx={isLasso ? 180 : 179} cy={isLasso ? 150 : 139} r="6" />
        <text className={styles.geometryText} x="228" y="123">OLS</text><text className={styles.geometryText} x="325" y="169" textAnchor="end">β₁</text><text className={styles.geometryText} x="119" y="32">β₂</text>
      </svg>
      <p><strong>{isLasso ? 'The contour touches the diamond at a corner.' : 'The contour touches the circle’s boundary.'}</strong> Here the constraint is active, so both solutions lie on its boundary. Ridge’s smooth circle shrinks both coefficients; the LASSO corner lies on an axis, making β₂ exactly zero.</p>
    </div>
    <p className={styles.note}>Illustrative geometry, not a fitted dataset. If the constraint is loose enough to contain the OLS solution, it need not bind and the estimate can lie inside the boundary.</p>
  </section>;
}

export function ShrinkageExplorer() {
  const [lambda, setLambda] = useState(0.2);
  const [z, setZ] = useState(0.1);
  const ridge = z / (1 + 2 * lambda);
  const lasso = Math.sign(z) * Math.max(Math.abs(z) - lambda, 0);
  const maxMagnitude = Math.max(Math.abs(z), .01);
  return <section className={styles.explorer} aria-labelledby="shrinkage-title">
    <p className={styles.eyebrow}>One coefficient · a precise result</p>
    <h3 id="shrinkage-title">Try a coefficient of your own</h3>
    <p className={styles.intro}>Set the unregularized coefficient and penalty. See Ridge shrink it continuously while LASSO can switch it off.</p>
    <div className={styles.rangeRow}><label htmlFor="shrinkage-coefficient">OLS coefficient z</label><input id="shrinkage-coefficient" type="range" min="-1" max="1" step="0.01" value={z} onChange={(event) => setZ(Number(event.target.value))} /><output htmlFor="shrinkage-coefficient">{z.toFixed(2)}</output></div>
    <div className={styles.rangeRow}><label htmlFor="shrinkage-lambda">Penalty λ</label><input id="shrinkage-lambda" type="range" min="0" max="0.5" step="0.01" value={lambda} onChange={(event) => setLambda(Number(event.target.value))} /><output htmlFor="shrinkage-lambda">{lambda.toFixed(2)}</output></div>
    <div className={styles.coefficientCompare} aria-live="polite">
      <article className={styles.coefficientCard}>
        <div><h4>Ridge</h4><strong>{ridge.toFixed(2)}</strong></div>
        <p>A nonzero coefficient gets smaller, but usually stays nonzero.</p>
        <div className={styles.coefficientTrack} aria-label={`Ridge coefficient ${ridge.toFixed(2)} relative to original ${z.toFixed(2)}`}><i className={ridge < 0 ? styles.negativeCoefficient : ''} style={{ width: `${Math.abs(ridge) / maxMagnitude * 50}%` }} /></div>
      </article>
      <article className={`${styles.coefficientCard} ${lasso === 0 ? styles.zeroedCard : ''}`}>
        <div><h4>LASSO</h4><strong>{lasso.toFixed(2)}</strong></div>
        <p>{lasso === 0 ? 'Below the threshold: this coefficient is exactly zero.' : 'Above the threshold: it shrinks toward zero.'}</p>
        <div className={styles.coefficientTrack} aria-label={`LASSO coefficient ${lasso.toFixed(2)} relative to original ${z.toFixed(2)}`}><i className={lasso < 0 ? styles.negativeCoefficient : ''} style={{ width: `${Math.abs(lasso) / maxMagnitude * 50}%` }} /></div>
      </article>
    </div>
    <p className={styles.assumption}>The closed forms below assume centered, standardized predictors with an orthogonal design, and use the lecture’s penalty convention.</p>
    <div className={styles.ruleRows}><div><b>Ridge</b><MathDisplay formula="ridgeRule" /></div><div><b>LASSO</b><MathDisplay formula="lassoRule" /></div></div>
  </section>;
}

/** An illustrative coefficient path for showing how LASSO selection changes with λ. */
export function SelectionPathExplorer() {
  const [lambda, setLambda] = useState(0.25);
  const paths = [
    { name: 'Experience', color: '#007f86', value: (l: number) => Math.max(0, 0.9 - 0.38 * l) },
    { name: 'Age', color: '#c47b14', value: (l: number) => Math.max(0, 0.66 - 1.9 * l) },
    { name: 'Education', color: '#8064a2', value: (l: number) => Math.max(0, 0.4 - 0.5 * l) },
  ];
  const left = 66; const top = 22; const width = 510; const height = 205;
  const x = (l: number) => left + l * width;
  const y = (value: number) => top + (1 - value) * height;
  const selected = paths.filter((path) => path.value(lambda) > 0.005);
  return (
    <section className={styles.explorer} aria-labelledby="selection-path-title">
      <p className={styles.eyebrow}>Interactive coefficient paths</p>
      <h3 id="selection-path-title">Which predictors survive the penalty?</h3>
      <p className={styles.intro}>Move λ to follow an illustrative LASSO fit. A coefficient at zero is excluded from this fitted model.</p>
      <figure className={styles.plotFrame}>
        <svg viewBox="0 0 620 275" role="img" aria-labelledby="selection-path-graph-title selection-path-graph-desc">
          <title id="selection-path-graph-title">Illustrative LASSO coefficient paths as the penalty changes</title>
          <desc id="selection-path-graph-desc">Experience, age, and education coefficients shrink as lambda increases. Age reaches zero first, showing that selection depends on the penalty.</desc>
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => <g key={tick}><line className={styles.grid} x1={left} x2={left + width} y1={y(tick)} y2={y(tick)} /><text className={styles.tick} x={left - 12} y={y(tick) + 4} textAnchor="end">{tick.toFixed(2)}</text></g>)}
          {[0, 0.25, 0.5, 0.75, 1].map((tick) => <g key={tick}><line className={styles.grid} x1={x(tick)} x2={x(tick)} y1={top} y2={top + height} /><text className={styles.tick} x={x(tick)} y={top + height + 19} textAnchor="middle">{tick.toFixed(2)}</text></g>)}
          <line className={styles.axis} x1={left} x2={left + width} y1={top + height} y2={top + height} />
          <line className={styles.axis} x1={left} x2={left} y1={top} y2={top + height} />
          <text className={styles.axisLabel} x={left + width / 2} y="270" textAnchor="middle">Penalty strength λ</text>
          <text className={styles.axisLabel} transform={`translate(17 ${top + height / 2}) rotate(-90)`} textAnchor="middle">Coefficient</text>
          {paths.map((path) => <g key={path.name}>
            <path d={Array.from({ length: 51 }, (_, i) => `${i ? 'L' : 'M'}${x(i / 50)},${y(path.value(i / 50))}`).join(' ')} fill="none" stroke={path.color} strokeWidth="3" />
            <circle cx={x(lambda)} cy={y(path.value(lambda))} r="5" fill={path.color} stroke="white" strokeWidth="2" />
          </g>)}
          <line x1={x(lambda)} x2={x(lambda)} y1={top} y2={top + height} stroke="#17263a" strokeDasharray="4 4" strokeWidth="1.5" />
        </svg>
        <figcaption>Illustrative coefficient paths; values are not estimated from real data.</figcaption>
      </figure>
      <div className={styles.legend}>{paths.map((path) => <span key={path.name}><i className={styles.pathLegend} style={{ backgroundColor: path.color }} />{path.name}</span>)}</div>
      <div className={styles.rangeRow}><label htmlFor="selection-lambda">Penalty λ</label><input id="selection-lambda" type="range" min="0" max="1" step="0.01" value={lambda} onChange={(event) => setLambda(Number(event.target.value))} /><output htmlFor="selection-lambda">{lambda.toFixed(2)}</output></div>
      <p aria-live="polite"><strong>Selected at λ = {lambda.toFixed(2)}:</strong> {selected.length ? selected.map((path) => path.name).join(', ') : 'none'}. {selected.length < paths.length ? 'A zero here reflects this fitted model and penalty; it does not prove a predictor is unimportant.' : 'Lowering the penalty can bring more predictors into the fitted model.'}</p>
    </section>
  );
}
