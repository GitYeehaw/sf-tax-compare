import { formatCurrency } from '../utils/formatters';
import './InputPanel.css';

export default function InputPanel({ inputs, onChange }) {
  const { hourlyRate, hoursPerWeek, weeksPerYear, sCorpSalaryPercent, sCorpAdminCost } = inputs;
  const grossIncome = hourlyRate * hoursPerWeek * weeksPerYear;

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'range' ? Number(e.target.value) : Number(e.target.value) || 0;
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="input-panel">
      <h2 className="input-panel-title">Income & Settings</h2>

      <div className="input-grid">
        <div className="input-group">
          <label htmlFor="hourlyRate">Hourly Rate</label>
          <div className="input-with-prefix">
            <span className="input-prefix">$</span>
            <input
              id="hourlyRate"
              type="number"
              min="0"
              step="5"
              value={hourlyRate || ''}
              onChange={handleChange('hourlyRate')}
              placeholder="0"
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="hoursPerWeek">Hours / Week</label>
          <input
            id="hoursPerWeek"
            type="number"
            min="1"
            max="80"
            value={hoursPerWeek}
            onChange={handleChange('hoursPerWeek')}
          />
        </div>

        <div className="input-group">
          <label htmlFor="weeksPerYear">Weeks / Year</label>
          <input
            id="weeksPerYear"
            type="number"
            min="1"
            max="52"
            value={weeksPerYear}
            onChange={handleChange('weeksPerYear')}
          />
        </div>

        <div className="input-group gross-income">
          <label>Annual Gross Income</label>
          <div className="gross-income-value">{formatCurrency(grossIncome)}</div>
        </div>
      </div>

      <div className="input-divider" />

      <h3 className="input-section-title">S-Corp Settings</h3>

      <div className="input-grid scorp-grid">
        <div className="input-group slider-group">
          <label htmlFor="sCorpSalaryPercent">
            Reasonable Salary: <strong>{sCorpSalaryPercent}%</strong>
          </label>
          <input
            id="sCorpSalaryPercent"
            type="range"
            min="40"
            max="80"
            step="5"
            value={sCorpSalaryPercent}
            onChange={handleChange('sCorpSalaryPercent')}
          />
          <div className="slider-labels">
            <span>40%</span>
            <span>80%</span>
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="sCorpAdminCost">Annual Admin Costs</label>
          <div className="input-with-prefix">
            <span className="input-prefix">$</span>
            <input
              id="sCorpAdminCost"
              type="number"
              min="0"
              max="10000"
              step="500"
              value={sCorpAdminCost}
              onChange={handleChange('sCorpAdminCost')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
