import React, { FormEvent, useState } from 'react';
import styles from './styles.module.css';

export function DiscussionQuestion({ children }: { children: React.ReactNode }) {
  return <aside className={styles.question}><span className={styles.eyebrow}>Pause and consider</span><p>{children}</p></aside>;
}

export function LearningQuestion() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  return <section className={styles.exercise} aria-labelledby="learning-question-title">
    <p className={styles.eyebrow}>Make a prediction</p>
    <h3 id="learning-question-title">A program predicts tomorrow’s temperature using a fixed mathematical formula. Has it learned?</h3>
    <fieldset className={styles.choiceSet}>
      <legend>Choose your answer</legend>
      <label className={styles.choice}><input type="radio" name="learning-question" value="yes" checked={answer === 'yes'} onChange={() => setAnswer('yes')} /> Yes. It produces a prediction.</label>
      <label className={styles.choice}><input type="radio" name="learning-question" value="no" checked={answer === 'no'} onChange={() => setAnswer('no')} /> No. A prediction alone does not show learning.</label>
    </fieldset>
    {answer && <p className={styles.feedback} role="status"><strong>{answer === 'no' ? 'That’s the key distinction.' : 'Prediction is not enough.'}</strong> In this scenario, the formula is fixed: we have not said that the program learns from examples or changes through experience.</p>}
  </section>;
}

export function DefinitionReflection() {
  return <details className={styles.reflection}>
    <summary>What is missing from this definition?</summary>
    <p>It does not say what counts as success, or how we would know whether learning improved performance. Tom Mitchell’s definition makes those parts explicit with Experience, Task, and Performance.</p>
  </details>;
}

const mappingOptions = [
  { value: 'experience', label: 'The historical applications and repayment outcomes' },
  { value: 'task', label: 'Predict whether a new applicant will default' },
  { value: 'performance', label: 'Accuracy on unseen applications' },
];

