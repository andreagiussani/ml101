import React, { useState } from 'react';
import styles from './lecture07Math.module.css';

type MathTag = 'mi' | 'mn' | 'mo' | 'mrow' | 'msup' | 'msub' | 'mfrac' | 'msqrt' | 'mtext' | 'munder';
const node = (tag: MathTag, ...children: React.ReactNode[]) => React.createElement(tag as React.ElementType, null, ...children);
const mi = (value: string) => node('mi', value);
const mn = (value: string | number) => node('mn', String(value));
const mo = (value: string) => node('mo', value);
const mtext = (value: string) => node('mtext', value);
const mrow = (...children: React.ReactNode[]) => node('mrow', ...children);
const sub = (base: React.ReactNode, index: React.ReactNode) => node('msub', base, index);
const sup = (base: React.ReactNode, exponent: React.ReactNode) => node('msup', base, exponent);
const frac = (numerator: React.ReactNode, denominator: React.ReactNode) => node('mfrac', numerator, denominator);
const power = (base: React.ReactNode, exponent: string | number) => sup(base, mn(exponent));

function Equation({ label, children, caption = 'CALCULATION' }: { label: string; children: React.ReactNode; caption?: string }) {
  return <div className={styles.equationCard}>
    <div className={styles.equationLabel}>{caption}</div>
    <div className={styles.equationViewport} role="math" aria-label={label}>{React.createElement('math' as React.ElementType, { display: 'block' }, children)}</div>
  </div>;
}

export function TreeMeanMath() {
  const j = mi('J'); const c = mi('c');
  const first = mrow(j, mo('('), c, mo(')'), mo('='), power(mrow(mn(7), mo('−'), c), 2), mo('+'), power(mrow(mn(10), mo('−'), c), 2));
  const derivative = mrow(mi("J'"), mo('('), c, mo(')'), mo('='), mn(2), mo('('), c, mo('−'), mn(7), mo(')'), mo('+'), mn(2), mo('('), c, mo('−'), mn(10), mo(')'));
  const simplified = mrow(mi("J'"), mo('('), c, mo(')'), mo('='), mn(4), c, mo('−'), mn(34));
  const solution = mrow(mn(4), c, mo('−'), mn(34), mo('='), mn(0), mo('⇒'), c, mo('='), mn('8.5'));
  return <div className={styles.derivation}>
    <Equation caption="1 · Write the error" label="For grades 7 and 10, the sum of squared errors for a leaf prediction c is (7 minus c) squared plus (10 minus c) squared.">{first}</Equation>
    <span className={styles.derivationArrow} aria-hidden="true">↓</span>
    <Equation caption="2 · Differentiate" label="The derivative is twice c minus 7 plus twice c minus 10.">{derivative}</Equation>
    <Equation caption="3 · Simplify" label="The derivative simplifies to 4c minus 34.">{simplified}</Equation>
    <span className={styles.derivationArrow} aria-hidden="true">↓</span>
    <Equation caption="4 · Set the derivative to zero" label="Set the derivative to zero; the optimal leaf prediction is 8.5.">{solution}</Equation>
  </div>;
}

export function GeneralMeanMath() {
  const sumIndex = mrow(mi('i'), mo(':'), sub(mi('x'), mi('i')), mo('∈'), mi('R'));
  const sum = node('munder', mo('∑'), sumIndex);
  const objective = mrow(mi('J'), mo('('), mi('c'), mo(')'), mo('='), sum, sup(mrow(sub(mi('y'), mi('i')), mo('−'), mi('c')), mn(2)));
  const optimum = mrow(sub(mi('ĉ'), mi('R')), mo('='), sub(mtext('arg min'), mi('c')), mi('J'), mo('('), mi('c'), mo(')'), mo('='), sub(mi('ȳ'), mi('R')));
  return <div className={styles.equationStack}>
    <Equation caption="The objective" label="For a fixed leaf region R, minimize the sum over observations in R of y i minus c squared.">{objective}</Equation>
    <Equation caption="The minimizing prediction" label="The value of c that minimizes the leaf objective is the mean response in that leaf.">{optimum}</Equation>
  </div>;
}

