import { formatCurrency } from '../utils/formatters';
import './DeductionsInfo.css';

export default function DeductionsInfo({ results }) {
  if (!results || results.length === 0) return null;

  const deductions = [
    {
      name: 'Section 179 Deduction',
      getAmount: (r) => r.section179 > 0 ? formatCurrency(r.section179) : null,
      description: 'Immediate expensing of qualifying business equipment and software. OBBBA raised limit to $2.5M (inflation-adjusted to $2,560,000 for 2026). Phase-out begins at $4,090,000 in total equipment placed in service. Reduces business income before SE tax and all other calculations.',
      applies: 'Self-employed only (Sole Prop, LLC, S-Corp — not W-2)',
    },
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
      applies: 'Sole Prop & LLC only (not W-2)',
    },
    {
      name: 'Qualified Business Income (QBI) Deduction',
      getAmount: (r) => r.qbiDeduction > 0 ? formatCurrency(r.qbiDeduction) : null,
      description: '20% of qualified business income. Made permanent by OBBBA. Phases out for single filers between $201,775–$276,775 (2026). $400 minimum if QBI exceeds $1,000. Applies to federal tax only (not California). Not available to W-2 employees.',
      applies: 'Self-employed only (distribution for S-Corp, not W-2)',
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
        <h3 className="obbba-title">OBBBA Provisions (P.L. 119-21, 2025–2028)</h3>
        <p className="obbba-source">Source: <a href="https://www.irs.gov/newsroom/one-big-beautiful-bill-act-tax-deductions-for-working-americans-and-seniors" target="_blank" rel="noopener noreferrer">IRS FS-2025-03</a></p>
        <ul className="obbba-list">
          <li><strong>100% Bonus Depreciation:</strong> Permanent full first-year deduction for qualifying business property acquired after 1/19/2025 (Section 70307)</li>
          <li><strong>Section 179 Increase:</strong> Limit raised to $2.5M base ($2,560,000 inflation-adjusted for 2026); phase-out at $4,090,000</li>
          <li><strong>QBI Deduction:</strong> Made permanent with expanded phase-out range ($75K) and $400 minimum</li>
          <li><strong>Senior Deduction:</strong> Additional $6,000 per individual age 65+ ($12,000 joint); phases out above $75K MAGI ($150K joint)</li>
          <li><strong>No Tax on Tips:</strong> Up to $25,000 deduction for qualifying tip workers; phases out above $150K MAGI ($300K joint). Self-employed in SSTB ineligible</li>
          <li><strong>No Tax on Overtime:</strong> Up to $12,500 deduction ($25,000 joint) for qualified FLSA overtime; phases out above $150K MAGI ($300K joint)</li>
          <li><strong>Car Loan Interest:</strong> Up to $10,000 deduction for new US-assembled vehicles; phases out above $100K MAGI ($200K joint)</li>
          <li><strong>SALT Cap:</strong> Increased to $40,000 ($20,000 MFS) through 2029 for itemizers</li>
        </ul>
      </div>
    </div>
  );
}
