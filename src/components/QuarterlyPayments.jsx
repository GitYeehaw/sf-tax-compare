import { formatCurrency } from '../utils/formatters';
import './QuarterlyPayments.css';

export default function QuarterlyPayments({ results }) {
  if (!results || results.length === 0) return null;

  const quarters = results[0].quarterlyPayments;

  return (
    <div className="quarterly-wrapper">
      <h2 className="section-title">Estimated Quarterly Payments</h2>
      <p className="quarterly-subtitle">
        Self-employed individuals pay estimated taxes quarterly via IRS Form 1040-ES and CA Form 540-ES.
      </p>
      <div className="table-scroll">
        <table className="quarterly-table">
          <thead>
            <tr>
              <th>Quarter</th>
              <th>Due Date</th>
              {results.map((r) => (
                <th key={r.label}>{r.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quarters.map((q, qi) => (
              <tr key={q.quarter}>
                <td className="quarter-label">{q.quarter}</td>
                <td className="quarter-date">{q.dueDate}</td>
                {results.map((r) => {
                  const payment = r.quarterlyPayments[qi];
                  return (
                    <td key={r.label} className="quarter-amount">
                      <div className="quarter-total">{formatCurrency(payment.total)}</div>
                      <div className="quarter-breakdown">
                        <span>Fed: {formatCurrency(payment.federal)}</span>
                        <span>CA: {formatCurrency(payment.california)}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="annual-total-row">
              <td colSpan="2" className="row-label">Annual Total</td>
              {results.map((r) => {
                const annualTotal = r.quarterlyPayments.reduce((sum, q) => sum + q.total, 0);
                return (
                  <td key={r.label} className="quarter-amount">
                    <div className="quarter-total">{formatCurrency(annualTotal)}</div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