export function SplitSseMath() {
  const left = mrow(mo('SSE'), mo('('), mi('A'), mo(','), mi('B'), mo(')'), mo('='), power(mrow(mn(7), mo('−'), mn('8.5')), 2), mo('+'), power(mrow(mn(10), mo('−'), mn('8.5')), 2));
  const leftValue = mrow(mo('='), power(mn('−1.5'), 2), mo('+'), power(mn('1.5'), 2), mo('='), mn('4.5'));
  const right = mrow(mo('SSE'), mo('('), mi('C'), mo(','), mi('D'), mo(')'), mo('='), power(mrow(mn(16), mo('−'), mn('15.5')), 2), mo('+'), power(mrow(mn(15), mo('−'), mn('15.5')), 2));
  const rightValue = mrow(mo('='), power(mn('0.5'), 2), mo('+'), power(mn('−0.5'), 2), mo('='), mn('0.5'));
  const gain = mrow(mi('Gain'), mo('='), mn(54), mo('−'), mn('4.5'), mo('−'), mn('0.5'), mo('='), mn(49));
  return <div className={styles.equationStack}>
    <Equation caption="Left leaf · A and B" label="The left leaf error is 7 minus 8.5 squared plus 10 minus 8.5 squared.">{left}</Equation>
    <Equation caption="Evaluate the deviations" label="The left leaf error is 1.5 squared plus 1.5 squared, which equals 4.5.">{leftValue}</Equation>
    <Equation caption="Right leaf · C and D" label="The right leaf error is 16 minus 15.5 squared plus 15 minus 15.5 squared.">{right}</Equation>
    <Equation caption="Evaluate the deviations" label="The right leaf error is 0.5 squared plus negative 0.5 squared, which equals 0.5.">{rightValue}</Equation>
    <Equation caption="Reduction in squared error" label="The split's reduction in squared error is 54 minus 4.5 minus 0.5, which equals 49.">{gain}</Equation>
  </div>;
}

export function ParentSseMath() {
  const formula = mrow(mo('SSE'), mo('('), mi('parent'), mo(')'), mo('='), power(mrow(mn(7), mo('−'), mn(12)), 2), mo('+'), power(mrow(mn(10), mo('−'), mn(12)), 2));
  const remainder = mrow(mo('+'), power(mrow(mn(16), mo('−'), mn(12)), 2), mo('+'), power(mrow(mn(15), mo('−'), mn(12)), 2), mo('='), mn(54));
  return <div className={styles.equationStack}>
    <Equation caption="Compare the first two grades with the mean, 12" label="The parent node squared error begins with 7 minus 12 squared plus 10 minus 12 squared.">{formula}</Equation>
    <Equation caption="Add the other two grades" label="Add 16 minus 12 squared and 15 minus 12 squared; total parent error is 54.">{remainder}</Equation>
  </div>;
}

export function PruningMath() {
  const stump = mrow(mtext('no split · one leaf: '), mn(54), mo('+'), mi('α'));
  const split = mrow(mtext('one split · two leaves: '), mn(5), mo('+'), mn(2), mi('α'));
  const compare = mrow(mn(5), mo('+'), mn(2), mi('α'), mo('<'), mn(54), mo('+'), mi('α'), mo('⇒'), mi('α'), mo('<'), mn(49));
  return <div className={styles.equationStack}>
    <Equation caption="No split · one leaf" label="The no-split tree objective is 54 plus alpha.">{stump}</Equation>
    <Equation caption="Decision stump · one split, two leaves" label="The decision stump objective is 5 plus 2 alpha.">{split}</Equation>
    <Equation caption="When is the split worth it?" label="The split is preferred when alpha is less than 49.">{compare}</Equation>
  </div>;
}

