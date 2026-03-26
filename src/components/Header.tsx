import React from 'react';

const Header: React.FC = () => (
  <header className="app-header">
    <div className="header-icon">
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Calendar body */}
        <rect x="4" y="8" width="36" height="32" rx="6" fill="url(#calGrad)" opacity="0.15" />
        <rect x="4" y="8" width="36" height="32" rx="6" stroke="url(#calGrad)" strokeWidth="2" />
        {/* Top bar */}
        <rect x="4" y="8" width="36" height="10" rx="6" fill="url(#calGrad)" />
        <rect x="4" y="14" width="36" height="4" fill="url(#calGrad)" />
        {/* Hooks */}
        <line x1="14" y1="4" x2="14" y2="12" stroke="url(#calGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="30" y1="4" x2="30" y2="12" stroke="url(#calGrad)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Checkmark */}
        <path
          d="M14 27l5.5 5.5L30 21"
          stroke="url(#checkGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="calGrad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f8cff" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="checkGrad" x1="14" y1="21" x2="30" y2="33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22c55e" />
            <stop offset="1" stopColor="#4ade80" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <div className="header-text">
      <h1>Próxima Folga</h1>
      <p>Calculadora de escala</p>
    </div>
  </header>
);

export default Header;
