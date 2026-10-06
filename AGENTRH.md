# AgentRH · Espace conformité

Ce dépôt est une version modifiée du logiciel PIA de la CNIL
([LINCnil/pia](https://github.com/LINCnil/pia), licence GPLv3), adaptée par AgentRH
en octobre 2026 à partir de la version 4.1.0.

Il sert à partager avec le DPO de chaque client l'analyse d'impact (AIPD) relative
au service AgentRH : AgentRH pré-remplit, le client complète, évalue et valide.

La CNIL n'est ni l'éditeur ni le garant de cette version.

## Ce qui a été modifié par rapport à l'outil CNIL

| Sujet | Fichiers |
| --- | --- |
| Couleurs de la charte | `src/assets/stylesheets/_variables.scss` |
| Police Inter, fond de la page de connexion | `src/assets/stylesheets/_agentrh.scss`, `src/styles.scss` |
| Logos, favicons, planche d'icônes | `src/assets/images/`, `src/favicon.ico` |
| Vert réservé aux statuts (validé, jauges) | `$pia-valid` dans quelques fichiers `.scss` |
| Connexion préconfigurée par client | `src/environments/instance.ts`, `src/main.ts`, `scripts/write-instance-config.js` |
| Nom du client, contact de support | en-tête et page d'accueil (`header`, `home`) |
| Page À propos (mention de modification, attribution) | `src/app/modules/settings/about/` |
| Textes d'accueil en français et en anglais | `src/assets/i18n/fr.json`, `en.json` |
| Déploiement | `vercel.json` |

Les noms de variables et de classes d'origine sont conservés, pour que les mises à
jour de la CNIL se fusionnent sans peine.

## Règle d'architecture : une instance par client

Le back (`pia-back`) ne cloisonne pas les données entre organisations. Chaque client
a donc son propre back, sa propre base de données et son propre projet Vercel.
Ne jamais inviter deux clients sur la même instance.

## Déployer le front d'un client sur Vercel

Créer un projet Vercel par client à partir de ce dépôt, puis définir ces variables
d'environnement :

| Variable | Rôle | Exemple |
| --- | --- | --- |
| `ENABLE_EXPERIMENTAL_COREPACK` | active Yarn 4 sur Vercel (obligatoire) | `1` |
| `PIA_CLIENT_NAME` | nom du client affiché | `Argos Vétérinaire` |
| `PIA_SERVER_URL` | URL publique du back, en https | `https://api.exemple.fr` |
| `PIA_CLIENT_ID` | UID de l'application OAuth créée dans le back | |
| `PIA_CLIENT_SECRET` | secret de cette application | |
| `PIA_SUPPORT_EMAIL` | contact affiché dans le menu Aide | |
| `PIA_SOURCE_URL` | adresse publique de ce dépôt (page À propos) | |

Les commandes d'installation et de build sont dans `vercel.json`, il n'y a rien à
régler dans l'interface Vercel. Sans `PIA_SERVER_URL`, l'application démarre en mode
local, comme l'outil d'origine.

Côté back, penser à autoriser le domaine du front dans `ALLOWED_CORS_ORIGINS`.

À savoir : `PIA_CLIENT_ID` et `PIA_CLIENT_SECRET` sont embarqués dans le JavaScript
servi au navigateur. C'est déjà le cas dans l'outil d'origine, où ils sont saisis
puis stockés dans le navigateur. Ils identifient l'application, pas l'utilisateur :
l'accès reste protégé par l'email et le mot de passe de chaque compte.

## Récupérer les mises à jour de la CNIL

```
git remote add upstream https://github.com/LINCnil/pia.git
git fetch upstream
git merge upstream/master
```

Les conflits possibles se limitent aux fichiers listés plus haut.

## Licence

GPLv3, comme le logiciel d'origine (voir `LICENSE`). Le code source de cette version
doit rester accessible aux personnes qui l'utilisent : garder ce dépôt public et
renseigner `PIA_SOURCE_URL`.
