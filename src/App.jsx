import AppRouter from './routes/AppRouter.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}
