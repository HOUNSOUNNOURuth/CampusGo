import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
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
    <form onSubmit={handleSubmit}>
      <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Créer mon compte</button>
    </form>
  );
}
