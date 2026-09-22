import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../i18n/I18nContext.jsx';
import LangToggle from '../ui/LangToggle.jsx';

const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { t } = useI18n();

  return (
    <header className="topnav">
      <div className="wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="6.5" r="2.4" />
              <path d="M5.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6" />
              <rect x="14" y="7.2" width="4.4" height="6.8" rx="1.1" transform="rotate(18 14 7.2)" fill="#FFFFFF" stroke="none" />
            </svg>
          </span>
          CampusGo
        </Link>

        <nav className="navlinks">
          <NavLink to="/" end className={linkClass}>{t('nav.home')}</NavLink>
          <NavLink to="/itineraire" className={linkClass}>{t('nav.app')}</NavLink>
          <NavLink to="/tableau-de-bord" className={linkClass}>{t('nav.dashboard')}</NavLink>
        </nav>

        <div className="navright">
          <LangToggle />
          {user ? (
            <button className="btn btn-ghost" onClick={signOut}>Déconnexion</button>
          ) : (
            <Link to="/connexion" className="btn btn-primary">{t('nav.login')}</Link>
          )}
        </div>
      </div>
    </header>
  );
}
