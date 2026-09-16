import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
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

  // TODO (Personne C) : reprendre le style de la carte de connexion de la maquette
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Se connecter</button>
    </form>
  );
}
