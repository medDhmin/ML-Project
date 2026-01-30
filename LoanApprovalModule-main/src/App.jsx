import React, { useState, useEffect } from 'react';
import WelcomeModal from './WelcomeModal';
import EligibilityPreviewCard from './EligibilityPreviewCard';
import InfoTooltip from './InfoTooltip';
import ResultModal from './ResultModal';
import logo from './assets/logo.png';

function App() {
  const [formData, setFormData] = useState({
    person_age: '',
    person_gender: 'female',
    person_education: 'Bachelor',
    person_income: '',
    person_emp_exp: '',
    person_home_ownership: 'RENT',
    loan_amnt: '',
    loan_intent: 'EDUCATION',
    loan_int_rate: '',
    loan_percent_income: '',
    cb_person_cred_hist_length: '',
    credit_score: '',
    previous_loan_defaults_on_file: 'No'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-calculate loan_percent_income
  useEffect(() => {
    const income = parseFloat(formData.person_income);
    const amount = parseFloat(formData.loan_amnt);

    if (income > 0 && !isNaN(amount)) {
      const ratio = parseFloat((amount / income).toFixed(4));
      if (formData.loan_percent_income !== ratio) {
        setFormData(prev => ({ ...prev, loan_percent_income: ratio }));
      }
    } else {
      if (formData.loan_percent_income !== '') {
        setFormData(prev => ({ ...prev, loan_percent_income: '' }));
      }
    }
  }, [formData.loan_amnt, formData.person_income, formData.loan_percent_income]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (formData.person_age < 0) {
      alert("Age cannot be negative.");
      setLoading(false);
      return;
    }
    if (formData.person_emp_exp > formData.person_age) {
      alert("Work experience cannot exceed age.");
      setLoading(false);
      return;
    }
    if (formData.cb_person_cred_hist_length > formData.person_age) {
      alert("Credit history (years) cannot exceed age.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      // No scrolling needed anymore as it's a modal
    } catch (error) {
      console.error('Error fetching prediction:', error);
      alert(`An error occurred during prediction: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-wrapper">
      <WelcomeModal />
      <ResultModal result={result} formData={formData} onClose={() => setResult(null)} />

      {/* Main Content Area */}
      <main className="app-container">
        <header className="header">
          <h1><span>📊</span> Loan Predictor</h1>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Applicant */}
          <section className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
            <h2 className="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Applicant Information
            </h2>
            <div className="grid">
              {/* Row 1: Age (3) | Gender (4) | Education (5) */}
              <div className="field-group col-span-3">
                <label className="label">
                  Age
                  <InfoTooltip text="Your age in years (must be 18+)." />
                </label>
                <input
                  type="number"
                  name="person_age"
                  className="input"
                  placeholder="Ex: 25"
                  min="0"
                  value={formData.person_age}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group col-span-4">
                <label className="label">
                  Gender
                  <InfoTooltip text="Select your gender for demographic analysis." />
                </label>
                <select
                  name="person_gender"
                  className="select"
                  value={formData.person_gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="field-group col-span-5">
                <label className="label">
                  Education Level
                  <InfoTooltip text="Your highest completed level of education." />
                </label>
                <select
                  name="person_education"
                  className="select"
                  value={formData.person_education}
                  onChange={handleChange}
                >
                  <option value="Associate">Associate</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="High School">High School</option>
                  <option value="Master">Master</option>
                </select>
              </div>

              {/* Row 2: Income (6) | Work Exp (6) */}
              <div className="field-group col-span-6">
                <label className="label">
                  Annual Income ($)
                  <InfoTooltip text="Total annual income before taxes." />
                </label>
                <input
                  type="number"
                  name="person_income"
                  className="input"
                  placeholder="Enter income"
                  value={formData.person_income}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group col-span-6">
                <label className="label">
                  Work Exp (Years)
                  <InfoTooltip text="Number of years of professional employment." />
                </label>
                <input
                  type="number"
                  name="person_emp_exp"
                  className="input"
                  placeholder="Exp years"
                  min="0"
                  value={formData.person_emp_exp}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 3: Home Ownership (full width like Address) */}
              <div className="field-group col-span-12">
                <label className="label">
                  Home Ownership
                  <InfoTooltip text="Your current housing situation." />
                </label>
                <select
                  name="person_home_ownership"
                  className="select"
                  value={formData.person_home_ownership}
                  onChange={handleChange}
                >
                  <option value="RENT">Rent</option>
                  <option value="MORTGAGE">Mortgage</option>
                  <option value="OWN">Own</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Credit */}
          <section className="section">
            <h2 className="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Credit Information
            </h2>
            <div className="grid">
              {/* Row 4: Score (6) | History (6) */}
              <div className="field-group col-span-6">
                <label className="label">
                  Credit Score
                  <InfoTooltip text="Your credit score (300-850)." />
                </label>
                <input
                  type="number"
                  name="credit_score"
                  className="input"
                  placeholder="300-850"
                  min="0"
                  value={formData.credit_score}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group col-span-6">
                <label className="label">
                  History (Years)
                  <InfoTooltip text="Length of your credit history in years." />
                </label>
                <input
                  type="number"
                  name="cb_person_cred_hist_length"
                  className="input"
                  placeholder="Years"
                  min="0"
                  value={formData.cb_person_cred_hist_length}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 5: Defaults (Full width) */}
              <div className="field-group col-span-12">
                <label className="label">
                  Previous Loan Defaults
                  <InfoTooltip text="Have you ever defaulted on a loan before?" />
                </label>
                <select
                  name="previous_loan_defaults_on_file"
                  className="select"
                  value={formData.previous_loan_defaults_on_file}
                  onChange={handleChange}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 3: Loan */}
          <section className="section">
            <h2 className="section-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Loan Details
            </h2>
            <div className="grid">
              {/* Row 6: Amount (4) | Intent (4) | Rate (4) */}
              <div className="field-group col-span-4">
                <label className="label">Amount ($)</label>
                <input
                  type="number"
                  name="loan_amnt"
                  className="input"
                  placeholder="Amount"
                  min="0"
                  value={formData.loan_amnt}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field-group col-span-4">
                <label className="label">Intent</label>
                <select
                  name="loan_intent"
                  className="select"
                  value={formData.loan_intent}
                  onChange={handleChange}
                >
                  <option value="PERSONAL">Personal</option>
                  <option value="EDUCATION">Education</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="VENTURE">Venture</option>
                  <option value="HOMEIMPROVEMENT">Home Improvement</option>
                  <option value="DEBTCONSOLIDATION">Debt Consolidation</option>
                </select>
              </div>
              <div className="field-group col-span-4">
                <label className="label">Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  name="loan_int_rate"
                  className="input"
                  placeholder="Ex: 10.5"
                  value={formData.loan_int_rate}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 7: Ratio (Full Width) */}
              <div className="field-group col-span-12">
                <label className="label">Loan/Income Ratio</label>
                <input
                  type="text"
                  className="input"
                  value={formData.loan_percent_income}
                  readOnly
                  disabled
                />
                <span className="hint">Calculated automatically</span>
              </div>
            </div>
          </section>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Analyzing...' : 'Predict Eligibility'}
          </button>
        </form>
      </main>

      {/* Sidebar: Live Eligibility Preview */}
      <div className="sidebar">
        <EligibilityPreviewCard formData={formData} />
      </div>
    </div>
  );
}

export default App;
