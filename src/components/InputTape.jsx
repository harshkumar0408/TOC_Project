import React from 'react';

export default function InputTape({ inputString, currentConfig }) {
  if (!inputString && !currentConfig) return <div className="input-tape-empty">No input provided</div>;

  const originalInput = inputString || "";
  const unreadInput = currentConfig ? currentConfig.unreadInput : originalInput;
  
  // Calculate how many characters have been consumed
  const consumedLength = originalInput.length - unreadInput.length;

  return (
    <div className="tape-container">
      <h3>Input Tape</h3>
      <div className="tape">
        {originalInput.split('').map((char, index) => {
          let statusClass = "cell-future";
          if (index < consumedLength) statusClass = "cell-consumed";
          else if (index === consumedLength) statusClass = "cell-active";

          return (
            <div key={index} className={`tape-cell ${statusClass}`}>
              {char}
            </div>
          );
        })}
        {/* End marker visible only when string is fully read */}
        <div className={`tape-cell end-marker ${consumedLength === originalInput.length ? 'cell-active' : ''}`}>
          ε
        </div>
      </div>
    </div>
  );
}