export function ResidualMath() {
  const residuals = mrow(mi('r'), mo('='), mi('y'), mo('−'), sub(mi('F'), mn(0)));
  const residualValues = mrow(mi('r'), mo('='), mo('('), mn('−5'), mo(','), mn('−2'), mo(','), mn('+4'), mo(','), mn('+3'), mo(')'));
  const h1 = sub(mi('h'), mn(1)); const f1 = sub(mi('F'), mn(1));
  const correctionLeft = mrow(h1, mo('('), mi('x'), mo(')'), mo('='), mn('−3.5'));
  const correctionRight = mrow(h1, mo('('), mi('x'), mo(')'), mo('='), mn('+3.5'));
  const update = mrow(f1, mo('('), mi('x'), mo(')'), mo('='), mn(12), mo('+'), mn('0.5'), mo('·'), h1, mo('('), mi('x'), mo(')'));
  const leftPrediction = mrow(sub(mi('F'), mn(1)), mo('('), mi('A'), mo(')'), mo('='), sub(mi('F'), mn(1)), mo('('), mi('B'), mo(')'), mo('='), mn('10.25'));
  const rightPrediction = mrow(sub(mi('F'), mn(1)), mo('('), mi('C'), mo(')'), mo('='), sub(mi('F'), mn(1)), mo('('), mi('D'), mo(')'), mo('='), mn('13.75'));
  return <div className={styles.equationStack}>
    <Equation caption="Residual definition" label="A residual is the observed response y minus the starting prediction F zero.">{residuals}</Equation>
    <Equation caption="For students A and B · left leaf" label="The first tree predicts a residual correction of minus 3.5 in the left leaf.">{correctionLeft}</Equation>
    <Equation caption="For students C and D · right leaf" label="The first tree predicts a residual correction of plus 3.5 in the right leaf.">{correctionRight}</Equation>
    <Equation caption="Add half of the correction" label="The first boosting update is the baseline 12 plus learning rate one half times the first tree correction.">{update}</Equation>
    <Equation caption="Residuals after the baseline" label="Residuals are minus 5, minus 2, plus 4, and plus 3 for students A through D.">{residualValues}</Equation>
    <Equation caption="Students A and B · left leaf" label="After the update, students A and B each have prediction 10.25.">{leftPrediction}</Equation>
    <Equation caption="Students C and D · right leaf" label="After the update, students C and D each have prediction 13.75.">{rightPrediction}</Equation>
  </div>;
}

export function UpdatedResidualMath() {
  const vector = mrow(mi('y'), mo('−'), sub(mi('F'), mn(1)), mo('='), mrow(mn('−3.25'), mo(','), mn('−0.25'), mo(','), mn('+2.25'), mo(','), mn('+1.25')));
  const firstPair = mrow(mo('SSE'), mo('('), sub(mi('F'), mn(1)), mo(')'), mo('='), power(mn('−3.25'), 2), mo('+'), power(mn('−0.25'), 2));
  const secondPair = mrow(mo('+'), power(mn('2.25'), 2), mo('+'), power(mn('1.25'), 2), mo('='), mn('17.25'));
  return <div className={styles.equationStack}>
    <Equation label="Residuals after the first update are minus 3.25, minus 0.25, plus 2.25, and plus 1.25.">{vector}</Equation>
    <Equation caption="Add the first two squared residuals" label="Start the updated sum of squared errors with negative 3.25 squared and negative 0.25 squared.">{firstPair}</Equation>
    <Equation caption="Add the last two · total error" label="Add 2.25 squared and 1.25 squared; updated sum of squared errors is 17.25.">{secondPair}</Equation>
  </div>;
}

export function GradientMath() {
  const loss = mrow(mi('L'), mo('('), mi('y'), mo(','), mi('F'), mo(')'), mo('='), frac(mn(1), mn(2)), power(mrow(mi('y'), mo('−'), mi('F')), 2));
  const deriv = mrow(frac(mrow(mo('∂'), mi('L')), mrow(mo('∂'), mi('F'))), mo('='), mi('F'), mo('−'), mi('y'));
  const negative = mrow(mo('−'), frac(mrow(mo('∂'), mi('L')), mrow(mo('∂'), mi('F'))), mo('='), mi('y'), mo('−'), mi('F'));
  return <div className={styles.equationStack}>
    <Equation label="Half squared error loss equals one half times y minus F squared.">{loss}</Equation>
    <Equation label="The derivative of loss with respect to F is F minus y.">{deriv}</Equation>
    <Equation label="The negative gradient is y minus F, exactly the residual.">{negative}</Equation>
  </div>;
}

