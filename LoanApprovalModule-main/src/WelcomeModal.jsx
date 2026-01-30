
import React, { useState, useEffect } from 'react';
import './WelcomeModal.css';

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('loan_app_visited');
        if (!hasVisited) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        sessionStorage.setItem('loan_app_visited', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Welcome to Loan Predictor</h2>
                    <button className="close-btn" onClick={handleClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <p>
                        Hello! This application helps you estimate your eligiblity for a loan.
                    </p>
                    <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', color: '#4b5563' }}>
                        <li>Enter your personal details.</li>
                        <li>Provide financial information.</li>
                        <li>Get an instant prediction!</li>
                    </ul>
                    <p>This is a demonstration tool using Machine Learning.</p>
                </div>
                <div className="modal-footer">
                    <button className="primary-btn" onClick={handleClose}>Get Started</button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
