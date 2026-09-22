// TODO (Personne A) : brancher les vraies stats (recherches ce mois, pack actif,
// destination la plus visitée) une fois leur source de données disponible —
// pour l'instant seul l'historique (useSearchHistory) a des données réelles.
import { useSearchHistory } from '../hooks/useSearchHistory';
import HistoryTable from '../components/dashboard/HistoryTable.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function DashboardPage() {
  const { history, loading } = useSearchHistory();
  const { t } = useI18n();

  return (
    <div className="wrap">
      <div className="dash-head">
        <h1>{t('dash.history')}</h1>
      </div>

      <div className="panel" style={{ padding: 22 }}>
        {loading ? (
          <p style={{ color: 'var(--ink-soft)' }}>…</p>
        ) : history?.length ? (
          <HistoryTable history={history} />
        ) : (
          <div className="empty-state">{t('app.guide.empty')}</div>
        )}
      </div>
    </div>
  );
}
