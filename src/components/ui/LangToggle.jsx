import { useI18n } from '../../i18n/I18nContext.jsx';

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="langtoggle">
      <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')}>FR</button>
      <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
    </div>
  );
}
