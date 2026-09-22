import { useI18n } from '../../i18n/I18nContext.jsx';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer>
      <div className="wrap">
        <span className="fdim">{t('footer.text')}</span>
      </div>
    </footer>
  );
}
