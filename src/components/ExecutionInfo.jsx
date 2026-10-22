import React from 'react';

export default function ExecutionInfo({ currentConfig, stepIndex, totalSteps, result, hasHistory }) {
  if (!currentConfig) return <div className="execution-info-empty">Ready to execute...</div>;

  const isComplete = stepIndex === totalSteps - 1;
  const isAccepted = result === 'accepted';

  return (
    <div className="execution-info">
      <div className="info-grid">
        <div className="info-box">
          <span className="info-label">Step</span>
          <span className="info-value">{stepIndex} / {totalSteps - 1 > 0 ? totalSteps - 1 : 0}</span>
        </div>
        <div className="info-box">
          <span className="info-label">State</span>
          <span className="info-value highlight">{currentConfig.state}</span>
        </div>
        <div className="info-box">
          <span className="info-label">Top of Stack</span>
          <span className="info-value">
            {currentConfig.stack.length > 0 
              ? currentConfig.stack[currentConfig.stack.length - 1] 
              : "ε (Empty)"}
          </span>
        </div>
        <div className="info-box result-box">
          <span className="info-label">Status</span>
          {isComplete && hasHistory ? (
             <span className={`info-value result ${isAccepted ? 'success' : 'error'}`}>
               {isAccepted ? 'ACCEPTED' : 'REJECTED'}
             </span>
          ) : (
             <span className="info-value running">Running...</span>
          )}
        </div>
      </div>
      
      {currentConfig.transition && (
        <div className="last-transition">
          <strong>Last Action: </strong>
          <code>
            δ({currentConfig.transition.from}, 
            {currentConfig.transition.input === "" ? "ε" : currentConfig.transition.input }, 
            {currentConfig.transition.pop === "" ? "ε" : currentConfig.transition.pop }) → 
            ({currentConfig.transition.to}, 
            {currentConfig.transition.push === "" ? "ε" : currentConfig.transition.push })
          </code>
        </div>
      )}
    </div>
  );
}