export function ExperienceTaskPerformance() {
  const [answers, setAnswers] = useState({ E: '', T: '', P: '' });
  const [checked, setChecked] = useState(false);
  const correct = { E: 'experience', T: 'task', P: 'performance' };
  const labels = { E: 'Experience', T: 'Task', P: 'Performance measure' };
  const update = (part: keyof typeof answers, value: string) => {
    setAnswers((current) => ({ ...current, [part]: value }));
    setChecked(false);
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setChecked(true); };
  return <form className={styles.exercise} onSubmit={onSubmit}>
    <p className={styles.eyebrow}>Tom Mitchell’s E–T–P framework</p>
    <p className={styles.scenario}>A bank uses historical loan applications and observed repayment outcomes to train a model that predicts default.</p>
    <p>Match each part of the definition to the bank’s example.</p>
    <div className={styles.matchGrid}>
      {(['E', 'T', 'P'] as const).map((part) => <label key={part} className={styles.matchRow}>
        <span><strong>{part}</strong><span>{labels[part]}</span></span>
        <select value={answers[part]} onChange={(event) => update(part, event.target.value)} aria-label={`${labels[part]} example`}>
          <option value="">Choose a match…</option>
          {mappingOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>)}
    </div>
    <button className={styles.actionButton} type="submit" disabled={Object.values(answers).some((answer) => !answer)}>Check my matches</button>
    {checked && <div className={styles.feedback} role="status">
      <p><strong>{Object.keys(correct).every((part) => answers[part as keyof typeof correct] === correct[part as keyof typeof correct]) ? 'All three match.' : 'Compare each match with the definition.'}</strong></p>
      <ul>
        <li><strong>E — Experience:</strong> the historical applications and repayment outcomes.</li>
        <li><strong>T — Task:</strong> predicting default for a new applicant.</li>
        <li><strong>P — Performance:</strong> here, predictive accuracy on unseen applications.</li>
      </ul>
      <p>Accuracy is one possible measure. If defaults are uncommon, accuracy alone can hide poor identification of the cases that matter.</p>
    </div>}
  </form>;
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
    <p className={styles.caption} aria-live="polite">{learning ? 'The examples show which answers go with which inputs.' : 'The programmer specifies rules that transform data into an output.'}</p>
  </div>;
}

export function PredictionVsCausation() {
  const [prediction, setPrediction] = useState<'yes' | 'no' | null>(null);
  const [showCausal, setShowCausal] = useState(false);
  const [causal, setCausal] = useState<'yes' | 'no' | null>(null);
  return <section className={styles.exercise} aria-labelledby="prediction-title">
    <p className={styles.eyebrow}>A prediction is not a policy answer</p>
    <p className={styles.scenario}>In the data, customers with lower income are more likely to default.</p>
    <h3 id="prediction-title">Can we use this relationship to predict default risk?</h3>
    <fieldset className={styles.choiceSet}>
      <legend>Choose your answer</legend>
      <label className={styles.choice}><input type="radio" name="prediction-answer" checked={prediction === 'yes'} onChange={() => { setPrediction('yes'); setShowCausal(false); setCausal(null); }} /> Yes, an observed relationship can help predict risk.</label>
      <label className={styles.choice}><input type="radio" name="prediction-answer" checked={prediction === 'no'} onChange={() => { setPrediction('no'); setShowCausal(false); setCausal(null); }} /> No, prediction requires proving a cause.</label>
    </fieldset>
    {prediction && <div className={styles.feedback} role="status"><strong>{prediction === 'yes' ? 'Yes—potentially.' : 'Prediction does not require a causal explanation.'}</strong> If the pattern holds for the people we predict for, income may help forecast risk. That alone does not tell us what would happen if income changed.
      {!showCausal && <p><button type="button" className={styles.textButton} onClick={() => setShowCausal(true)}>Now consider a change →</button></p>}
    </div>}
    {showCausal && <div className={styles.causalStep}>
      <h3>If we increased a customer’s income, would their probability of default necessarily decrease?</h3>
      <fieldset className={styles.choiceSet}>
        <legend>Choose your answer</legend>
        <label className={styles.choice}><input type="radio" name="causal-answer" checked={causal === 'yes'} onChange={() => setCausal('yes')} /> Yes. The observed pattern tells us what the change would cause.</label>
        <label className={styles.choice}><input type="radio" name="causal-answer" checked={causal === 'no'} onChange={() => setCausal('no')} /> Not necessarily. Association alone cannot answer an intervention question.</label>
      </fieldset>
      {causal && <p className={styles.feedback} role="status"><strong>{causal === 'no' ? 'Exactly.' : 'That conclusion goes beyond the evidence.'}</strong> The observed relationship can support prediction, but it does not establish what changing income would cause.</p>}
    </div>}
    {causal && <p className={styles.takeaway}>Understanding why a model predicts something is different from understanding why it happens in the real world.</p>}
  </section>;
}

const milestones = [
  { year: '1950s', title: 'Learning programs & neural-network ideas', text: 'Early programs explored whether computers could improve through experience. Arthur Samuel’s checkers work made learning from play a concrete task.', citations: [{ label: 'Samuel (1959)', href: '#ref-samuel' }] },
  { year: '1980s', title: 'Decision trees & backpropagation', text: 'Decision trees and backpropagation became influential ways to represent and learn patterns.', citations: [{ label: 'Rumelhart, Hinton & Williams (1986)', href: '#ref-rumelhart' }] },
  { year: '1990s', title: 'Lasso, SVMs & ensembles', text: 'The Lasso and support-vector networks added influential approaches to learning from data. Bagging and boosting also broadened the toolbox; their later tree-based developments appear in the 2001 milestone.', citations: [{ label: 'Tibshirani, “Regression Shrinkage and Selection via the Lasso” (1996)', href: '#ref-tibshirani' }, { label: 'Cortes & Vapnik, “Support-vector networks” (1995)', href: '#ref-cortes-vapnik' }] },
  { year: '2001', title: 'Random Forests & Gradient Boosting', text: 'Breiman’s Random Forests and Friedman’s Gradient Boosting became influential methods for combining predictions from multiple trees.', citations: [{ label: 'Breiman, “Random Forests” (2001)', href: '#ref-breiman' }, { label: 'Friedman, “Gradient Boosting” (2001)', href: '#ref-friedman' }] },
  { year: '2012', title: 'AlexNet & ImageNet', text: 'AlexNet’s ImageNet result demonstrated the impact of deep neural networks for large-scale image recognition.', citations: [{ label: 'Krizhevsky, Sutskever & Hinton (2012)', href: '#ref-krizhevsky' }] },
  { year: '2017', title: 'Transformers', text: '“Attention Is All You Need” introduced the Transformer architecture, later central to large language models.', citations: [{ label: 'Vaswani et al. (2017)', href: '#ref-vaswani' }] },
  { year: '2020', title: 'GPT-3', text: 'GPT-3 showed how a large Transformer language model could perform a range of tasks from text prompts, bringing broad attention to generative AI.' },
];

export function MLHistoryTimeline() {
  const [selected, setSelected] = useState(0);
  const item = milestones[selected];
  return <div className={styles.timeline}>
    <div className={styles.timelineTrack} role="group" aria-label="Select a machine learning history milestone">
      {milestones.map((milestone, index) => <button type="button" key={milestone.year} aria-pressed={selected === index} aria-label={`${milestone.year}: ${milestone.title}`} className={selected === index ? styles.milestoneSelected : styles.milestone} onClick={() => setSelected(index)}><span className={styles.dot} /><span>{milestone.year}</span></button>)}
    </div>
    <article className={styles.milestoneDetail} aria-live="polite"><span className={styles.eyebrow}>{item.year}</span><h3>{item.title}</h3><p>{item.text}</p>{item.citations && <p className={styles.citations}>References: {item.citations.map((citation, index) => <React.Fragment key={citation.href}>{index > 0 && '; '}<a href={citation.href}>{citation.label}</a></React.Fragment>)}</p>}</article>
    <p className={styles.caption}>New techniques expand the toolbox; they do not replace every method that came before.</p>
  </div>;
}

export function AlgorithmsDataCompute() {
  return <figure className={styles.ingredients}>
    <div className={styles.ingredientRow}><span><strong>Algorithms</strong><small>Architectures and learning methods</small></span><span aria-hidden="true">×</span><span><strong>Data</strong><small>Examples and benchmarks</small></span><span aria-hidden="true">×</span><span><strong>Compute</strong><small>GPUs and scalable systems</small></span></div>
    <div className={styles.result}>Progress</div>
    <figcaption>Progress ≈ Algorithms × Data × Compute <span>— a teaching metaphor, not a scientific equation.</span></figcaption>
  </figure>;
}

export function ComputerEngineeringDecision() {
  const [choice, setChoice] = useState<'yes' | 'no' | 'depends' | null>(null);
  return <section className={styles.exercise} aria-labelledby="deployment-title">
    <p className={styles.eyebrow}>A systems thought experiment</p>
    <h3 id="deployment-title">A model predicts very well but takes 30 days to train on one billion observations. Would you deploy it?</h3>
    <fieldset className={styles.choiceSet}>
      <legend>Choose the answer closest to your view</legend>
      <label className={styles.choice}><input type="radio" name="deployment-choice" checked={choice === 'yes'} onChange={() => setChoice('yes')} /> Yes, predictive performance is excellent.</label>
      <label className={styles.choice}><input type="radio" name="deployment-choice" checked={choice === 'no'} onChange={() => setChoice('no')} /> No, 30 days is too long.</label>
      <label className={styles.choice}><input type="radio" name="deployment-choice" checked={choice === 'depends'} onChange={() => setChoice('depends')} /> It depends on how and where it will be used.</label>
    </fieldset>
    {choice && <p className={styles.feedback} role="status"><strong>{choice === 'depends' ? 'It does depend.' : 'That could be right in some settings.'}</strong> A 30-day training cycle may work for a model updated rarely, but not one that must be retrained often. Deployment also depends on prediction latency, scale, computing cost, and the value of the decision. These are the kinds of practical constraints studied in Computer Engineering and systems.</p>}
    <p className={styles.takeaway}>A model can be mathematically elegant but computationally impractical.</p>
  </section>;
}
