import React from 'react';
import styles from './lecture06.module.css';

type Tag = 'mi' | 'mn' | 'mo' | 'mrow' | 'msub' | 'msup' | 'msqrt' | 'mfrac' | 'munderover' | 'munder' | 'mtext';
const node = (tag: Tag, ...children: React.ReactNode[]) => React.createElement(tag as React.ElementType, null, ...children);
const mi = (value: string) => node('mi', value);
const mn = (value: number | string) => node('mn', String(value));
const mo = (value: string) => node('mo', value);
const row = (...children: React.ReactNode[]) => node('mrow', ...children);
const sub = (base: React.ReactNode, index: React.ReactNode) => node('msub', base, index);
const sup = (base: React.ReactNode, power: React.ReactNode) => node('msup', base, power);
const mfrac = (numerator: React.ReactNode, denominator: React.ReactNode) => node('mfrac', numerator, denominator);
const sum = (lower: React.ReactNode, upper?: React.ReactNode) => upper ? node('munderover', mo('∑'), lower, upper) : node('munder', mo('∑'), lower);
const argmin = (variables: React.ReactNode) => node('munder', mi('arg min'), variables);

function Equation({ label, lines }: { label: string; lines: React.ReactNode[] }) {
  return <div className={styles.mathCard}>
    <div className={styles.equation} role="math" aria-label={label}>
      {lines.map((line, index) => React.createElement('math' as React.ElementType, { display: 'block', key: index }, line))}
    </div>
  </div>;
}

export function LeafMeanEquation() {
  const index = row(mi('i'), mo(':'), sub(mi('x'), mi('i')), mo('∈'), mi('R'));
  return <Equation label="The prediction in a leaf is the constant minimizing squared error, equal to the mean response in that leaf." lines={[
    row(sub(mi('ĉ'), mi('R')), mo('='), argmin(mi('c')), sum(index), sup(row(sub(mi('y'), mi('i')), mo('−'), mi('c')), mn(2)), mo('='), sub(mi('ȳ'), mi('R'))),
  ]} />;
}

export function SplitObjectiveEquation() {
  const leftIndex = row(sub(mi('x'), row(mi('i'), mi('j'))), mo('≤'), mi('s'));
  const rightIndex = row(sub(mi('x'), row(mi('i'), mi('j'))), mo('>'), mi('s'));
  const left = row(sum(leftIndex), sup(row(sub(mi('y'), mi('i')), mo('−'), sub(mi('ȳ'), mi('L'))), mn(2)));
  const right = row(sum(rightIndex), sup(row(sub(mi('y'), mi('i')), mo('−'), sub(mi('ȳ'), mi('R'))), mn(2)));
  return <Equation label="Choose the feature and threshold with the smallest sum of squared errors in the left and right child nodes." lines={[
    row(mo('('), mi('j*'), mo(','), mi('s*'), mo(')'), mo('='), argmin(row(mi('j'), mo(','), mi('s'))), mo('['), left, mo('+'), right, mo(']')),
  ]} />;
}

export function PruningEquation() {
  const leaves = row(mi('m'), mo('∈'), mi('L'), mo('('), mi('T'), mo(')'));
  const treeSet = row(mi('T'), mo('⊆'), sub(mi('T'), mi('max')));
  return <Equation label="Cost-complexity pruning minimizes the sum of leaf errors plus alpha times the number of leaves." lines={[
    row(sub(mi('T̂'), mi('α')), mo('='), argmin(treeSet), mo('['), sum(leaves), sub(mi('SSE'), mi('m')), mo('+'), mi('α'), mo('|'), mi('L'), mo('('), mi('T'), mo(')'), mo('|'), mo(']')),
  ]} />;
}

export function InitialPredictionEquation() {
  return <Equation label="The initial constant minimizes total training loss; with squared error it is the response mean, 12." lines={[
    row(sub(mi('ĉ'), mn(0)), mo('='), argmin(mi('c')), sum(mi('i')), mi('L'), mo('('), sub(mi('y'), mi('i')), mo(','), mi('c'), mo(')'), mo(';'), sub(mi('F'), mn(0)), mo('('), mi('x'), mo(')'), mo('='), sub(mi('ĉ'), mn(0)), mo('='), mi('ȳ'), mo('='), mn(12)),
  ]} />;
}

export function SquaredLossEquation() {
  const loss = row(mi('L'), mo('('), mi('y'), mo(','), mi('F'), mo(')'), mo('='), mn('½'), sup(row(mi('y'), mo('−'), mi('F')), mn(2)));
  const derivative = row(mfrac(mo('∂'), row(mo('∂'), mi('F'))), mi('L'), mo('='), mi('F'), mo('−'), mi('y'));
  const negative = row(mo('−'), mfrac(mo('∂'), row(mo('∂'), mi('F'))), mi('L'), mo('='), mi('y'), mo('−'), mi('F'));
  return <Equation label="For half squared error, the negative derivative with respect to the prediction equals the residual." lines={[loss, derivative, negative]} />;
}

export function TreePredictionEquation() {
  const index = row(mi('m'), mo('='), mn(1));
  const region = row(mi('x'), mo('∈'), sub(mi('R'), mi('m')));
  const indicator = row(mo('𝟙'), mo('['), region, mo(']'));
  return <Equation label="A regression tree predicts the value of the leaf region containing x." lines={[
    row(mi('f̂'), mo('('), mi('x'), mo(')'), mo('='), sum(index, mi('M')), sub(mi('c'), mi('m')), mo('·'), indicator),
  ]} />;
}

export function StagewiseUpdateEquation() {
  return <Equation label="The model at stage m equals the previous model plus the learning rate times the new tree prediction." lines={[
    row(sub(mi('F'), mi('m')), mo('('), mi('x'), mo(')'), mo('='), sub(mi('F'), row(mi('m'), mo('−'), mn(1))), mo('('), mi('x'), mo(')'), mo('+'), mi('η'), sub(mi('h'), mi('m')), mo('('), mi('x'), mo(')')),
  ]} />;
}
