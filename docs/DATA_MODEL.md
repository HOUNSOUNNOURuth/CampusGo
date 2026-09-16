# Modèle de données — CampusGo (Supabase / Postgres)

Référence complète : `supabase/migrations/0001_init.sql` (source de vérité,
exécutable). Ce document explique le "pourquoi" de chaque table.

## Schéma relationnel (simplifié)

```
auth.users (géré par Supabase Auth)
   │ 1-1
   ▼
profiles ──────────────────────────────────────────┐
   │                                                │
   │ 1-N                                            │ 1-N
   ▼                                                ▼
search_history                                  user_packs ── N-1 ──► packs
   │ N-1                                             ▲
   ▼                                                  │ 1-N
campus_locations                                  payments
```

## Tables

### `profiles`
Étend `auth.users` (qui ne contient que email/mot de passe) avec les infos
utiles à l'app : nom complet, langue préférée, et **compteur de recherches
gratuites déjà utilisées** (`free_searches_used`). Un profil est créé
automatiquement à l'inscription via un trigger Postgres
(`handle_new_user`) — l'équipe n'a rien à faire manuellement pour ça.

### `campus_locations`
Tous les lieux affichables/guidables du campus (facultés, bibliothèque,
restaurant, amphis...). Le champ `is_landmark` marque les lieux utilisables
comme **repères intermédiaires** sur un trajet (ex : Bibliothèque Centrale,
Amphi 1000) — voir `pickLandmarks()` dans la maquette. `photo_url` pointera
vers une image dans Supabase Storage (bucket `location-photos`, à créer),
utilisée par `PhotoCard.jsx`.

### `packs`
Catalogue des offres (lecture publique, pour afficher les tarifs même sans
compte). Deux familles de packs :
- **à crédits** (`search_credits` rempli, `duration_days` = null) : ex. Pack
  Étudiant, 3 recherches, pas de limite de temps.
- **à durée** (`duration_days` rempli, `search_credits` = null) : ex. Pack
  Semaine, recherches illimitées pendant 7 jours.

### `user_packs`
Les packs réellement possédés par un utilisateur, créés uniquement par la
Edge Function `chariow-webhook` après confirmation de paiement (jamais
directement par le frontend — d'où l'absence de policy RLS `insert` côté
client). `searches_remaining` se décrémente à chaque recherche pour les
packs à crédits.

### `payments`
Trace chaque tentative de paiement Chariow, même échouée. `chariow_reference`
permet de faire le lien entre notre ligne et la transaction côté Chariow.
`raw_webhook_payload` garde le JSON brut reçu, utile pour déboguer un litige.

### `search_history`
Une ligne par itinéraire demandé (utilisée par le tableau de bord). Le nom
de la destination est **dupliqué** (`destination_name`) en plus de la
référence (`destination_id`) pour garder l'historique lisible même si un
lieu est renommé/supprimé plus tard.

## Logique métier à connaître

**Quand une recherche est-elle "gratuite" vs "payante" ?**
1. Avant de lancer un itinéraire, vérifier `profiles.free_searches_used < 2`.
2. Si oui → autoriser, puis incrémenter `free_searches_used`.
3. Si non → vérifier s'il existe un `user_packs` actif avec
   `searches_remaining > 0` (ou `expires_at > now()` pour un pack à durée).
4. Si aucun des deux → ouvrir `<PaywallModal />`.

Cette logique doit vivre côté serveur autant que possible (ou au moins être
revérifiée côté serveur avant d'écrire dans `search_history`), pour éviter
qu'un utilisateur ne contourne la limite en modifiant le code frontend.
Une option robuste : passer cette vérification dans une Edge Function ou une
fonction Postgres (`can_user_search(uid)`) appelée avant chaque recherche.

## RLS — résumé des règles d'accès

| Table              | Lecture                        | Écriture                          |
|---------------------|---------------------------------|-------------------------------------|
| `profiles`           | son propre profil uniquement   | son propre profil uniquement        |
| `campus_locations`   | publique                       | admin uniquement (dashboard Supabase)|
| `packs`               | publique                       | admin uniquement                    |
| `user_packs`          | ses propres packs              | Edge Function (service_role) seulement |
| `payments`             | ses propres paiements         | Edge Function (service_role) seulement |
| `search_history`       | son propre historique         | son propre historique (insert)      |
