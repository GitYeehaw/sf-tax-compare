import { formatCurrency } from '../utils/formatters';
import './DeductionsInfo.css';

export default function DeductionsInfo({ results }) {
  if (!results || results.length === 0) return null;

  const deductions = [
    {
      name: 'Federal Standard Deduction',
      amount: '$16,100',
      description: 'Applied to AGI before computing federal income tax (2026, per OBBBA).',
      applies: 'All entities',
    },
    {
      name: 'California Standard Deduction',
      amount: '$5,706',
      description: 'Applied to AGI before computing California state income tax.',
      applies: 'All entities',
    },
    {
      name: '50% Self-Employment Tax Deduction',
      getAmount: (r) => r.seTaxDeduction > 0 ? formatCurrency(r.seTaxDeduction) : null,
      description: 'Half of SE tax is deductible from gross income to calculate AGI. Reduces both federal and state taxable income.',
      applies: 'Sole Prop & LLC only',
    },
    {
      name: 'Qualified Business Income (QBI) Deduction',
      getAmount: (r) => r.qbiDeduction > 0 ? formatCurrency(r.qbiDeduction) : null,
      description: '20% of qualified business income. Made permanent by OBBBA. Phases out for single filers between $201,775–$276,775 (2026). $400 minimum if QBI exceeds $1,000. Applies to federal tax only (not California).',
      applies: 'All entities (distribution for S-Corp)',
    },
  ];

  return (
    <div className="deductions-wrapper">
      <h2 className="section-title">Deductions Applied</h2>
      <div className="deductions-grid">
        {deductions.map((d) => {
          const amounts = d.getAmount
            ? results.map((r) => ({ label: r.label, amount: d.getAmount(r) })).filter((a) => a.amount)
            : null;

          return (
            <div key={d.name} className="deduction-card">
              <div className="deduction-header">
                <h3 className="deduction-name">{d.name}</h3>
                {d.amount && <span className="deduction-amount">{d.amount}</span>}
              </div>
              {amounts && amounts.length > 0 && (
                <div className="deduction-amounts">
                  {amounts.map((a) => (
                    <span key={a.label} className="deduction-entity-amount">
                      {a.label}: {a.amount}
                    </span>
                  ))}
                </div>
              )}
              <p className="deduction-description">{d.description}</p>
              <span className="deduction-applies">{d.applies}</span>
            </div>
          );
        })}
      </div>

      <div className="obbba-note">
        <h3 className="obbba-title">Other OBBBA Provisions (2025–2028)</h3>
        <ul className="obbba-list">
          <li><strong>Senior Deduction:</strong> Additional $6,000 for taxpayers age 65+ (phases out at higher income)</li>
          <li><strong>No Tax on Tips:</strong> Up to $25,000 deduction for qualifying tip workers (phases out above $150K MAGI)</li>
          <li><strong>No Tax on Overtime:</strong> Up to $12,500 deduction for qualified overtime pay (phases out above $150K MAGI)</li>
          <li><strong>Car Loan Interest:</strong> Up to $10,000 deduction for personal vehicle loans</li>
        </ul>
      </div>
    </div>
  );
}
