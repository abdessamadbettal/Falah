export const qibla = {
  meta: {
    title: "Boussole de Qibla — direction vers la Kaaba avec boussole en direct",
    description:
      "Trouvez la direction de la Qibla depuis n'importe quelle ville : le cap exact depuis le nord géographique, la distance jusqu'à la Kaaba à la Mecque, et une boussole en direct sur les téléphones compatibles. Privé — calculé sur votre appareil.",
  },
  title: "Boussole de Qibla",
  side: "اتجاه القبلة",
  intro:
    "Le cap (grand cercle) de votre position jusqu'à la Kaaba à la Mecque, calculé localement. Sur les téléphones équipés d'une boussole, l'aiguille tourne en direct lorsque vous pivotez.",
  yourLocation: "Votre position",
  enableCompass: "Activer la boussole en direct",
  compassActive: "Boussole active",
  noCompass: "Aucun capteur de boussole détecté — utilisez le cap depuis le nord géographique.",
  fromNorth: "depuis le nord géographique",
  toQibla: "vers la Qibla",
  needleLive: "L'aiguille est active — elle pointe vers la Qibla lorsque vous tournez.",
  faceNorth: "Faites face au nord géographique, puis tournez de l'angle indiqué.",
  distance: (km: string) => `Distance jusqu'à la Kaaba : ${km} km.`,
  prompt: "Recherchez votre ville ou utilisez votre position pour trouver la Qibla.",
  guideEyebrow: "Étape par étape",
  guideH2: "Comment trouver la Qibla",
  guide: [
    {
      icon: "ph:map-pin",
      title: "Définissez votre position",
      body: "Recherchez votre ville ou touchez « Utiliser ma position ». La Qibla est la direction (grand cercle) de cet endroit vers la Kaaba à la Mecque.",
    },
    {
      icon: "ph:compass-rose",
      title: "Activez la boussole en direct",
      body: "Sur un téléphone, touchez « Activer la boussole en direct » et autorisez l'accès aux mouvements. L'aiguille tourne alors lorsque vous pivotez, pointant directement vers la Qibla.",
    },
    {
      icon: "ph:arrows-clockwise",
      title: "Calibrez pour plus de précision",
      body: "Si l'aiguille dévie, agitez votre téléphone en forme de 8 quelques fois et éloignez-vous des aimants, haut-parleurs, ordinateurs portables et bureaux en métal.",
    },
    {
      icon: "ph:navigation-arrow",
      title: "Pas de boussole ? Utilisez l'angle",
      body: "Sur un ordinateur portable ou un téléphone sans boussole, faites face au nord géographique et tournez des degrés indiqués pour faire face à la Qibla.",
    },
  ],
  faqEyebrow: "FAQ sur la Qibla",
  faqH2: "À propos de la direction de la Qibla",
  faq: [
    {
      q: "Qu'est-ce que la Qibla ?",
      a: "La Qibla est la direction vers laquelle les musulmans se tournent en prière — vers la Kaaba dans la Mosquée Sacrée (Masjid al-Haram) à la Mecque.",
    },
    {
      q: "Quelle est la précision de la boussole de la Qibla ?",
      a: "Le cap est calculé précisément à partir de vos coordonnées vers la Kaaba. La précision de la boussole en direct dépend du magnétomètre de votre téléphone, calibrez-le donc pour un meilleur résultat.",
    },
    {
      q: "Pourquoi l'aiguille pointe-t-elle dans la mauvaise direction ?",
      a: "Les boussoles des téléphones lisent le nord magnétique et sont facilement perturbées par le métal, les aimants ou l'électronique à proximité. Recalibrez avec un mouvement en forme de 8, loin de toute interférence.",
    },
    {
      q: "La boussole de la Qibla fonctionne-t-elle sur un ordinateur portable ?",
      a: "Oui, bien que la plupart des ordinateurs portables n'aient pas de boussole. Elle indique le cap exact depuis le nord géographique, vous pouvez donc vous aligner en utilisant une boussole physique ou une carte.",
    },
    {
      q: "Ma position est-elle privée ?",
      a: "La direction de la Qibla est calculée sur votre appareil. Si vous utilisez la recherche de ville, seul le nom de la ville est envoyé pour trouver ses coordonnées — votre position GPS précise n'est jamais téléchargée.",
    },
  ],
};
