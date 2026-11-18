import type { qibla as en } from "../../en/tools/qibla";

export const qibla: typeof en = {
  meta: {
    title: "Buscador de la Qibla — dirección de la Kaaba con brújula en directo",
    description:
      "Encuentra la dirección de la qibla desde cualquier ciudad: el rumbo exacto respecto al norte geográfico, la distancia hasta la Kaaba en La Meca y una brújula en directo en los móviles compatibles. Privado: se calcula en tu dispositivo.",
  },
  title: "Buscador de la Qibla",
  side: "اتجاه القبلة",
  intro:
    "El rumbo de círculo máximo desde tu ubicación hasta la Kaaba de La Meca, calculado en tu dispositivo. En los móviles con brújula, la aguja se mueve en directo a medida que te giras.",
  yourLocation: "Tu ubicación",
  enableCompass: "Activar la brújula en directo",
  compassActive: "Brújula activada",
  noCompass: "No hay sensor de brújula: usa el rumbo respecto al norte geográfico.",
  fromNorth: "respecto al norte geográfico",
  toQibla: "hacia la qibla",
  needleLive: "La aguja está activa: apunta a la qibla mientras te giras.",
  faceNorth: "Colócate de cara al norte geográfico y gira el ángulo indicado.",
  distance: (km: string) => `Distancia a la Kaaba: ${km} km.`,
  prompt: "Busca tu ciudad o usa tu ubicación para encontrar la qibla.",
  guideEyebrow: "Paso a paso",
  guideH2: "Cómo encontrar la qibla",
  guide: [
    {
      icon: "ph:map-pin",
      title: "Indica tu ubicación",
      body: "Busca tu ciudad o toca «Usar mi ubicación». La qibla es la dirección de círculo máximo desde ese punto hasta la Kaaba de La Meca.",
    },
    {
      icon: "ph:compass-rose",
      title: "Activa la brújula en directo",
      body: "En el móvil, toca «Activar la brújula en directo» y permite el acceso a los sensores de movimiento. A partir de ahí, la aguja se mueve cuando te giras y apunta directamente a la qibla.",
    },
    {
      icon: "ph:arrows-clockwise",
      title: "Calibra para más precisión",
      body: "Si la aguja se desvía, mueve el móvil varias veces dibujando un 8 y aléjate de imanes, altavoces, portátiles y mesas metálicas.",
    },
    {
      icon: "ph:navigation-arrow",
      title: "¿Sin brújula? Usa el ángulo",
      body: "En un portátil o en un móvil sin brújula, colócate de cara al norte geográfico y gira los grados indicados para quedar de cara a la qibla.",
    },
  ],
  faqEyebrow: "Preguntas frecuentes sobre la qibla",
  faqH2: "Acerca de la dirección de la qibla",
  faq: [
    {
      q: "¿Qué es la qibla?",
      a: "La qibla es la dirección hacia la que se orientan los musulmanes en la oración: hacia la Kaaba, en la Mezquita Sagrada (Masjid al-Haram) de La Meca.",
    },
    {
      q: "¿Qué precisión tiene la brújula de la qibla?",
      a: "El rumbo se calcula con precisión desde tus coordenadas hasta la Kaaba. La precisión de la brújula en directo depende del magnetómetro de tu móvil, así que calíbralo para obtener el mejor resultado.",
    },
    {
      q: "¿Por qué la aguja apunta en la dirección equivocada?",
      a: "Las brújulas de los móviles leen el norte magnético y se alteran fácilmente con metales, imanes o aparatos electrónicos cercanos. Vuelve a calibrarla dibujando un 8 con el móvil, lejos de interferencias.",
    },
    {
      q: "¿El buscador de la qibla funciona en un portátil?",
      a: "Sí, aunque la mayoría de los portátiles no tienen brújula. Muestra el rumbo exacto respecto al norte geográfico para que puedas orientarte con una brújula física o un mapa.",
    },
    {
      q: "¿Mi ubicación es privada?",
      a: "La dirección de la qibla se calcula en tu dispositivo. Si usas la búsqueda de ciudades, solo se envía el nombre de la ciudad para obtener sus coordenadas; tu posición GPS exacta nunca se envía.",
    },
  ],
};
