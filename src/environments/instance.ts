// -----------------------------------------------------------------------------
// AgentRH · configuration de l'instance (une instance = un client)
//
// Ce fichier est réécrit au moment du build par scripts/write-instance-config.js
// à partir des variables d'environnement PIA_* (voir ce script).
// Laissé vide, l'application se comporte comme le logiciel d'origine : mode
// local sans serveur, ou saisie manuelle dans Paramètres > URL du serveur.
// -----------------------------------------------------------------------------
export const instance = {
  // Nom du client affiché dans l'en-tête et sur la page de connexion
  clientName: '',
  // URL publique du back (pia-back), sans barre oblique finale
  serverUrl: '',
  // Identifiants de l'application OAuth (Doorkeeper) créée dans le back
  clientId: '',
  clientSecret: '',
  // Adresse de contact affichée dans le menu Aide
  supportEmail: '',
  // Dépôt public du code source de cette version (mention GPLv3, page À propos)
  sourceUrl: ''
};