export function ShrinkageMath() {
  const recurrence = mrow(sub(mi('F'), mi('m')), mo('='), sub(mi('F'), mrow(mi('m'), mo('−'), mn(1))), mo('+'), mi('η'), sub(mi('h'), mi('m')));
  const closed = mrow(sub(mi('F'), mi('m')), mo('='), mi('μ'), mo('+'), sup(mrow(mn(1), mo('−'), mi('η')), mi('m')), mo('('), sub(mi('F'), mn(0)), mo('−'), mi('μ'), mo(')'));
  const sseM = mrow(sub(mi('SSE'), mi('M')), mo('='), mn(5), mo('+'), mn(49), sup(mrow(mn(1), mo('−'), mi('η')), mrow(mn(2), mi('M'))));
  return <div className={styles.equationStack}>
    <Equation caption="One stage at a time" label="The stagewise update adds learning rate eta times the new tree to the current prediction.">{recurrence}</Equation>
    <Equation caption="The remaining gap shrinks geometrically" label="For a fixed leaf target mu, repeated shrinkage approaches mu at a geometric rate.">{closed}</Equation>
    <Equation caption="Training error after M rounds" label="In the fixed split example, training SSE after M rounds is 5 plus 49 times 1 minus eta to the power 2M.">{sseM}</Equation>
  </div>;
}

export function ClassificationGradientMath() {
  const sigmoid = mrow(mi('p'), mo('('), mi('x'), mo(')'), mo('='), frac(mn(1), mrow(mn(1), mo('+'), sup(mi('e'), mrow(mo('−'), mi('F'))))));
  const gradient = mrow(mo('−'), frac(mrow(mo('∂'), mi('L')), mrow(mo('∂'), mi('F'))), mo('='), mi('y'), mo('−'), mi('p'));
  return <div className={styles.equationStack}>
    <Equation label="The predicted probability is the sigmoid of the model score F.">{sigmoid}</Equation>
    <Equation label="For binary logistic loss, the negative gradient is the observed label y minus predicted probability p.">{gradient}</Equation>
  </div>;
}

