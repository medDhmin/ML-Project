
import React, { useState } from 'react';
import './InfoTooltip.css';

const InfoTooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span
            className="info-tooltip-container"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)} /* Mobile support */
            role="button"
            tabIndex="0"
            aria-label="More information"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="info-icon"
            >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            {isVisible && <div className="tooltip-bubble">{text}</div>}
        </span>
    );
};

export default InfoTooltip;
