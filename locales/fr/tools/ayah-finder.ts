import type { ayahFinder as en } from "../../en/tools/ayah-finder";

export const ayahFinder: typeof en = {
  meta: {
    title: "Ayah Finder — Trouvez n'importe quel verset coranique par texte ou par voix",
    description:
      "Recherchez l'ensemble des 6 236 versets du Coran en tapant ou en prononçant un texte arabe, puis accédez directement au verset dans le lecteur.",
  },
  title: "Ayah Finder",
  side: "باحث الآيات",
  intro:
    "Recherchez n'importe quel verset du Coran en tapant ou en parlant en arabe, puis lisez-le dans le lecteur complet.",
  mic: "Commencer l'écoute",
  listening: "Écoute en cours…",
  unsupported: "Saisie vocale non prise en charge",
  micError: "La saisie vocale a échoué. Vérifiez votre microphone et votre autorisation, puis réessayez.",
  micPermission: "L'accès au microphone a été refusé. Autorisez le microphone pour ce site dans votre navigateur.",
  micNoDevice: "Aucun microphone trouvé. Vérifiez les paramètres audio de votre système.",
  micNetwork: "Impossible de joindre le service de reconnaissance vocale. Vérifiez votre connexion Internet et désactivez les bloqueurs de publicité pour ce site, puis réessayez.",
  micInsecure: "La saisie vocale nécessite une connexion sécurisée. Ouvrez l'application sur localhost ou en HTTPS.",
  placeholder: "Saisissez un texte arabe, ex. «الرحمن»",
  results: (n: number) => (n === 1 ? "1 résultat" : `${n} résultats`),
  noResults: "Aucun verset correspondant. Essayez une autre expression.",
  confidence: "Confiance",
  ayah: "Verset",
  loading: "Recherche…",
  error: "Impossible de rechercher. Vérifiez votre connexion et réessayez.",
  read: "Lire",
  privacy:
    "Votre recherche s'exécute entièrement dans votre navigateur — votre requête, votre voix et l'index ne quittent jamais votre appareil.",
  emptyTip: "Saisissez ou prononcez quelques mots arabes pour trouver un verset correspondant.",
};
