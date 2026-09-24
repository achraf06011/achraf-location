# Atlas Drive — location de voitures à Marrakech

Next.js 16 · TypeScript · Tailwind v4 · Framer Motion · Zustand · Supabase

```bash
npm install
npm run dev   # http://localhost:3000
```

## Réservations et espace administrateur

1. Le client envoie sa demande depuis `/reservation`. Elle est enregistrée avec le statut
   **En attente de vérification**, et le véhicule est bloqué aussitôt sur ces dates.
2. L'administrateur se connecte sur `/admin` (mot de passe `ADMIN_PASSWORD`), voit le nom,
   le téléphone (bouton « Appeler »), le véhicule, les dates, le lieu de prise en charge et les options.
3. Après l'appel, il clique sur :
   - **Client vérifié — Valider** : la réservation passe en *Confirmée* ;
   - **Arnaque — Remettre le véhicule disponible** : la réservation passe en *Refusée*
     et le véhicule redevient réservable sur ces dates.
4. Un même numéro ne peut pas envoyer plus de **5 demandes par jour** (heure du Maroc, tous formats
   de numéro confondus : `06…`, `+212 6…`, `00212 6…`). Au-delà, le client est invité à appeler le
   **+212 (0) 697-601775**.

Le client voit l'état de sa demande (en attente / confirmée / refusée) sur la page de confirmation
et dans son espace client.

### Configuration

| Variable | Rôle |
| --- | --- |
| `ADMIN_PASSWORD` | Mot de passe de `/admin/login` |
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (clé *service_role*, jamais côté client) |

1. Créez un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans **SQL Editor**, exécutez le contenu de [`supabase/schema.sql`](supabase/schema.sql).
   Une contrainte empêche deux réservations actives de se chevaucher sur un même véhicule.
3. Ajoutez les trois variables dans Vercel (**Settings → Environment Variables**), puis redéployez.

En local, sans Supabase, les réservations sont stockées dans `.data/reservations.json`
(il suffit de définir `ADMIN_PASSWORD` dans `.env.local`). Ce mode de secours est désactivé sur
Vercel, où la base Supabase est obligatoire.
