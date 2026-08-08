export const mosque = {
  meta: {
    title: "Recherche de Mosquées — mosquées à proximité sur une carte en direct",
    description:
      "Trouvez des mosquées et des salles de prière près de chez vous sur une carte interactive utilisant les données communautaires d'OpenStreetMap, avec des itinéraires en un clic. Gratuit et privé — votre position est utilisée une fois et jamais stockée.",
  },
  title: "Recherche de Mosquées",
  side: "أقرب مسجد",
  intro:
    "Les mosquées à proximité sur une carte interactive, d'après les données communautaires d'OpenStreetMap. Autorisez l'accès à la position — ou recherchez un lieu — et votre position n'est utilisée que pour cette seule recherche, et n'est jamais stockée.",
  radius: "Rayon de recherche",
  find: "Trouver des mosquées",
  searchArea: "Rechercher dans cette zone",
  searching: "Recherche…",
  locationNeeded: "Autorisez l'accès à la position, ou recherchez un lieu, pour voir les mosquées à proximité.",
  resultCount: (n: number) => (n === 1 ? "1 mosquée à proximité" : `${n} mosquées à proximité`),
  errorService: "Le service de carte n'a pas répondu. Réessayez dans un instant.",
  unnamed: "Mosquée sans nom",
  away: (km: string) => `à ${km} km`,
  directions: "Itinéraire",
  osm: "OpenStreetMap",
  noResults: (r: number) =>
    `Aucune mosquée signalée dans un rayon de ${r} km ici. Essayez un rayon plus large — la couverture de la carte communautaire varie selon la région.`,
  faqEyebrow: "FAQ de Recherche de Mosquées",
  faqH2: "Trouver des mosquées près de chez vous",
  faq: [
    {
      q: "Comment fonctionne la recherche de mosquées ?",
      a: "Avec votre permission, il utilise la position de votre appareil pour rechercher dans les données communautaires d'OpenStreetMap les lieux de culte étiquetés comme musulmans dans le rayon choisi, puis les affiche sur la carte.",
    },
    {
      q: "Ma position est-elle stockée ou suivie ?",
      a: "Non. Vos coordonnées sont utilisées pour une seule recherche et ne sont jamais enregistrées. La seule requête effectuée est la demande OpenStreetMap qui renvoie les mosquées à proximité — il n'y a pas de comptes et pas de suivi.",
    },
    {
      q: "Une mosquée près de chez moi est manquante — pourquoi ?",
      a: "OpenStreetMap est édité par la communauté, donc la couverture varie selon la zone. Essayez un rayon plus large et envisagez d'ajouter la mosquée sur openstreetmap.org pour que d'autres puissent la trouver aussi.",
    },
    {
      q: "Comment obtenir l'itinéraire vers une mosquée ?",
      a: "Touchez « Itinéraire » sur n'importe quel résultat pour ouvrir la navigation détaillée vers cette mosquée dans votre application de cartes.",
    },
    {
      q: "Ai-je besoin d'une application ou d'un compte ?",
      a: "Non. L'outil fonctionne entièrement dans votre navigateur — pas d'inscription, pas d'installation, pas de publicités.",
    },
  ],
};
