// Inline SVG/HTML diagram components — no external images needed

export function CourtHierarchy() {
  const courts = [
    { name: 'U.S. Supreme Court', sub: '9 Justices · Final authority on federal law', color: '#f59e0b', w: '70%' },
    { name: 'U.S. Courts of Appeals', sub: '13 Circuits · Reviews district court decisions', color: '#60a5fa', w: '80%' },
    { name: 'U.S. District Courts', sub: '94 Districts · Trial courts of general federal jurisdiction', color: '#34d399', w: '90%' },
  ];
  return (
    <div className="p-2 space-y-2">
      {courts.map((c, i) => (
        <div key={i} className="mx-auto" style={{ width: c.w }}>
          <div className="rounded-xl p-3 text-center border" style={{ borderColor: c.color + '60', background: c.color + '18' }}>
            <p className="font-bold text-sm text-slate-100">{c.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
          </div>
          {i < courts.length - 1 && (
            <div className="flex justify-center mt-1">
              <div className="w-px h-3 bg-slate-600" />
            </div>
          )}
        </div>
      ))}
      <div className="mt-4 pt-3 border-t border-slate-700">
        <p className="text-[10px] text-slate-500 text-center mb-2">State Court Integration</p>
        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
          <div className="bg-slate-700/40 rounded-lg p-2"><span className="text-amber-400 font-semibold">Federal Q:</span> Cases involving federal law, U.S. Constitution, or diversity jurisdiction (&gt;$75k)</div>
          <div className="bg-slate-700/40 rounded-lg p-2"><span className="text-emerald-400 font-semibold">State courts:</span> Most civil & criminal cases. State supreme court → SCOTUS only on federal questions.</div>
        </div>
      </div>
    </div>
  );
}

export function CivilLitigationFlow() {
  const steps = [
    { name: 'Complaint Filed', desc: 'Plaintiff files complaint + summons served on defendant', color: '#f59e0b' },
    { name: 'Answer / Motions', desc: 'Defendant responds; parties may file Rule 12 motions', color: '#60a5fa' },
    { name: 'Discovery', desc: 'Interrogatories, depositions, document requests, RFAs', color: '#a78bfa' },
    { name: 'Pre-Trial Motions', desc: 'Summary judgment, motions in limine, case management', color: '#f97316' },
    { name: 'Trial', desc: 'Jury selection → opening → evidence → closing → verdict', color: '#34d399' },
    { name: 'Judgment & Appeal', desc: 'Post-trial motions → appeal to circuit court if needed', color: '#fb7185' },
  ];
  return (
    <div className="p-2 space-y-2">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="shrink-0 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-900" style={{ backgroundColor: s.color }}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px h-4 mt-0.5" style={{ backgroundColor: s.color + '60' }} />}
          </div>
          <div className="pb-1">
            <p className="text-sm font-semibold text-slate-100">{s.name}</p>
            <p className="text-xs text-slate-400">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContractElements() {
  const elements = [
    { name: 'Offer', icon: '📋', color: '#f59e0b', points: ['Clear & definite terms', 'Communicated to offeree', 'Intent to be bound'] },
    { name: 'Acceptance', icon: '✅', color: '#34d399', points: ['Mirror image rule (common law)', 'UCC: Battle of the forms', 'Must be communicated'] },
    { name: 'Consideration', icon: '⚖️', color: '#60a5fa', points: ['Bargained-for exchange', 'Legal detriment or benefit', 'Must be adequate (not nominal)'] },
    { name: 'Capacity & Legality', icon: '🛡️', color: '#a78bfa', points: ['Legal age & mental capacity', 'Legal subject matter', 'Not against public policy'] },
  ];
  return (
    <div className="p-2">
      <div className="grid grid-cols-2 gap-2 mb-3">
        {elements.map((el, i) => (
          <div key={i} className="rounded-xl p-3 border" style={{ borderColor: el.color + '50', background: el.color + '12' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-base">{el.icon}</span>
              <span className="text-sm font-bold text-slate-100">{el.name}</span>
            </div>
            <ul className="space-y-0.5">
              {el.points.map((p, j) => <li key={j} className="text-[10px] text-slate-400">• {p}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-3 text-center">
        <p className="text-xs font-bold text-amber-300">All 4 elements required = Enforceable Contract</p>
        <p className="text-[10px] text-slate-400 mt-0.5">Missing any element → contract void or voidable</p>
      </div>
    </div>
  );
}

export function NegligenceElements() {
  const steps = [
    { name: 'Duty', color: '#f59e0b', desc: 'Defendant owed plaintiff a duty of reasonable care', note: 'Reasonable person standard' },
    { name: 'Breach', color: '#f97316', desc: 'Defendant failed to meet that standard of care', note: 'Res ipsa loquitur can help establish' },
    { name: 'Causation', color: '#a78bfa', desc: 'Breach caused the harm (actual + proximate)', note: 'But-for test + foreseeability' },
    { name: 'Damages', color: '#34d399', desc: 'Plaintiff suffered actual compensable harm', note: 'Compensatory, punitive, nominal' },
  ];
  return (
    <div className="p-2 space-y-3">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-slate-900 text-sm" style={{ backgroundColor: s.color }}>
              {i + 1}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-slate-100">{s.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-400">{s.note}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
          </div>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-slate-700 flex gap-2 flex-wrap">
        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded-full">Defenses: Contributory negligence</span>
        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded-full">Comparative fault</span>
        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded-full">Assumption of risk</span>
      </div>
    </div>
  );
}

export function BillOfRights() {
  const amendments = [
    { num: '1st', desc: 'Speech, religion, press, assembly, petition', color: '#f59e0b' },
    { num: '2nd', desc: 'Right to keep and bear arms', color: '#f97316' },
    { num: '4th', desc: 'Protection from unreasonable search & seizure', color: '#60a5fa' },
    { num: '5th', desc: 'Grand jury, double jeopardy, self-incrimination, due process', color: '#a78bfa' },
    { num: '6th', desc: 'Speedy trial, jury, counsel, confrontation', color: '#34d399' },
    { num: '8th', desc: 'No cruel & unusual punishment or excessive bail', color: '#fb7185' },
    { num: '14th', desc: 'Due process + equal protection; incorporates Bill of Rights to states', color: '#fbbf24' },
  ];
  return (
    <div className="p-2 space-y-2">
      {amendments.map((a, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-slate-900" style={{ backgroundColor: a.color }}>
            {a.num}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed pt-1">{a.desc}</p>
        </div>
      ))}
      <p className="text-[10px] text-slate-500 pt-2">3rd, 7th, 9th, 10th amendments omitted for brevity. 14th Amendment incorporation doctrine applies most of BOR to states.</p>
    </div>
  );
}

export function BusinessEntities() {
  const cols = ['Feature', 'Sole Prop.', 'Partnership', 'LLC', 'Corporation'];
  const rows = [
    ['Liability', 'Unlimited personal', 'Joint & several', 'Limited', 'Limited'],
    ['Taxation', 'Pass-through', 'Pass-through', 'Flexible', 'Double (C-corp)'],
    ['Formation', 'None required', 'Agreement', 'Articles + Op. Agmt', 'Articles + Bylaws'],
    ['Management', 'Owner', 'Partners', 'Members/Mgrs', 'Board/Officers'],
    ['Continuity', 'Ends at death', 'May dissolve', 'Perpetual', 'Perpetual'],
  ];
  const colors = ['#94a3b8', '#f59e0b', '#60a5fa', '#34d399', '#a78bfa'];
  return (
    <div className="p-1 overflow-x-auto">
      <table className="w-full text-[10px] border-collapse">
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i} className="px-2 py-1.5 text-left font-bold" style={{ color: colors[i] }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-slate-800/40' : ''}>
              {row.map((cell, j) => (
                <td key={j} className={`px-2 py-1.5 text-xs ${j === 0 ? 'font-semibold text-slate-300' : 'text-slate-400'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PropertyOwnership() {
  const estates = [
    { name: 'Fee Simple Absolute', color: '#34d399', duration: 'Infinite', transferable: 'Yes — freely', defeasible: 'No conditions', note: 'Strongest ownership interest' },
    { name: 'Fee Simple Defeasible', color: '#f59e0b', duration: 'Until condition', transferable: 'Yes, with condition', defeasible: 'Yes — determinable or on condition subsequent', note: 'Includes future interests' },
    { name: 'Life Estate', color: '#60a5fa', duration: 'Measuring life', transferable: 'Only for duration of life', defeasible: 'No', note: 'Followed by remainder or reversion' },
  ];
  return (
    <div className="p-2 space-y-3">
      {estates.map((e, i) => (
        <div key={i} className="rounded-xl p-3 border" style={{ borderColor: e.color + '50', background: e.color + '12' }}>
          <p className="font-bold text-sm mb-2" style={{ color: e.color }}>{e.name}</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
            <div><span className="text-slate-500">Duration: </span><span className="text-slate-300">{e.duration}</span></div>
            <div><span className="text-slate-500">Transfer: </span><span className="text-slate-300">{e.transferable}</span></div>
            <div className="col-span-2"><span className="text-slate-500">Defeasible: </span><span className="text-slate-300">{e.defeasible}</span></div>
            <div className="col-span-2 mt-0.5 text-slate-400 italic">{e.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfResponsibility() {
  const duties = [
    { name: 'Competence', rule: 'Rule 1.1', desc: 'Legal knowledge, skill, thoroughness required for representation', color: '#f59e0b' },
    { name: 'Confidentiality', rule: 'Rule 1.6', desc: 'Cannot reveal client info without informed consent; exceptions for crime/fraud prevention', color: '#60a5fa' },
    { name: 'Conflict of Interest', rule: 'Rule 1.7', desc: 'Cannot represent adverse interests without written consent; must analyze concurrent conflicts', color: '#f97316' },
    { name: 'Communication', rule: 'Rule 1.4', desc: 'Keep client reasonably informed; promptly respond to requests for information', color: '#a78bfa' },
    { name: 'Supervision of Paralegals', rule: 'Rule 5.3', desc: 'Supervising attorney is responsible for paralegal conduct; must ensure compliance with Rules', color: '#34d399' },
    { name: 'No Unauthorized Practice', rule: 'Rule 5.5', desc: 'Paralegals cannot give legal advice, represent clients in court, or set fees without supervision', color: '#fb7185' },
  ];
  return (
    <div className="p-2 space-y-2">
      {duties.map((d, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="shrink-0 mt-0.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-slate-900" style={{ backgroundColor: d.color }}>{d.rule}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{d.name}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{d.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HearsayExceptions() {
  const exceptions = [
    { rule: 'FRE 803(1)', name: 'Present Sense Impression', desc: 'Statement made while perceiving an event or immediately after', avail: 'Declarant available' },
    { rule: 'FRE 803(2)', name: 'Excited Utterance', desc: 'Statement relating to startling event while under stress of excitement', avail: 'Declarant available' },
    { rule: 'FRE 803(3)', name: 'State of Mind', desc: "Declarant's then-existing mental, emotional, or physical condition", avail: 'Declarant available' },
    { rule: 'FRE 803(6)', name: 'Business Records', desc: 'Records of regularly conducted business activity, made at or near time of event', avail: 'Declarant available' },
    { rule: 'FRE 804(b)(2)', name: 'Dying Declaration', desc: 'Statement by declarant believing death imminent about cause/circumstances', avail: 'Declarant unavailable' },
    { rule: 'FRE 804(b)(3)', name: 'Statement Against Interest', desc: 'Statement so contrary to interest that reasonable person would not make it without believing it true', avail: 'Declarant unavailable' },
    { rule: 'FRE 807', name: 'Residual Exception', desc: 'Trustworthy statement not covered by other exceptions; advance notice required', avail: 'Either' },
  ];
  return (
    <div className="p-2 space-y-1.5">
      <div className="flex gap-3 mb-2 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Declarant available</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> Declarant unavailable</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Either</span>
      </div>
      {exceptions.map((e, i) => {
        const dot = e.avail === 'Declarant available' ? '#f59e0b' : e.avail === 'Declarant unavailable' ? '#60a5fa' : '#a78bfa';
        return (
          <div key={i} className="flex items-start gap-2 bg-slate-800/50 rounded-lg p-2">
            <div className="shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: dot }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-amber-400">{e.rule}</span>
                <span className="text-xs font-semibold text-slate-200">{e.name}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{e.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FourthAmendment() {
  const nodes = [
    { q: 'Was there government action?', yes: 'Continue ↓', no: 'No 4th Amendment issue', yesColor: '#34d399', noColor: '#94a3b8' },
    { q: 'Did person have reasonable expectation of privacy?', yes: 'Continue ↓', no: 'No search — no warrant needed', yesColor: '#34d399', noColor: '#94a3b8' },
    { q: 'Was there a valid warrant (or recognized exception)?', yes: 'Search is constitutional', no: 'Search is unconstitutional → Exclusionary Rule', yesColor: '#34d399', noColor: '#fb7185' },
  ];
  const exceptions = ['Search incident to arrest', 'Automobile exception', 'Plain view', 'Consent', 'Exigent circumstances', 'Terry stop/frisk (reasonable suspicion)', 'Inventory search', 'Border search'];
  return (
    <div className="p-2">
      <div className="space-y-2 mb-3">
        {nodes.map((n, i) => (
          <div key={i}>
            <div className="bg-slate-700/50 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 text-center">{n.q}</div>
            <div className="flex gap-2 mt-1.5 justify-center">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: n.yesColor + '25', color: n.yesColor }}>YES: {n.yes}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: n.noColor + '25', color: n.noColor }}>NO: {n.no}</span>
            </div>
            {i < nodes.length - 1 && <div className="flex justify-center mt-1"><div className="w-px h-2 bg-slate-600" /></div>}
          </div>
        ))}
      </div>
      <div className="border-t border-slate-700 pt-2">
        <p className="text-[10px] font-bold text-amber-400 mb-1.5">Warrant Exceptions:</p>
        <div className="flex flex-wrap gap-1">
          {exceptions.map((ex, i) => <span key={i} className="text-[10px] bg-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded-full">{ex}</span>)}
        </div>
      </div>
    </div>
  );
}

export function ContractRemedies() {
  const remedies = [
    {
      name: 'Expectation Damages', color: '#f59e0b', icon: '🎯',
      goal: 'Put plaintiff in position had contract been performed',
      includes: ['Lost profits', 'Cost of substitute performance', 'Consequential damages (if foreseeable)'],
      limit: 'Must be proven with reasonable certainty',
    },
    {
      name: 'Reliance Damages', color: '#60a5fa', icon: '🔄',
      goal: 'Reimburse plaintiff for expenses incurred in reliance on the contract',
      includes: ['Out-of-pocket costs', 'Preparatory expenditures', 'Used when lost profits are too speculative'],
      limit: 'Cannot exceed expectation damages',
    },
    {
      name: 'Restitution', color: '#34d399', icon: '↩️',
      goal: 'Prevent unjust enrichment — recover benefit conferred on defendant',
      includes: ['Value of goods or services rendered', 'Available even if no contract formed', 'Quantum meruit (as much as deserved)'],
      limit: 'Measured by defendant\'s gain, not plaintiff\'s loss',
    },
    {
      name: 'Specific Performance', color: '#a78bfa', icon: '⚖️',
      goal: 'Equitable order to actually perform the contract',
      includes: ['Unique goods or real estate only', 'Money damages must be inadequate', 'Court discretion required'],
      limit: 'Not available for personal service contracts',
    },
  ];
  return (
    <div className="p-2 space-y-2">
      {remedies.map((r, i) => (
        <div key={i} className="rounded-xl p-3 border" style={{ borderColor: r.color + '50', background: r.color + '10' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <span>{r.icon}</span>
            <span className="text-sm font-bold" style={{ color: r.color }}>{r.name}</span>
          </div>
          <p className="text-[10px] text-slate-300 italic mb-1">{r.goal}</p>
          <ul className="space-y-0.5 mb-1">
            {r.includes.map((it, j) => <li key={j} className="text-[10px] text-slate-400">• {it}</li>)}
          </ul>
          <p className="text-[10px] text-amber-400/80">⚠ {r.limit}</p>
        </div>
      ))}
    </div>
  );
}

export function IntentionalTorts() {
  const torts = [
    { name: 'Assault', elements: 'Act + Reasonable apprehension of imminent harmful/offensive contact', defense: 'Self-defense, consent', color: '#f97316' },
    { name: 'Battery', elements: 'Intentional harmful/offensive contact with plaintiff\'s person', defense: 'Consent, self-defense, defense of others', color: '#fb7185' },
    { name: 'False Imprisonment', elements: 'Intentional confinement within fixed boundaries + awareness', defense: 'Shopkeeper\'s privilege (reasonable grounds)', color: '#a78bfa' },
    { name: 'IIED', elements: 'Extreme & outrageous conduct + intentional/reckless + severe emotional distress', defense: 'Defendant\'s status (public figures)', color: '#f59e0b' },
    { name: 'Trespass to Land', elements: 'Intentional entry (physical or object) on land — no actual damages required', defense: 'Consent, necessity, legal authority', color: '#34d399' },
    { name: 'Trespass to Chattels', elements: 'Intentional intermeddling causing actual harm or dispossession', defense: 'Consent, self-help recapture', color: '#60a5fa' },
    { name: 'Conversion', elements: 'Intentional act so seriously interfering with chattel that forced sale is justified', defense: 'Consent, necessity', color: '#38bdf8' },
  ];
  return (
    <div className="p-2 space-y-1.5">
      {torts.map((t, i) => (
        <div key={i} className="rounded-lg p-2 border-l-2 bg-slate-800/40" style={{ borderColor: t.color }}>
          <p className="text-xs font-bold mb-0.5" style={{ color: t.color }}>{t.name}</p>
          <p className="text-[10px] text-slate-300 leading-relaxed">{t.elements}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Defenses: {t.defense}</p>
        </div>
      ))}
    </div>
  );
}

export function RecordingActs() {
  const acts = [
    {
      name: 'Race Statute', color: '#34d399',
      rule: 'First to record wins — regardless of notice',
      winner: 'Whoever records first',
      notice: 'Irrelevant',
      states: 'NC, LA (rare)',
    },
    {
      name: 'Notice Statute', color: '#60a5fa',
      rule: 'Subsequent purchaser wins if they took without notice of prior conveyance',
      winner: 'Subsequent BFP without notice (even if not yet recorded)',
      notice: 'Must take without actual/constructive notice',
      states: 'CA, FL, TX (most common)',
    },
    {
      name: 'Race-Notice Statute', color: '#a78bfa',
      rule: 'Subsequent purchaser must BOTH record first AND take without notice',
      winner: 'First to record AND took without notice',
      notice: 'Must take without notice AND record first',
      states: 'NY, MA, IL (very common)',
    },
  ];
  return (
    <div className="p-2 space-y-2">
      {acts.map((a, i) => (
        <div key={i} className="rounded-xl p-3 border" style={{ borderColor: a.color + '50', background: a.color + '10' }}>
          <p className="font-bold text-sm mb-1.5" style={{ color: a.color }}>{a.name}</p>
          <p className="text-xs text-slate-200 mb-1.5 leading-relaxed">{a.rule}</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
            <div><span className="text-slate-500">Winner: </span><span className="text-slate-300">{a.winner}</span></div>
            <div><span className="text-slate-500">Notice: </span><span className="text-slate-300">{a.notice}</span></div>
            <div className="col-span-2"><span className="text-slate-500">Example states: </span><span className="text-slate-300">{a.states}</span></div>
          </div>
        </div>
      ))}
      <p className="text-[10px] text-slate-500">BFP = Bona Fide Purchaser for value</p>
    </div>
  );
}

export function StatuteOfFrauds() {
  const categories = [
    { icon: '🏠', name: 'Interests in Land', desc: 'Contracts to buy, sell, or lease real property for >1 year', exception: 'Part performance (possession + payment/improvements)' },
    { icon: '⏳', name: 'Cannot Perform Within 1 Year', desc: 'Contracts not capable of being performed within one year from formation', exception: 'Full performance by one party' },
    { icon: '🛡️', name: 'Surety / Guaranty', desc: "Promise to pay another's debt if they default (main purpose exception)", exception: 'Main purpose doctrine (suretyship for own benefit)' },
    { icon: '💍', name: 'Marriage Consideration', desc: 'Contracts where marriage is consideration (not marriage agreements themselves)', exception: 'Mutual promises to marry do not require writing' },
    { icon: '📦', name: 'Goods ≥ $500 (UCC)', desc: 'Sale of goods for $500 or more (raised to $1,000 under revised Article 2)', exception: 'Specially manufactured goods; payment + acceptance; merchant memo rule' },
    { icon: '🏛️', name: 'Executor / Administrator', desc: "Promise by estate representative to pay decedent's debt personally", exception: 'Rarely applies — watch for personal vs. estate liability' },
  ];
  return (
    <div className="p-2 space-y-2">
      <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-2 text-center mb-2">
        <p className="text-xs font-bold text-amber-300">MY LEGS Mnemonic</p>
        <p className="text-[10px] text-slate-400">Marriage · Year · Land · Executor · Goods · Surety</p>
      </div>
      {categories.map((c, i) => (
        <div key={i} className="bg-slate-800/50 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-base">{c.icon}</span>
            <span className="text-xs font-bold text-slate-200">{c.name}</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-0.5">{c.desc}</p>
          <p className="text-[10px] text-emerald-400/80">Exception: {c.exception}</p>
        </div>
      ))}
    </div>
  );
}

export function AdversePossession() {
  const elements = [
    { name: 'Actual Entry', abbr: 'A', color: '#f59e0b', desc: 'Physical use and possession of the land', examples: 'Farming, fencing, building, regular use' },
    { name: 'Open & Notorious', abbr: 'ON', color: '#f97316', desc: 'Visible and obvious to a reasonable owner who inspects the land', examples: 'Cannot be hidden or underground' },
    { name: 'Exclusive', abbr: 'E', color: '#a78bfa', desc: 'Possession not shared with the true owner', examples: 'Sharing with the public is OK; sharing with owner is not' },
    { name: 'Continuous', abbr: 'C', color: '#34d399', desc: 'Uninterrupted for the entire statutory period (tacking allowed)', examples: 'Seasonal use may satisfy if consistent with property type' },
    { name: 'Hostile', abbr: 'H', color: '#60a5fa', desc: "Without owner's permission and inconsistent with owner's rights", examples: "Owner's permission defeats hostility (use = license, not AP)" },
  ];
  return (
    <div className="p-2">
      <div className="flex justify-center gap-1 mb-3">
        {elements.map((e, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-slate-900" style={{ backgroundColor: e.color }}>{e.abbr}</div>
            {i < elements.length - 1 && <div className="hidden" />}
          </div>
        ))}
        <div className="flex items-center ml-2">
          <span className="text-xs text-slate-400">= AP claim (+ statutory period)</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {elements.map((e, i) => (
          <div key={i} className="rounded-lg p-2 border-l-2" style={{ borderColor: e.color, background: e.color + '10' }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-black px-1.5 rounded text-slate-900" style={{ backgroundColor: e.color }}>{e.abbr}</span>
              <span className="text-xs font-bold text-slate-200">{e.name}</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">{e.desc}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">e.g. {e.examples}</p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-500 mt-2">Statutory period varies by state (5–21 years). Tacking: add successive possessors' periods if privity exists.</p>
    </div>
  );
}

export function EvidenceStandards() {
  const standards = [
    { name: 'Beyond a Reasonable Doubt', pct: '~99%', bar: '97%', color: '#fb7185', used: 'Criminal conviction', desc: 'No reasonable doubt in juror\'s mind; highest standard' },
    { name: 'Clear & Convincing Evidence', pct: '~75%', bar: '75%', color: '#f59e0b', used: 'Fraud, punitive damages, civil commitment', desc: 'Highly & substantially more probable than not' },
    { name: 'Preponderance of Evidence', pct: '>50%', bar: '52%', color: '#34d399', used: 'Most civil claims', desc: 'More likely than not; plaintiff\'s scale tips even slightly' },
    { name: 'Probable Cause', pct: '~40%', bar: '40%', color: '#60a5fa', used: 'Arrest, search warrants, grand jury', desc: 'Fair probability that contraband or evidence will be found' },
    { name: 'Reasonable Suspicion', pct: '~25%', bar: '25%', color: '#a78bfa', used: 'Terry stop & frisk', desc: 'Articulable, reasonable belief of criminal activity — less than probable cause' },
  ];
  return (
    <div className="p-2 space-y-2">
      {standards.map((s, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs font-semibold text-slate-200">{s.name}</span>
            <span className="text-xs font-bold" style={{ color: s.color }}>{s.pct}</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-0.5">
            <div className="h-full rounded-full transition-all" style={{ width: s.bar, backgroundColor: s.color }} />
          </div>
          <div className="flex justify-between">
            <p className="text-[10px] text-slate-400">{s.desc}</p>
            <span className="text-[10px] shrink-0 ml-2 text-slate-500 italic">{s.used}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const DIAGRAM_VISUALS = {
  'Court Hierarchy':        CourtHierarchy,
  'Civil Litigation Flow':  CivilLitigationFlow,
  'Contract Elements':      ContractElements,
  'Negligence Elements':    NegligenceElements,
  'Bill of Rights':         BillOfRights,
  'Business Entities':      BusinessEntities,
  'Property Ownership':     PropertyOwnership,
  'Prof Responsibility':    ProfResponsibility,
  'Hearsay Exceptions':     HearsayExceptions,
  'Fourth Amendment':       FourthAmendment,
  'Contract Remedies':      ContractRemedies,
  'Intentional Torts':      IntentionalTorts,
  'Recording Acts':         RecordingActs,
  'Statute of Frauds':      StatuteOfFrauds,
  'Adverse Possession':     AdversePossession,
  'Evidence Standards':     EvidenceStandards,
};
