import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/routePaths';
import { Button } from '../../components/common/Button';
import { LockIcon } from '../../assets/icons';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(ROUTES.ADMIN.DASHBOARD);
    } catch (err: any) {
      if (err.status === 429 || err.code === 'RATE_LIMIT_EXCEEDED') {
        setError('Login rate limit exceeded. Too many attempts. Please pause for 15 minutes.');
      } else {
        setError(err.message || 'Invalid administrative credentials for atelier suite access.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#07080a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="atelier-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '3rem 2.5rem',
          backgroundColor: '#0c0d12',
          border: '1px solid var(--color-gold-primary)',
          boxShadow: 'var(--shadow-gold)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img
            src="/images/logo.svg"
            alt="AURÉLIEN"
            style={{ height: '42px', marginBottom: '1rem' }}
            onError={(e) => {
              // Graceful fallback if image unavailable
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.1em' }}>ATELIER SUITE LOGIN</h2>
          <p style={{ color: 'var(--color-champagne-muted)', fontSize: '0.8rem', marginTop: '0.35rem' }}>
            Authorized Boutique Managers & Gemologists
          </p>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.825rem',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="admin-email-input"
              style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}
            >
              Staff Email Address
            </label>
            <input
              id="admin-email-input"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="admin@aurelien.gold"
              required
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="admin-password-input"
              style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-champagne-muted)', marginBottom: '0.4rem' }}
            >
              Vault Passcode
            </label>
            <input
              id="admin-password-input"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            icon={<LockIcon width="16" height="16" />}
            style={{ width: '100%' }}
          >
            {loading ? 'Authenticating...' : 'Enter Atelier Suite'}
          </Button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@aurelien.gold');
                setPassword('AdminPassword123!');
                setError(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#D6AE67',
                fontSize: '0.78rem',
                textDecoration: 'underline',
                cursor: 'pointer',
                letterSpacing: '0.04em',
                padding: '0.25rem',
              }}
            >
              Autofill Staff Credentials
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-obsidian-border)',
            fontSize: '0.75rem',
            color: 'var(--color-champagne-muted)',
            textAlign: 'center',
          }}
        >
          <span>AURÉLIEN Haute Joaillerie • Access strictly restricted to authenticated personnel</span>
        </div>
      </div>
    </div>
  );
};
