import React from 'react';

interface Props {
  onSuccess: () => void;
}

const LoginScreen: React.FC<Props> = ({ onSuccess }) => {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [shaking, setShaking] = React.useState(false);

  const correctPassword = import.meta.env.VITE_APP_PASSWORD as string;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setPassword('');
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="login-root">
      <div className={`login-card ${shaking ? 'shake' : ''}`}>
        {/* Icon */}
        <div className="login-icon">
          <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="4" y="8" width="36" height="32" rx="6" fill="url(#lgCalGrad)" opacity="0.15" />
            <rect x="4" y="8" width="36" height="32" rx="6" stroke="url(#lgCalGrad)" strokeWidth="2" />
            <rect x="4" y="8" width="36" height="10" rx="6" fill="url(#lgCalGrad)" />
            <rect x="4" y="14" width="36" height="4" fill="url(#lgCalGrad)" />
            <line x1="14" y1="4" x2="14" y2="12" stroke="url(#lgCalGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="30" y1="4" x2="30" y2="12" stroke="url(#lgCalGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M14 27l5.5 5.5L30 21" stroke="url(#lgCheckGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="lgCalGrad" x1="4" y1="4" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4f8cff" />
                <stop offset="1" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="lgCheckGrad" x1="14" y1="21" x2="30" y2="33" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22c55e" />
                <stop offset="1" stopColor="#4ade80" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="login-title">Próxima Folga</h1>
        <p className="login-subtitle">Calculadora de escala</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="login-password">Senha de acesso</label>
            <input
              id="login-password"
              type="password"
              className={`styled-input ${error ? 'input-error' : ''}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
              autoComplete="current-password"
            />
            {error && <span className="login-error">Senha incorreta. Tente novamente.</span>}
          </div>

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
