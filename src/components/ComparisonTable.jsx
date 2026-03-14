import { formatCurrency, formatPercent } from '../utils/formatters';
import './ComparisonTable.css';

export default function ComparisonTable({ results }) {
  if (!results || results.length === 0) return null;

  const rows = [
    { label: 'Gross Income', key: 'grossIncome', type: 'currency' },
    { label: 'SE Tax / Payroll Tax', getValue: (r) => r.selfEmploymentTax || r.payrollTax, type: 'currency', className: 'tax-row' },
    { label: 'SE Tax Deduction', key: 'seTaxDeduction', type: 'currency-negative', hide: (r) => !r.seTaxDeduction },
    { label: 'Adjusted Gross Income', key: 'agi', type: 'currency' },
    { divider: true, label: 'Federal Taxes' },
    { label: 'Standard Deduction', key: 'federalStandardDeduction', type: 'currency-negative' },
    { label: 'QBI Deduction', key: 'qbiDeduction', type: 'currency-negative', hide: (r) => !r.qbiDeduction },
    { label: 'Federal Taxable Income', key: 'federalTaxableIncome', type: 'currency' },
    { label: 'Federal Income Tax', key: 'federalIncomeTax', type: 'currency', className: 'tax-row' },
    { divider: true, label: 'California Taxes' },
    { label: 'CA Standard Deduction', key: 'caStandardDeduction', type: 'currency-negative' },
    { label: 'CA Taxable Income', key: 'caTaxableIncome', type: 'currency' },
    { label: 'CA Income Tax', key: 'californiaIncomeTax', type: 'currency', className: 'tax-row' },
    { label: 'Mental Health Surcharge', key: 'californiaMentalHealthSurcharge', type: 'currency', hide: (r) => !r.californiaMentalHealthSurcharge },
    { divider: true, label: 'Totals' },
    { label: 'Admin / Filing Costs', key: 'adminCosts', type: 'currency', hide: (r) => !r.adminCosts },
    { label: 'Total Tax & Costs', key: 'totalTax', type: 'currency', className: 'total-row' },
    { label: 'Take-Home Pay', key: 'takeHomePay', type: 'currency', className: 'total-row takehome-row' },
    { label: 'Effective Tax Rate', key: 'effectiveRate', type: 'percent', className: 'total-row' },
  ];

  return (
    <div className="comparison-table-wrapper">
      <h2 className="section-title">Detailed Breakdown</h2>
      <div className="table-scroll">
        <table className="comparison-table">
          <thead>
            <tr>
              <th></th>
              {results.map((r) => (
                <th key={r.label}>{r.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              if (row.divider) {
                return (
                  <tr key={i} className="divider-row">
                    <td colSpan={results.length + 1}>{row.label}</td>
                  </tr>
                );
              }

              const allHidden = row.hide && results.every(row.hide);
              if (allHidden) return null;

              return (
                <tr key={i} className={row.className || ''}>
                  <td className="row-label">{row.label}</td>
                  {results.map((r) => {
                    const value = row.getValue ? row.getValue(r) : r[row.key];
                    return (
                      <td key={r.label} className="row-value">
                        {formatValue(value, row.type)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatValue(value, type) {
  if (value === undefined || value === null) return '—';
  switch (type) {
    case 'currency':
      return formatCurrency(value);
    case 'currency-negative':
      return value > 0 ? `(${formatCurrency(value)})` : '—';
    case 'percent':
      return formatPercent(value);
    default:
      return value;
  }
}
