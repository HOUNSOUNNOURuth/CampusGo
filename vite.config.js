import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CampusGo — configuration Vite
// Le serveur dev tourne par défaut sur http://localhost:5173
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
