import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n/I18nContext.jsx';

const tabClass = ({ isActive }) => (isActive ? 'active' : undefined);

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const { error } = await signUp({ email, password, fullName });
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
            <label htmlFor="signup-name">{t('auth.name')}</label>
            <input
              id="signup-name" value={fullName}
              onChange={(e) => setFullName(e.target.value)} required
            />
          </div>
          <div className="field">
            <label htmlFor="signup-email">{t('auth.email')}</label>
            <input
              id="signup-email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
            />
          </div>
          <div className="field">
            <label htmlFor="signup-password">{t('auth.password')}</label>
            <input
              id="signup-password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          {error && <p role="alert" style={{ color: 'var(--clay)', fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-block">{t('auth.signupbtn')}</button>
        </form>

        <div className="auth-foot">
          {t('auth.hasaccount')}{' '}
          <NavLink to="/connexion">{t('auth.tab.login')}</NavLink>
        </div>
      </div>
    </div>
  );
}
