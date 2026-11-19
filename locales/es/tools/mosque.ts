import type { mosque as en } from "../../en/tools/mosque";

export const mosque: typeof en = {
  meta: {
    title: "Buscador de mezquitas — mezquitas cerca de mí en un mapa interactivo",
    description:
      "Encuentra mezquitas y salas de oración cerca de ti en un mapa interactivo con los datos colaborativos de OpenStreetMap, y obtén indicaciones con un toque. Gratis y privado: tu ubicación se usa una vez y nunca se guarda.",
  },
  title: "Buscador de mezquitas",
  side: "أقرب مسجد",
  intro:
    "Las mezquitas cercanas en un mapa interactivo, con los datos colaborativos de OpenStreetMap. Permite el acceso a tu ubicación (o busca un lugar) y tu posición se usará solo para esta búsqueda; nunca se guarda.",
  radius: "Radio de búsqueda",
  find: "Buscar mezquitas",
  searchArea: "Buscar en esta zona",
  searching: "Buscando…",
  locationNeeded: "Permite el acceso a tu ubicación o busca un lugar para ver las mezquitas cercanas.",
  resultCount: (n: number) => (n === 1 ? "1 mezquita cerca" : `${n} mezquitas cerca`),
  errorService: "El servicio de mapas no ha respondido. Vuelve a intentarlo en un momento.",
  unnamed: "Mezquita sin nombre",
  away: (km: string) => `a ${km} km`,
  directions: "Cómo llegar",
  osm: "OpenStreetMap",
  noResults: (r: number) =>
    `No hay mezquitas registradas en un radio de ${r} km. Prueba con un radio mayor: la cobertura del mapa colaborativo varía según la zona.`,
  faqEyebrow: "Preguntas frecuentes sobre el buscador de mezquitas",
  faqH2: "Cómo encontrar mezquitas cerca de ti",
  faq: [
    {
      q: "¿Cómo funciona el buscador de mezquitas?",
      a: "Con tu permiso, usa la ubicación de tu dispositivo para buscar en los datos colaborativos de OpenStreetMap los lugares de culto marcados como musulmanes dentro del radio que elijas, y después los sitúa en el mapa.",
    },
    {
      q: "¿Se guarda o se rastrea mi ubicación?",
      a: "No. Tus coordenadas se usan para una sola búsqueda y nunca se guardan. La única petición que se hace es la consulta a OpenStreetMap que devuelve las mezquitas cercanas: no hay cuentas ni rastreo.",
    },
    {
      q: "Falta una mezquita cerca de mí. ¿Por qué?",
      a: "OpenStreetMap lo editan sus propios usuarios, así que la cobertura varía según la zona. Prueba con un radio mayor y plantéate añadir la mezquita en openstreetmap.org para que otros también puedan encontrarla.",
    },
    {
      q: "¿Cómo obtengo indicaciones para llegar a una mezquita?",
      a: "Toca «Cómo llegar» en cualquier resultado para abrir la navegación paso a paso hasta esa mezquita en tu aplicación de mapas.",
    },
    {
      q: "¿Necesito una aplicación o una cuenta?",
      a: "No. El buscador funciona íntegramente en tu navegador: sin registro, sin instalación y sin anuncios.",
    },
  ],
};
