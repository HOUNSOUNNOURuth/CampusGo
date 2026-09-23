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
          <svg className="brand-mark" viewBox="0 0 64 56" fill="none" stroke="var(--green)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="15" cy="9" r="5" />
            <path d="M15 16 C12 22, 19 24, 17 31" />
            <path d="M17 31 L9 44" />
            <path d="M17 31 L27 40 L33 51" />
            <path d="M16 19 L27 14 L36 19" />
            <path d="M15 20 L5 24" />
            <rect x="34" y="4" width="15" height="22" rx="3.5" transform="rotate(14 34 4)" />
            <path d="M39.5 14.5 L45.5 11.5 L45.5 17.5 Z" fill="var(--green)" stroke="none" />
          </svg>
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
