// src/components/CircularProgressBar.jsx
import React from 'react';

function CircularProgressBar({ percentage, size = 100, strokeWidth = 10, circleColor = '#404058', progressColor = '#00f5a0' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress-container" style={{ width: size, height: size }}>
      <svg
        className="circular-progress-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="circular-progress-bg"
          stroke={circleColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        {/* Progress circle */}
        <circle
          className="circular-progress-fill"
          stroke={progressColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} /* Start from top */
          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        />
      </svg>
      <div className="circular-progress-text">
        {`${Math.round(percentage)}%`}
      </div>
    </div>
  );
}

export default CircularProgressBar;