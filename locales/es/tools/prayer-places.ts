import type { prayerPlaces as en } from "../../en/tools/prayer-places";

export const prayerPlaces: typeof en = {
  hubEyebrow: "Explorar por lugar",
  hubTitle: "Horarios de oración por país",
  hubIntro:
    "Todos los países del mundo, cada uno con su propia tabla de horarios de oración, el método de cálculo que siguen sus mezquitas y una página para cada una de sus ciudades.",
  hubCities: (n: number) => `${n} ${n === 1 ? "ciudad" : "ciudades"}`,

  cityTitle: (city: string, country: string) => `Horarios de oración hoy en ${city}, ${country}`,
  cityH1: (city: string) => `Horarios de oración en ${city}`,
  cityIntro: (city: string, country: string) =>
    `Los horarios de las cinco oraciones diarias de hoy en ${city}, ${country}, calculados a partir de la posición del sol en las coordenadas exactas de la ciudad y mostrados en hora local. La cuenta atrás hasta la próxima oración se actualiza en directo en tu dispositivo.`,
  cityDescription: (label: string, coords: string, qibla: string) =>
    `Horarios de oración en ${label} (${coords}): Fajr, Dhuhr, Asr, Maghrib e Isha de hoy en hora local, la tabla de todo el mes y la dirección de la qibla: ${qibla}. Gratis, sin anuncios y sin rastreo.`,
  cityKeywords: (city: string, country: string) => [
    `horario de oración ${city}`,
    `horario salat ${city}`,
    `hora del rezo ${city}`,
    `hora del fajr ${city}`,
    `hora del maghrib ${city}`,
    `hora del iftar ${city}`,
    `horario de oración ${country}`,
    `dirección qibla ${city}`,
  ],

  countryTitle: (country: string) => `Horarios de oración en ${country} — todas las ciudades`,
  countryH1: (country: string) => `Horarios de oración en ${country}`,
  countryIntro: (country: string, n: number) =>
    `Horarios de oración en ${n} ${n === 1 ? "ciudad" : "ciudades"} de ${country}. Elige la tuya para ver las horas locales de Fajr, Dhuhr, Asr, Maghrib e Isha de hoy, la tabla completa de este mes y la dirección de la qibla.`,
  countryDescription: (country: string, n: number, largest: string) =>
    `Horarios de oración en las ${n} ciudades de ${country}, entre ellas ${largest}. Fajr, Dhuhr, Asr, Maghrib e Isha de hoy en hora local, tablas mensuales y dirección de la qibla. Gratis y de código abierto.`,

  breadcrumb: "Ruta de navegación",
  citiesIn: (country: string) => `Ciudades de ${country}`,
  citiesInBody: (country: string) =>
    `Todas las ciudades de ${country} con su propia tabla de horarios, empezando por las más grandes.`,
  nearby: (city: string) => `Horarios de oración cerca de ${city}`,
  nearbyBody: "Las ciudades más cercanas con su propia tabla de horarios.",
  population: (n: number) => `${n.toLocaleString("es-ES")} habitantes`,

  todayIn: (city: string) => `Hoy en ${city}`,
  countryToday: (country: string) => `Hoy en ${country}`,
  countryTodayBody: (n: number) =>
    `Las cinco oraciones diarias ahora mismo en las ${n} ciudades más grandes, cada una en su hora local. Los horarios de oración varían unos cuatro minutos por cada grado de longitud, así que en un país de este tamaño no hay una única respuesta.`,
  liveNote: (tz: string) =>
    `Las horas se muestran en ${tz}, la zona horaria de la propia ciudad, en formato de 24 horas, y no en la de tu dispositivo.`,

  timetable: (city: string, month: string) => `Horarios de oración de ${month} en ${city}`,
  timetableBody: (city: string) =>
    `Todos los días de este mes, calculados para las coordenadas de ${city}. La salida del sol marca el final del Fajr; no es una oración.`,
  dateColumn: "Fecha",

  factsTitle: (city: string) => `Acerca de ${city}`,
  coordinates: "Coordenadas",
  timezone: "Zona horaria",
  qiblaDirection: "Dirección de la qibla",
  toMakkah: "Distancia a La Meca",
  method: "Método de cálculo",
  region: "Región",
  km: (n: number) => `${n.toLocaleString("es-ES")} km`,
  fromNorth: (degrees: number, point: string) => `${degrees}° ${point} respecto al norte`,
  compass: { n: "N", ne: "NE", e: "E", se: "SE", s: "S", sw: "SO", w: "O", nw: "NO" },
  listComma: ", ",

  faqEyebrow: "Preguntas frecuentes sobre los horarios de oración",
  faqH2: (place: string) => `Horarios de oración en ${place}`,
  cityFaq: (city: string, country: string, tz: string, method: string, qibla: string) => [
    {
      q: `¿A qué hora es el Fajr hoy en ${city}?`,
      a: `La hora del Fajr de hoy en ${city} aparece al principio de esta página, con una cuenta atrás en directo. Se calcula a partir de la posición del sol en las coordenadas de ${city} con el método ${method} y se muestra en ${tz}, así que es correcta tanto si lo lees desde ${city} como si estás preparando un viaje desde otro lugar.`,
    },
    {
      q: `¿A qué hora es el Maghrib —el iftar— en ${city}?`,
      a: `El Maghrib empieza en el momento en que se pone el sol en ${city}, y en Ramadán es la hora de romper el ayuno. El Maghrib de hoy aparece más arriba, y la tabla mensual de abajo recoge todos los días de este mes para que puedas organizarte con antelación.`,
    },
    {
      q: `¿Qué método de cálculo se sigue en ${country}?`,
      a: `En ${country} se sigue generalmente el método ${method}, que es el que usa esta página por defecto. Los métodos se diferencian sobre todo en el ángulo solar que usan para el Fajr y el Isha, así que los dos extremos del día pueden variar varios minutos de uno a otro. Si tu mezquita sigue otro método, la herramienta de horarios de oración te permite cambiarlo y ver la diferencia.`,
    },
    {
      q: `¿En qué dirección está la qibla desde ${city}?`,
      a: `La qibla desde ${city} está a ${qibla}, medida como el rumbo de círculo máximo hacia la Kaaba de La Meca, es decir, el camino más corto sobre la superficie de la Tierra. Por eso puede no coincidir con la dirección que sugiere un mapa plano.`,
    },
    {
      q: `¿Son exactos estos horarios para ${city}?`,
      a: `Se calculan para las coordenadas propias de ${city} y no con una media de todo el país, y eso importa: los horarios de oración se desplazan unos cuatro minutos por cada grado de longitud. Para obtener la mayor precisión, usa la página de la ciudad más cercana a ti.`,
    },
  ],
  countryFaq: (country: string, method: string, n: number, largest: string) => [
    {
      q: `¿Cuáles son los horarios de oración de hoy en ${country}?`,
      a: `Los horarios de oración varían dentro de ${country}: se desplazan unos cuatro minutos por cada grado de longitud, y aún más donde el país abarca varias zonas horarias. Elige tu ciudad en la lista de esta página para ver los horarios exactos, o usa la herramienta de horarios de oración para detectar tu ubicación automáticamente.`,
    },
    {
      q: `¿Qué método de cálculo de los horarios de oración se usa en ${country}?`,
      a: `Las páginas de las ciudades de ${country} usan por defecto el método ${method}, el más seguido allí. Los métodos se diferencian en el ángulo solar que usan para el Fajr y el Isha, así que discrepan sobre todo al amanecer y por la noche.`,
    },
    {
      q: `¿Qué ciudades de ${country} están incluidas?`,
      a: `${n} ${n === 1 ? "ciudad tiene su propia página" : "ciudades tienen su propia página"}, empezando por ${largest}. Cada una incluye los horarios de hoy, una tabla mensual y la dirección de la qibla. Si la tuya no aparece, la más cercana solo varía unos minutos.`,
    },
    {
      q: `¿Cuándo empieza el Ramadán en ${country}?`,
      a: `El Ramadán sigue el calendario de la hégira, así que su fecha gregoriana se adelanta unos once días cada año, y el inicio exacto depende del avistamiento de la luna que siga tu país. La cuenta atrás para Ramadán lo sigue de cerca, y cada página de ciudad indica las horas de Fajr y Maghrib, que marcan el suhur y el iftar.`,
    },
  ],
};
