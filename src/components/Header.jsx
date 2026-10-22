import React from 'react';
import { Info } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo-icon">Δ</div>
        <h1>StackVision</h1>
      </div>
      <div className="header-actions">
        <button className="icon-btn" title="About">
          <Info size={20} />
        </button>
      </div>
    </header>
  );
}
