import { formatCurrency, formatPercent } from '../utils/formatters';
import './BarChart.css';

export default function BarChart({ results }) {
  if (!results || results.length === 0) return null;

  const segments = [
    { key: 'federalIncomeTax', label: 'Federal Income Tax', className: 'seg-federal' },
    { key: 'californiaTotal', label: 'CA State Tax', className: 'seg-state' },
    { key: (r) => r.selfEmploymentTax || r.payrollTax, label: 'SE / Payroll Tax', className: 'seg-se' },
    { key: 'adminCosts', label: 'Admin Costs', className: 'seg-admin' },
    { key: 'takeHomePay', label: 'Take-Home', className: 'seg-takehome' },
  ];

  return (
    <div className="bar-chart-wrapper">
      <h2 className="section-title">Visual Comparison</h2>
      <div className="bar-chart">
        {results.map((r) => (
          <div key={r.label} className="bar-row">
            <div className="bar-label">{r.label}</div>
            <div className="bar-track">
              {segments.map((seg) => {
                const value = typeof seg.key === 'function' ? seg.key(r) : r[seg.key];
                const pct = r.grossIncome > 0 ? (value / r.grossIncome) * 100 : 0;
                if (pct < 0.5) return null;
                return (
                  <div
                    key={seg.label}
                    className={`bar-segment ${seg.className}`}
                    style={{ width: `${pct}%` }}
                    title={`${seg.label}: ${formatCurrency(value)} (${formatPercent(value / r.grossIncome)})`}
                  >
                    {pct > 8 && (
                      <span className="seg-text">{formatPercent(value / r.grossIncome)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="bar-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="legend-item">
            <div className={`legend-dot ${seg.className}`} />
            <span>{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
