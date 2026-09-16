import { createContext, useContext, useState } from 'react';
import fr from './fr.json';
import en from './en.json';

// TODO (Personne C) : compléter fr.json / en.json avec TOUTES les clés déjà
// présentes dans campusgo-maquette.html (dictionnaire `dict` du fichier JS) —
// c'est la source de vérité la plus complète pour les textes déjà validés.

const dictionaries = { fr, en };
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const t = (key) => dictionaries[lang][key] ?? key;
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit être utilisé sous <I18nProvider>');
  return ctx;
}
