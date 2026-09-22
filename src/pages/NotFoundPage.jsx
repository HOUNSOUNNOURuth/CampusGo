import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="auth-wrap">
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 40, marginBottom: 12 }}>404</h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>Page introuvable.</p>
        <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
