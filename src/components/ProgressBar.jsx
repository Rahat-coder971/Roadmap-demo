// src/components/ProgressBar.jsx
import React from 'react';

// Receives a 'percentage' prop (0-100)
function ProgressBar({ percentage }) {
  // Ensure percentage is within bounds
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="progress-bar-container" title={`${clampedPercentage.toFixed(0)}% Complete`}>
      <div
        className="progress-bar-fill"
        style={{ width: `${clampedPercentage}%` }}
      ></div>
      <span className="progress-bar-text">{clampedPercentage.toFixed(0)}%</span>
    </div>
  );
}

export default ProgressBar;