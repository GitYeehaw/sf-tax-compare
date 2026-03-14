import { formatCurrency, formatPercent } from '../utils/formatters';
import './SummaryCards.css';

export default function SummaryCards({ results }) {
  if (!results || results.length === 0) return null;

  const bestIndex = results.reduce((best, r, i) =>
    r.takeHomePay > results[best].takeHomePay ? i : best, 0);

  return (
    <div className="summary-cards">
      {results.map((r, i) => (
        <div key={r.label} className={`summary-card ${i === bestIndex ? 'best' : ''}`}>
          {i === bestIndex && <div className="best-badge">Best Option</div>}
          <h3 className="card-label">{r.label}</h3>
          <div className="card-take-home">{formatCurrency(r.takeHomePay)}</div>
          <div className="card-sublabel">Annual Take-Home</div>
          <div className="card-stats">
            <div className="card-stat">
              <span className="stat-label">Total Tax</span>
              <span className="stat-value">{formatCurrency(r.totalTax)}</span>
            </div>
            <div className="card-stat">
              <span className="stat-label">Effective Rate</span>
              <span className={`stat-value rate ${getRateClass(r.effectiveRate)}`}>
                {formatPercent(r.effectiveRate)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function getRateClass(rate) {
  if (rate < 0.25) return 'rate-low';
  if (rate < 0.35) return 'rate-mid';
  return 'rate-high';
}
