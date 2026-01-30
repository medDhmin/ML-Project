
import React from 'react';
import './ResultModal.css';

const ResultModal = ({ result, formData, onClose }) => {
    if (!result) return null;

    const isApproved = result.approved;
    const probability = result.probability * 100;

    // 1. Determine Chance Level
    let chanceLevel = 'Low';
    let chanceColor = 'error'; // default css var name suffix
    if (probability >= 70) {
        chanceLevel = 'High';
        chanceColor = 'success';
    } else if (probability >= 40) {
        chanceLevel = 'Medium';
        chanceColor = 'warning';
    }

    // 2. Generate Insights Rule Logic
    const getInsights = (data) => {
        const reasons = [];
        const suggestions = [];

        // Credit Score
        if (data.credit_score && data.credit_score < 580) {
            reasons.push("Low credit score");
            suggestions.push("Improve credit score by paying on time and reducing debt.");
        }

        // Defaults
        if (data.previous_loan_defaults_on_file === 'Yes') {
            reasons.push("Previous loan defaults");
            suggestions.push("Build a clean repayment history over time.");
        }

        // Credit History
        if (data.cb_person_cred_hist_length && data.cb_person_cred_hist_length < 2) {
            reasons.push("Short credit history");
            suggestions.push("Increase credit history length before reapplying.");
        }

        // Work Exp
        if (data.person_emp_exp !== '' && data.person_emp_exp < 1) {
            reasons.push("Limited work experience");
            // No specific suggestion mapped in prompt, but we can imply one or skip
        }

        // Income vs Loan
        const income = parseFloat(data.person_income);
        const loan = parseFloat(data.loan_amnt);
        if (income > 0 && loan > 0) {
            if (loan > (income * 0.4)) { // Threshold: Loan is > 40% of annual income
                reasons.push("Low income relative to requested loan");
                suggestions.push("Increase income or reduce the loan amount.");
            }
        }

        // Fallback
        if (suggestions.length === 0 && !isApproved) {
            suggestions.push("Double-check inputs for accuracy.");
        }

        // Validating limits (max 3)
        return {
            reasons: reasons.slice(0, 3),
            suggestions: suggestions.slice(0, 3)
        };
    };

    const { reasons, suggestions } = getInsights(formData);
    const showInsights = reasons.length > 0 || suggestions.length > 0;

    return (
        <div className="result-overlay">
            <div className={`result-modal ${isApproved ? 'approved' : 'rejected'} ${showInsights ? 'has-insights' : ''}`}>
                <button className="result-close-btn" onClick={onClose}>&times;</button>

                <div className="result-content-grid">
                    {/* Left Column: Status & Score */}
                    <div className="result-left">
                        <div className="result-header-section">
                            <div className="result-icon-container">
                                {isApproved ? (
                                    <svg className="result-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="result-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>

                            <h2 className="result-heading">
                                {isApproved ? 'Loan Approved' : 'Loan Rejected'}
                            </h2>
                            <p className="result-subheading">
                                {isApproved
                                    ? "Congratulations! Your profile meets the criteria for approval."
                                    : "Approval is unlikely based on the provided information."}
                            </p>
                        </div>

                        <div className="result-probability-block">
                            <div className="prob-header">
                                <span className="prob-label">Estimated approval chance</span>
                                <span className="prob-value">{probability.toFixed(1)}%</span>
                            </div>
                            <div className="prob-bar-bg">
                                <div
                                    className={`prob-bar-fill ${chanceLevel.toLowerCase()}`}
                                    style={{ width: `${probability}%` }}
                                ></div>
                            </div>
                            <div className={`prob-badge ${chanceLevel.toLowerCase()}`}>
                                {chanceLevel}
                            </div>
                        </div>

                        <div className="result-footer">
                            <button className="result-action-btn primary" onClick={onClose}>
                                Edit Application
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Insights (if any) */}
                    {showInsights && (
                        <div className="result-right">
                            <div className="result-insights-section">
                                {reasons.length > 0 && (
                                    <div className="insight-block">
                                        <h4 className="insight-title red">What affected this</h4>
                                        <ul className="insight-list">
                                            {reasons.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {suggestions.length > 0 && (
                                    <div className="insight-block">
                                        <h4 className="insight-title blue">How to improve</h4>
                                        <ul className="insight-list">
                                            {suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
