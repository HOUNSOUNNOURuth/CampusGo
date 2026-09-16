import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import SignupPage from '../pages/SignupPage.jsx';
import ItineraryPage from '../pages/ItineraryPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
// TODO (Personne A) : ajouter un <ProtectedRoute> qui redirige vers /connexion
// si !user, à utiliser autour de /itineraire et /tableau-de-bord.

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<SignupPage />} />
      <Route path="/itineraire" element={<ItineraryPage />} />
      <Route path="/tableau-de-bord" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
