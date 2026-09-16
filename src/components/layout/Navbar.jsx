import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../i18n/I18nContext.jsx';
import LangToggle from '../ui/LangToggle.jsx';

// TODO (Personne C) : reprendre le style exact de la navbar de la maquette.
export default function Navbar() {
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  return (
    <header>
      <Link to="/">CampusGo</Link>
      <nav>
        <Link to="/">{t('nav.home')}</Link>
        <Link to="/itineraire">{t('nav.app')}</Link>
        <Link to="/tableau-de-bord">{t('nav.dashboard')}</Link>
      </nav>
      <LangToggle />
      {user ? <button onClick={signOut}>Déconnexion</button> : <Link to="/connexion">{t('nav.login')}</Link>}
    </header>
  );
}