export function LassoZeroDerivation() {
  const penalty = mn('0.2');
  const ols = mrow(mi('L'), mo('('), mi('β'), mo(')'), mo('='), power(mrow(mi('β'), mo('−'), mn('0.1')), 2));
  const lassoObjective = mrow(mi('Q'), mo('('), mi('β'), mo(')'), mo('='), power(mrow(mi('β'), mo('−'), mn('0.1')), 2), mo('+'), penalty, mo('|'), mi('β'), mo('|'));
  const lassoPositive = mrow(mi("Q'"), mo('('), mi('β'), mo(')'), mo('='), mn(2), mo('('), mi('β'), mo('−'), mn('0.1'), mo(')'), mo('+'), mn('0.2'), mo('='), mn(2), mi('β'));
  const lassoNegative = mrow(mi("Q'"), mo('('), mi('β'), mo(')'), mo('='), mn(2), mo('('), mi('β'), mo('−'), mn('0.1'), mo(')'), mo('−'), mn('0.2'), mo('='), mn(2), mi('β'), mo('−'), mn('0.4'));
  const sides = mrow(mi("Q'"), mo('('), mn('0'), mo('−'), mo(')'), mo('='), mn('−0.4'), mo(';'), mi("Q'"), mo('('), mn('0'), mo('+'), mo(')'), mo('='), mn('0'));
  const ridgeObjective = mrow(mi('Q'), mo('('), mi('β'), mo(')'), mo('='), power(mrow(mi('β'), mo('−'), mn('0.1')), 2), mo('+'), mn('0.2'), power(mi('β'), 2));
  const ridgeSolve = mrow(mn(2), mo('('), mi('β'), mo('−'), mn('0.1'), mo(')'), mo('+'), mn('0.4'), mi('β'), mo('='), mn(0), mo('⇒'), mn('2.4'), mi('β'), mo('='), mn('0.2'));
  const ridgeAnswer = mrow(sub(mi('β'), mtext('Ridge')), mo('='), frac(mn('0.1'), mn('1.2')), mo('≈'), mn('0.0833'));
  const lassoAnswer = mrow(sub(mi('β'), mtext('LASSO')), mo('='), mn(0));
  return <div className={styles.lassoDerivation}>
    <p className={styles.lassoEyebrow}>The one-coefficient example</p>
    <p>Start with an unregularized best coefficient of 0.1. Add the same penalty strength, λ = 0.2, to Ridge and LASSO. The squared-error term here has no one-half multiplier, so keep that convention visible while comparing the answers.</p>
    <div className={styles.equationStack}>
      <Equation caption="Starting loss" label="The unregularized loss is beta minus 0.1 squared, minimized at beta equals 0.1.">{ols}</Equation>
      <Equation caption="Add the L1 penalty" label="The LASSO objective is beta minus 0.1 squared plus 0.2 times the absolute value of beta.">{lassoObjective}</Equation>
      <Equation caption="For a positive coefficient" label="For beta greater than zero, the LASSO objective derivative simplifies to 2 beta.">{lassoPositive}</Equation>
      <Equation caption="For a negative coefficient" label="For beta less than zero, the LASSO objective derivative simplifies to 2 beta minus 0.4.">{lassoNegative}</Equation>
      <Equation caption="Check the corner at zero" label="The left derivative at zero is negative 0.4 and the right derivative is zero, so the convex objective decreases toward zero and increases after it.">{sides}</Equation>
      <Equation caption="LASSO result" label="The global LASSO minimizer is exactly zero.">{lassoAnswer}</Equation>
    </div>
    <p>On the negative side, the slope stays below zero; on the positive side, it is above zero. The objective falls toward the corner from the left and rises away from it on the right. That makes zero the global minimum, even though the unregularized optimum was 0.1.</p>
    <div className={styles.ridgeContrast}>
      <div><p className={styles.lassoEyebrow}>Same example · Ridge</p><p>Ridge has a smooth penalty, so its optimum is where the derivative equals zero:</p></div>
      <div className={styles.equationStack}>
        <Equation caption="Ridge objective" label="The Ridge objective is beta minus 0.1 squared plus 0.2 beta squared.">{ridgeObjective}</Equation>
        <Equation caption="Differentiate and solve" label="The first-order condition gives 2.4 beta equals 0.2.">{ridgeSolve}</Equation>
        <Equation caption="Ridge result" label="The Ridge estimate is approximately 0.0833, smaller than 0.1 but not zero.">{ridgeAnswer}</Equation>
      </div>
    </div>
    <p className={styles.conventionNote}><strong>Why does the threshold sometimes appear as λ instead?</strong> With the common loss <span className={styles.inlineMath}>½(β − z)² + λ|β|</span>, soft thresholding subtracts λ. This slide’s toy loss is <span className={styles.inlineMath}>(β − z)² + λ|β|</span>, so the threshold is λ/2. The two formulas differ only because the squared-error term is scaled differently.</p>
  </div>;
}

