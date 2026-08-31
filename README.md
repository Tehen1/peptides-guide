# peptides-guide

Comparateur peptides FR/UE indépendant — scores basés sur les preuves labo (COA), pas le marketing.

## Structure

- `apps/web` — Next.js 15 (App Router, React 19, Tailwind v4, TS strict)
- `packages/shared` — types `Vendor`, grille de scoring, données normalisées (`vendors.json`)
- `packages/scrapers` — normalisation CSV (PeptideScores, PeptideSupermarket) vers JSON unifié
- `data/raw` — CSV d'entrée (fixtures incluses pour les tests)

## Quickstart

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
```

Après le premier `pnpm install`, committer `pnpm-lock.yaml` puis passer la CI sur `--frozen-lockfile`.

## Pipeline données

```bash
pnpm scrape
```

Priorité de fusion : `manual` > `peptidescores` > `peptidesupermarket`. Les données CSV invalides sont signalées sans interrompre le pipeline.

## Sécurité des données

- Les URLs officielles et liens affiliés sont volontairement `null` jusqu'à vérification manuelle.
- Les coupons observés doivent être vérifiés avant publication.
- `shipsTo`, paiements, délais et accès COA sont des données à confirmer par vendor.

## Déploiement

- Web : Vercel (`apps/web`)
- Tracking : Cloudflare Worker `go.peptides-guide.fr/out/{slug}` avec redirection 302.
- Liens affiliés : `rel="sponsored"` + disclosure obligatoire.
