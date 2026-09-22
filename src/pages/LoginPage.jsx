import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n/I18nContext.jsx';

const tabClass = ({ isActive }) => (isActive ? 'active' : undefined);

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const { error } = await signIn({ email, password });
    if (error) { setError(error.message); return; }
    navigate('/itineraire');
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-tabs">
          <NavLink to="/connexion" className={tabClass}>{t('auth.tab.login')}</NavLink>
          <NavLink to="/inscription" className={tabClass}>{t('auth.tab.signup')}</NavLink>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="login-email">{t('auth.email')}</label>
            <input
              id="login-email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="field">
            <label htmlFor="login-password">{t('auth.password')}</label>
            <input
              id="login-password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          {error && <p role="alert" style={{ color: 'var(--clay)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-block">{t('auth.loginbtn')}</button>
        </form>

        <div className="auth-foot">
          {t('auth.noaccount')}{' '}
          <NavLink to="/inscription">{t('auth.tab.signup')}</NavLink>
        </div>
      </div>
    </div>
  );
}