export function LassoThresholdExplorer() {
  const [lambda, setLambda] = useState(0.2);
  const [z, setZ] = useState(0.1);
  const threshold = lambda / 2;
  const estimate = Math.sign(z) * Math.max(Math.abs(z) - threshold, 0);
  const rule = mrow(sub(mi('β̂'), mtext('LASSO')), mo('='), mi('sign'), mo('('), mi('z'), mo(')'), sub(mrow(mo('('), mo('|'), mi('z'), mo('|'), mo('−'), frac(mi('λ'), mn(2)), mo(')')), mo('+')));
  const left = 48; const right = 468; const top = 18; const bottom = 238;
  const x = (value: number) => left + ((value + 0.6) / 1.2) * (right - left);
  const y = (value: number) => bottom - ((value + 0.6) / 1.2) * (bottom - top);
  const diagonal = `M${x(-0.6)} ${y(-0.6)} L${x(0.6)} ${y(0.6)}`;
  const soft = `M${x(-0.6)} ${y(-0.6 + threshold)} L${x(-threshold)} ${y(0)} L${x(threshold)} ${y(0)} L${x(0.6)} ${y(0.6 - threshold)}`;
  return <section className={styles.lassoExplorer} aria-labelledby="lasso-threshold-title">
    <div className={styles.lassoExplorerIntro}><p className={styles.lassoEyebrow}>Explore the threshold</p><h3 id="lasso-threshold-title">Which coefficients survive?</h3><p>Move the OLS coefficient and penalty. Values inside the shaded band are set exactly to zero.</p></div>
    <div className={styles.lassoRange}>
      <label htmlFor="lasso-ols-value">OLS coefficient z</label><input id="lasso-ols-value" type="range" min="-0.6" max="0.6" step="0.01" value={z} onChange={(event) => setZ(Number(event.target.value))} /><output htmlFor="lasso-ols-value">{z.toFixed(2)}</output>
      <label htmlFor="lasso-penalty-value">Penalty λ</label><input id="lasso-penalty-value" type="range" min="0" max="0.6" step="0.01" value={lambda} onChange={(event) => setLambda(Number(event.target.value))} /><output htmlFor="lasso-penalty-value">{lambda.toFixed(2)}</output>
    </div>
    <Equation caption="Soft-threshold rule for this loss convention" label="The LASSO coefficient equals the sign of z times the positive part of the absolute value of z minus lambda over two.">{rule}</Equation>
    <figure className={styles.lassoPlot}>
      <svg viewBox="0 0 500 280" role="img" aria-label={`Soft thresholding plot. At OLS coefficient ${z.toFixed(2)} and lambda ${lambda.toFixed(2)}, the LASSO coefficient is ${estimate.toFixed(2)}. The threshold band extends from negative ${threshold.toFixed(2)} to positive ${threshold.toFixed(2)}.`}>
        <rect className={styles.thresholdBand} x={x(-threshold)} y={top} width={x(threshold)-x(-threshold)} height={bottom-top} />
        {[-0.6,-0.3,0,0.3,0.6].map((tick)=><g key={tick}><line className={styles.lassoGrid} x1={left} x2={right} y1={y(tick)} y2={y(tick)} /><line className={styles.lassoGrid} x1={x(tick)} x2={x(tick)} y1={top} y2={bottom} /><text className={styles.lassoTick} x={x(tick)} y={bottom+18} textAnchor="middle">{tick.toFixed(1)}</text><text className={styles.lassoTick} x={left-8} y={y(tick)+4} textAnchor="end">{tick.toFixed(1)}</text></g>)}
        <line className={styles.lassoAxis} x1={left} x2={right} y1={y(0)} y2={y(0)} /><line className={styles.lassoAxis} x1={x(0)} x2={x(0)} y1={top} y2={bottom} />
        <path className={styles.olsLine} d={diagonal} /><path className={styles.thresholdLine} d={soft} />
        <circle className={styles.lassoPoint} cx={x(z)} cy={y(estimate)} r="6" />
        <text className={styles.lassoAxisLabel} x={(left+right)/2} y="276" textAnchor="middle">OLS coefficient z</text><text className={styles.lassoAxisLabel} transform="translate(13 128) rotate(-90)" textAnchor="middle">LASSO estimate β̂</text>
      </svg>
      <figcaption><span><i className={styles.legendOls}/> No penalty: β̂ = z</span><span><i className={styles.legendLasso}/> LASSO: sign(z)(|z| − λ/2)₊</span></figcaption>
    </figure>
    <div className={styles.lassoReadout} aria-live="polite"><span>Threshold ±{threshold.toFixed(2)}</span><strong>β̂<sub>LASSO</sub> = {estimate.toFixed(2)}</strong><span>{estimate === 0 ? 'Inside the band: switched off.' : 'Outside the band: shrunk toward zero.'}</span></div>
  </section>;
}

export function MathExamplesHero() {
  return <header className={styles.hero}>
    <p className={styles.kicker}>TREES &amp; BOOSTING CALCULATIONS</p>
    <h1>From splits<br />to stages.</h1>
    <p>Worked calculations for regression trees and gradient boosting. Follow each number from a student’s grade to an ensemble update.</p>
    <div className={styles.heroMarks} aria-hidden="true"><span>Σ</span><i>→</i><span>∇</span><i>→</i><span>F<sub>M</sub></span></div>
  </header>;
}

export function LassoMathHero() {
  return <header className={styles.hero}>
    <p className={styles.kicker}>LASSO ALGEBRA</p>
    <h1>Why zero?</h1>
    <p>Follow one coefficient through the same Ridge and LASSO penalty, and see where the sharp corner changes the answer.</p>
    <div className={styles.heroMarks} aria-hidden="true"><span>|β|</span><i>→</i><span>0</span></div>
  </header>;
}
