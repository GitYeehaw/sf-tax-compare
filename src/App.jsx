import { useState, useMemo } from 'react';
import { calculateAll } from './tax/calculator';
import InputPanel from './components/InputPanel';
import SummaryCards from './components/SummaryCards';
import BarChart from './components/BarChart';
import ComparisonTable from './components/ComparisonTable';
import QuarterlyPayments from './components/QuarterlyPayments';
import DeductionsInfo from './components/DeductionsInfo';
import Disclaimer from './components/Disclaimer';
import './App.css';

export default function App() {
  const [inputs, setInputs] = useState({
    hourlyRate: 100,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    sCorpSalaryPercent: 60,
    sCorpAdminCost: 2000,
  });

  const { grossIncome, results } = useMemo(
    () => calculateAll(inputs),
    [inputs]
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>SF Self-Employment Tax Calculator</h1>
          <p className="header-subtitle">
            Compare income tax across business structures &mdash; San Francisco, CA &middot; 2026 Tax Year
          </p>
        </div>
      </header>

      <main className="app-main">
        <InputPanel inputs={inputs} onChange={setInputs} />

        {grossIncome > 0 && (
          <>
            <SummaryCards results={results} />
            <BarChart results={results} />
            <ComparisonTable results={results} />
            <QuarterlyPayments results={results} />
            <DeductionsInfo results={results} />
          </>
        )}

        {grossIncome <= 0 && (
          <div className="empty-state">
            <p>Enter an hourly rate above to see your tax comparison.</p>
          </div>
        )}

        <Disclaimer />
      </main>

      <footer className="app-footer">
        <p>
          Tax data sourced from <a href="https://www.irs.gov/filing/federal-income-tax-rates-and-brackets" target="_blank" rel="noopener noreferrer">IRS.gov</a> and <a href="https://www.ftb.ca.gov" target="_blank" rel="noopener noreferrer">CA FTB</a>.
          Updated for the One Big Beautiful Bill Act.
        </p>
      </footer>
    </div>
  );
}
