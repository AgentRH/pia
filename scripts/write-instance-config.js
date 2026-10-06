#!/usr/bin/env node
/*
 * AgentRH · écrit src/environments/instance.ts à partir de l'environnement.
 *
 * Variables lues (à définir dans le projet Vercel du client) :
 *   PIA_CLIENT_NAME     nom du client affiché (ex. "Argos Vétérinaire")
 *   PIA_SERVER_URL      URL publique du back (ex. "https://api-argos.example.fr")
 *   PIA_CLIENT_ID       UID de l'application OAuth créée dans le back
 *   PIA_CLIENT_SECRET   secret de cette application
 *   PIA_SUPPORT_EMAIL   contact affiché dans le menu Aide
 *   PIA_SOURCE_URL      dépôt public du code de cette version (page À propos)
 *
 * Sans PIA_SERVER_URL, le fichier n'est pas modifié (build local, mode autonome).
 *
 * Note : dans une application web, client id et client secret sont visibles
 * du navigateur. C'est déjà le cas dans le logiciel d'origine (ils sont saisis
 * à la main puis stockés dans le navigateur). Ils identifient l'application,
 * pas l'utilisateur : l'accès reste protégé par l'email et le mot de passe.
 */
const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'src', 'environments', 'instance.ts');
const env = process.env;
const serverUrl = (env.PIA_SERVER_URL || '').trim().replace(/\/+$/, '');

if (!serverUrl) {
  console.log('[instance] PIA_SERVER_URL absent : configuration inchangée.');
  process.exit(0);
}

const missing = ['PIA_CLIENT_ID', 'PIA_CLIENT_SECRET'].filter(
  k => !(env[k] || '').trim()
);
if (missing.length) {
  console.error('[instance] Variables manquantes : ' + missing.join(', '));
  process.exit(1);
}
if (!/^https:\/\//.test(serverUrl) && !/^http:\/\/localhost/.test(serverUrl)) {
  console.error('[instance] PIA_SERVER_URL doit commencer par https://');
  process.exit(1);
}

const config = {
  clientName: (env.PIA_CLIENT_NAME || '').trim(),
  serverUrl,
  clientId: env.PIA_CLIENT_ID.trim(),
  clientSecret: env.PIA_CLIENT_SECRET.trim(),
  supportEmail: (env.PIA_SUPPORT_EMAIL || '').trim(),
  sourceUrl: (env.PIA_SOURCE_URL || '').trim()
};

const content =
  '// Fichier généré par scripts/write-instance-config.js. Ne pas modifier.\n' +
  'export const instance = ' +
  JSON.stringify(config, null, 2) +
  ';\n';

fs.writeFileSync(target, content, 'utf8');
console.log(
  '[instance] Instance configurée pour ' +
    (config.clientName || '(sans nom)') +
    ' -> ' +
    config.serverUrl
);
