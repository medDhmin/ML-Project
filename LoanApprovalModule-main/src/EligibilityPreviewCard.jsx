
import React, { useState, useEffect, useRef } from 'react';
import './EligibilityPreviewCard.css';

const EligibilityPreviewCard = ({ formData }) => {
    const [status, setStatus] = useState('Incomplete'); // Incomplete, Updating, Low, Medium, High
    const [probability, setProbability] = useState(0);
    const [missingFields, setMissingFields] = useState([]);
    const [tip, setTip] = useState('');
    const timeoutRef = useRef(null);

    // Define required fields
    const requiredFields = [
        'person_income',
        'credit_score',
        'cb_person_cred_hist_length',
        // 'previous_loan_defaults_on_file', // Usually has a default value 'No'
        'person_emp_exp'
    ];

    const checkMissing = () => {
        return requiredFields.filter(field => !formData[field]);
    };

    useEffect(() => {
        // 0. Check completeness immediately
        const missing = checkMissing();
        setMissingFields(missing);

        if (missing.length > 0) {
            setStatus('Incomplete');
            setProbability(0);
            setTip('Complete the form to see your eligibility preview.');
            return;
        }

        // 1. Set Updating state
        setStatus('Updating');

        // 2. Debounce prediction
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(async () => {
            try {
                // Option A: Call Backend
                const response = await fetch('/api/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const data = await response.json();
                    const prob = data.probability;
                    setProbability(Math.round(prob * 100));

                    if (prob < 0.4) setStatus('Low');
                    else if (prob < 0.7) setStatus('Medium');
                    else setStatus('High');

                    generateTip(data.approved, formData);
                } else {
                    // Fallback to local if API fails silently or returns error
                    fallbackLocalEstimate();
                }

            } catch (error) {
                console.warn("Preview API failed, using local estimate", error);
                fallbackLocalEstimate();
            }
        }, 600);

        return () => clearTimeout(timeoutRef.current);
    }, [formData]);

    const fallbackLocalEstimate = () => {
        // Option B: Local logic
        let score = 0;
        if (formData.credit_score > 700) score += 40;
        else if (formData.credit_score > 600) score += 20;

        if (formData.previous_loan_defaults_on_file === 'No') score += 30;

        if (formData.person_income > 50000) score += 20;

        // Normalize to 0-100 logic roughly
        const estimatedProb = Math.min(score + 10, 95);
        setProbability(estimatedProb);

        if (estimatedProb < 40) setStatus('Low');
        else if (estimatedProb < 70) setStatus('Medium');
        else setStatus('High');

        generateTip(estimatedProb > 50, formData);
    };

    const generateTip = (approved, data) => {
        if (data.credit_score < 600) {
            setTip("Improving credit score may increase approval chances.");
        } else if (data.previous_loan_defaults_on_file === 'Yes') {
            setTip("A clean repayment history strongly improves eligibility.");
        } else if (data.loan_amnt && data.person_income && (data.loan_amnt / data.person_income > 0.4)) {
            setTip("Lowering loan amount relative to income improves eligibility.");
        } else {
            setTip("Your profile looks stable. Review inputs for accuracy.");
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'High': return '#10b981'; // Green
            case 'Medium': return '#f59e0b'; // Amber
            case 'Low': return '#ef4444'; // Red
            default: return '#6b7280'; // Grey
        }
    };

    return (
        <div className="preview-card">
            <h3 className="preview-title">Eligibility Preview</h3>

            {status === 'Updating' ? (
                <div className="preview-updating">
                    <div className="spinner"></div> Updating...
                </div>
            ) : status === 'Incomplete' ? (
                <div className="preview-incomplete">
                    <p>Fill in following to see preview:</p>
                    <ul>
                        {missingFields.includes('person_income') && <li>Annual Income</li>}
                        {missingFields.includes('credit_score') && <li>Credit Score</li>}
                        {missingFields.includes('cb_person_cred_hist_length') && <li>Credit History</li>}
                        {missingFields.includes('person_emp_exp') && <li>Work Experience</li>}
                    </ul>
                </div>
            ) : (
                <div className="preview-result">
                    <div className="status-badge" style={{ backgroundColor: getStatusColor() }}>
                        {status} Chance
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${probability}%`, backgroundColor: getStatusColor() }}></div>
                    </div>
                    <p className="prob-text">{probability}% Probability</p>
                    <div className="preview-tip">
                        <strong>Tip:</strong> {tip}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EligibilityPreviewCard;
