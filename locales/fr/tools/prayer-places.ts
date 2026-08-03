import type { prayerPlaces as en } from "../../en/tools/prayer-places";

/** Espace insécable fine avant le séparateur de milliers, comme l'écrit
 * l'Imprimerie nationale : 3 665 954. */
const num = (n: number) => n.toLocaleString("fr-FR");

export const prayerPlaces: typeof en = {
  hubEyebrow: "Parcourir par lieu",
  hubTitle: "Horaires de prière par pays",
  hubIntro:
    "Tous les pays du monde, avec leur propre tableau d'horaires, la méthode de calcul suivie par leurs mosquées, et une page pour chacune de leurs villes.",
  hubCities: (n) => `${num(n)} ${n === 1 ? "ville" : "villes"}`,

  cityTitle: (city, country) => `Horaires de prière à ${city}, ${country} aujourd'hui`,
  cityH1: (city) => `Horaires de prière à ${city}`,
  cityIntro: (city, country) =>
    `Les horaires des cinq prières quotidiennes aujourd'hui à ${city}, ${country}, calculés d'après la position du soleil aux coordonnées mêmes de la ville et affichés en heure locale. Le compte à rebours vers la prochaine prière s'exécute en direct sur votre appareil.`,
  cityDescription: (label, coords, qibla) =>
    `Horaires de prière pour ${label} (${coords}) : Fajr, Dhuhr, Asr, Maghrib et Isha aujourd'hui en heure locale, le tableau du mois complet et la direction de la qibla — ${qibla}. Gratuit, sans publicité ni suivi.`,
  cityKeywords: (city, country) => [
    `horaire priere ${city}`,
    `heure de priere ${city}`,
    `horaires de prière ${city}`,
    `heure du fajr ${city}`,
    `heure du maghrib ${city}`,
    `heure de rupture du jeûne ${city}`,
    `horaire priere ${country}`,
    `direction qibla ${city}`,
  ],

  // Le nom de pays arrive nu de CLDR ("Maroc", "France", "États-Unis") et le
  // français exigerait au/en/aux selon le genre et l'initiale. L'apposition
  // avec deux-points est correcte quel que soit le pays, et garde le mot-clé
  // collé à « horaires de prière », ce que la recherche récompense.
  countryTitle: (country) => `${country} : horaires de prière — toutes les villes`,
  countryH1: (country) => `Horaires de prière : ${country}`,
  countryIntro: (country, n) =>
    `${country} : horaires de prière pour ${num(n)} ${n === 1 ? "ville" : "villes"}. Choisissez la vôtre pour connaître les heures du Fajr, du Dhuhr, de l'Asr, du Maghrib et de l'Isha aujourd'hui en heure locale, le tableau complet du mois et la direction de la qibla.`,
  countryDescription: (country, n, largest) =>
    `${country} : horaires de prière pour ses ${num(n)} villes, dont ${largest}. Fajr, Dhuhr, Asr, Maghrib et Isha aujourd'hui en heure locale, tableaux mensuels et direction de la qibla. Gratuit et open source.`,

  breadcrumb: "Fil d'Ariane",
  citiesIn: (country) => `${country} : villes couvertes`,
  citiesInBody: (country) =>
    `Chaque ville de ce pays disposant de son propre tableau d'horaires, les plus grandes d'abord — ${country} au complet.`,
  nearby: (city) => `Horaires de prière près de ${city}`,
  nearbyBody: "Les villes les plus proches disposant de leur propre tableau.",
  population: (n) => `${num(n)} habitants`,

  todayIn: (city) => `Aujourd'hui à ${city}`,
  countryToday: (country) => `${country} : aujourd'hui d'une ville à l'autre`,
  countryTodayBody: (n) =>
    `Les cinq prières quotidiennes en ce moment dans les ${num(n)} plus grandes villes, chacune à son heure locale. Les horaires se décalent d'environ quatre minutes par degré de longitude : un pays de cette taille n'a pas une seule réponse.`,
  liveNote: (tz) =>
    `Les horaires sont affichés en ${tz}, le fuseau horaire de la ville, au format 24 heures — pas celui de votre appareil.`,

  timetable: (city, month) => `Tableau des horaires de prière à ${city} — ${month}`,
  timetableBody: (city) =>
    `Chaque jour de ce mois, calculé pour les coordonnées de ${city}. Le lever du soleil clôt le créneau du Fajr ; ce n'est pas une prière.`,
  dateColumn: "Date",

  factsTitle: (city) => `À propos de ${city}`,
  coordinates: "Coordonnées",
  timezone: "Fuseau horaire",
  qiblaDirection: "Direction de la qibla",
  toMakkah: "Distance jusqu'à La Mecque",
  method: "Méthode de calcul",
  region: "Région",
  km: (n) => `${num(n)} km`,
  fromNorth: (degrees, point) => `${degrees}° ${point} par rapport au nord`,
  compass: { n: "N", ne: "NE", e: "E", se: "SE", s: "S", sw: "SO", w: "O", nw: "NO" },
  listComma: ", ",

  faqEyebrow: "Questions fréquentes",
  faqH2: (place) => `Horaires de prière à ${place}`,
  cityFaq: (city, country, tz, method, qibla) => [
    {
      q: `À quelle heure est le Fajr aujourd'hui à ${city} ?`,
      a: `L'heure du Fajr d'aujourd'hui pour ${city} figure en haut de cette page, avec un compte à rebours en direct. Elle est calculée d'après la position du soleil aux coordonnées de ${city} selon la méthode ${method}, et affichée en ${tz} : elle est donc juste que vous lisiez ceci depuis ${city} ou que vous prépariez un voyage.`,
    },
    {
      q: `À quelle heure est le Maghrib — la rupture du jeûne — à ${city} ?`,
      a: `Le Maghrib commence à l'instant où le soleil se couche à ${city}, et pendant le Ramadan c'est l'heure de rompre le jeûne. L'heure du Maghrib d'aujourd'hui est indiquée ci-dessus, et le tableau mensuel plus bas donne chaque jour du mois pour anticiper.`,
    },
    {
      q: `${country} : quelle méthode de calcul y suit-on ?`,
      a: `On y suit généralement la méthode ${method}, celle qu'utilise cette page par défaut. Les méthodes diffèrent surtout par l'angle solaire retenu pour le Fajr et l'Isha : les deux extrémités de la journée peuvent donc varier de plusieurs minutes de l'une à l'autre. Si votre mosquée en suit une autre, l'outil des horaires de prière permet d'en changer et de voir l'écart.`,
    },
    {
      q: `Dans quelle direction se trouve la qibla depuis ${city} ?`,
      a: `La qibla depuis ${city} est à ${qibla}, mesurée comme un cap orthodromique vers la Kaaba à La Mecque — le plus court chemin à la surface du globe, ce qui explique qu'elle puisse différer de la direction suggérée par une carte plane.`,
    },
    {
      q: `Ces horaires sont-ils exacts pour ${city} ?`,
      a: `Ils sont calculés pour les coordonnées propres de ${city} et non pour une moyenne nationale, ce qui compte : les horaires se décalent d'environ quatre minutes par degré de longitude. Pour la plus grande précision, utilisez la page de la ville la plus proche de vous.`,
    },
  ],
  countryFaq: (country, method, n, largest) => [
    {
      q: `${country} : quels sont les horaires de prière aujourd'hui ?`,
      a: `Ils varient d'un bout à l'autre du pays — d'environ quatre minutes par degré de longitude, et davantage lorsque le territoire s'étend sur plusieurs fuseaux horaires. Choisissez votre ville dans la liste de cette page pour les horaires exacts, ou utilisez l'outil des horaires de prière qui détecte votre position automatiquement.`,
    },
    {
      q: `${country} : quelle méthode de calcul des horaires de prière y est utilisée ?`,
      a: `Les pages de ses villes utilisent par défaut la méthode ${method}, la plus largement suivie sur place. Les méthodes diffèrent par l'angle solaire retenu pour le Fajr et l'Isha : leur désaccord porte donc surtout sur l'aube et la nuit.`,
    },
    {
      q: `${country} : quelles villes sont couvertes ?`,
      a: `${num(n)} ${n === 1 ? "ville dispose de sa propre page" : "villes disposent de leur propre page"}, à commencer par ${largest}. Chacune donne les horaires du jour, un tableau mensuel et la direction de la qibla. Si la vôtre n'y figure pas, la plus proche n'est qu'à quelques minutes près.`,
    },
    {
      q: `${country} : quand commence le Ramadan ?`,
      a: `Le Ramadan suit le calendrier hégirien : sa date grégorienne recule d'environ onze jours chaque année, et son début exact dépend de l'observation lunaire retenue par votre pays. Le compte à rebours du Ramadan le suit, et chaque page de ville donne les heures du Fajr et du Maghrib qui fixent le suhoor et l'iftar.`,
    },
  ],
};
