import type { home as en } from "../en/home";

export const home: typeof en = {
  eyebrow: "Código abierto | Sadaqah Jariyah",
  h1a: (n: number) => `${n} herramientas islámicas`,
  h1b: "Todo lo que un musulmán necesita, en un solo lugar.",
  heroP:
    "Horarios de oración, qibla, zakat, Corán, calendario de la hégira, herencias y mucho más, sin anuncios ni suscripciones. Creado únicamente como Sadaqah Jariyah.",
  ctaExplore: "Explorar herramientas",
  ctaGithub: "Dar una estrella en GitHub",
  todayIs: "Hoy es",
  falahCaption: "La llamada al éxito en esta vida y en la otra (Ajira)",
  heroQuote: "«Venid al éxito (Falah)»: la llamada a la que respondemos cada día, y una plataforma creada al servicio de tu adoración.",

  toolkitEyebrow: "Herramientas",
  toolkitH2: "Todas las herramientas, gratis para siempre.",
  toolkitP: (n: number) =>
    `${n} herramientas de adoración, orientación, conocimiento, finanzas y creatividad, y todas funcionan al 100 % en tu dispositivo.`,
  searchPh: "Buscar herramientas…",
  searchAria: "Buscar entre las herramientas",
  openTool: "Abrir",
  noMatch: (q: string) => `Ninguna herramienta coincide con «${q}». Prueba con otra palabra.`,
  faqEyebrow: "Preguntas frecuentes",
  faqH2: "Respuestas antes de que preguntes.",
  faq: [
    {
      q: "¿De verdad Falah.io es gratis?",
      a: "Sí. Todas las herramientas son gratis para siempre, sin anuncios, sin suscripciones y sin versión premium. Falah se ha creado únicamente como Sadaqah Jariyah (caridad continua).",
    },
    {
      q: "¿Tengo que crear una cuenta?",
      a: "No. No hay registro, ni correo electrónico, ni inicio de sesión. Abre cualquier herramienta y úsala al instante, como una calculadora integrada.",
    },
    {
      q: "¿Mi ubicación y mis datos personales son privados?",
      a: "Totalmente. Los horarios de oración, la qibla, el zakat y todos los demás cálculos se realizan localmente en tu navegador: tus coordenadas y los datos que introduces nunca salen de tu dispositivo.",
    },
    {
      q: "¿Las herramientas funcionan sin conexión?",
      a: "La mayoría, sí. Falah es un sitio estático ligero, así que, una vez cargada la página, calculadoras como los horarios de oración, el calendario de la hégira o el zakat siguen funcionando sin conexión.",
    },
    {
      q: "¿Qué precisión tienen los horarios de oración y los cálculos?",
      a: "Se basan en métodos consolidados: la biblioteca astronómica adhan para los horarios de oración y la qibla, el calendario Umm al-Qura para las fechas de la hégira y las cuotas fijas coránicas para la herencia.",
    },
    {
      q: "¿Falah es de código abierto?",
      a: "Sí. Todo el código fuente es público en GitHub, así que cualquiera puede revisarlo, comprobar su privacidad o contribuir con mejoras.",
    },
  ],
  contributeEyebrow: "Hazte colaborador",
  contributeH2: "El zakat de tu conocimiento construye el futuro de tu umma.",
  contributeP:
    "Falah será siempre de código abierto, sin anuncios y sin versiones premium. Las donaciones ayudan a cubrir los costes del servidor, pero tu mayor contribución es dedicarle tu tiempo.",
  contributeCta: "Abrir un pull request",
  contributeStar: "Dar una estrella en GitHub",
  contributions: [
    { key: "code", icon: "ph:code", label: "Aportar mejoras al código" },
    { key: "translate", icon: "ph:translate", label: "Ayudar a traducir el proyecto" },
    { key: "bugs", icon: "ph:bug-beetle", label: "Informar de errores y problemas" },
    { key: "docs", icon: "ph:book-bookmark", label: "Mejorar la documentación" },
    { key: "share", icon: "ph:megaphone", label: "Compartir el proyecto con otras personas" },
  ],
  shareCopied: "Enlace copiado",
  contributorsTitle: "Las manos detrás de Falah",
  contributorsP:
    "Pedimos a Allah que acepte cada esfuerzo de este repositorio como caridad continua y conocimiento beneficioso.",
  commits: (n: number) => `${n} commit${n === 1 ? "" : "s"}`,
  joinTitle: "Tu nombre aquí",
  joinHint: "Abre un PR",
  statStars: "estrellas",
  statForks: "forks",
  statPeople: "colaboradores",
  categories: [
    { label: "Adoración diaria", side: "Tiempo y adoración" },
    { label: "Qibla y mezquitas", side: "Orientación" },
    { label: "Corán y conocimiento", side: "Corán y conocimiento" },
    { label: "Calculadoras islámicas", side: "Calculadoras" },
    { label: "Herramientas creativas", side: "Creatividad" },
  ],
  toolCards: {
    prayer: {
      name: "Horarios de oración y adhan",
      description: "Horarios de oración precisos para tu ubicación exacta o cualquier ciudad del mundo, con cuenta atrás en directo hasta la próxima oración y avisos personalizados."
    },
    calendar: {
      name: "Calendario inteligente de la hégira",
      description: "Un calendario islámico completo que destaca los días blancos (Ayyam al-Bid) y las fechas religiosas clave, con exportación sencilla a tu agenda."
    },
    ramadan: {
      name: "Compañero y cuenta atrás de Ramadán",
      description: "Una cuenta atrás en directo hasta el bendito mes de Ramadán, con un planificador diario y una guía para aprovechar al máximo tu adoración."
    },
    converter: {
      name: "Conversor de fechas (hégira ↔ gregoriano)",
      description: "Conversión instantánea y precisa de fechas en ambos sentidos entre el calendario de la hégira y el gregoriano, con un solo clic."
    },
    qibla: {
      name: "Brújula inteligente de la qibla",
      description: "Localiza con precisión la dirección de la Kaaba con los sensores integrados de tu dispositivo, totalmente sin conexión: sin rastreo de ubicación ni envío de datos a ningún servidor."
    },
    mosque: {
      name: "Buscador de mezquitas cercanas",
      description: "Encuentra al instante mezquitas y salas de oración a tu alrededor con la geolocalización local del navegador y total privacidad."
    },
    quran: {
      name: "Explorador del Corán (escritura uthmani)",
      description: "Lee y recorre el Sagrado Corán en auténtica escritura uthmani, con un lector limpio, centrado en la tipografía y sin distracciones."
    },
    tafseer: {
      name: "Explorador de tafsir coránico",
      description: "Lee explicaciones de referencia y comentarios de sabios aleya por aleya para profundizar en tu comprensión del Corán."
    },
    ayahFinder: {
      name: "Buscador de aleyas (texto y voz)",
      description: "Busca cualquier aleya del Corán escribiendo o pronunciando el texto en árabe y salta directamente a ella en el lector."
    },
    hadith: {
      name: "Colecciones de hadices (Kutub as-Sitta)",
      description: "Más de 36.000 hadices de Bukhari, Muslim, los cuatro Sunan, el Muwatta y los Cuarenta Hadices: texto árabe completo con traducción al inglés y grado de autenticidad."
    },
    names: {
      name: "Los 99 nombres de Allah (Asma ul Husna)",
      description: "Explora los nombres divinos con sus significados profundos, su trascendencia espiritual y su pronunciación en audio, totalmente sin conexión."
    },
    hisnul: {
      name: "Hisnul Muslim (La fortaleza del musulmán)",
      description: "Una amplia colección, organizada por categorías, de súplicas (duas) y adhkar auténticos del día a día para cada ocasión y circunstancia."
    },
    khatam: {
      name: "Planificador de khatam del Corán",
      description: "Planifica tu lectura del Corán para completarla en una fecha concreta. Calcula exactamente cuántas páginas tienes que leer al día y en cada oración."
    },
    zakat: {
      name: "Calculadora completa de zakat",
      description: "Una herramienta rápida y precisa para calcular el zakat sobre efectivo, oro, plata, inversiones y activos comerciales según el valor actualizado del nisab."
    },
    inheritance: {
      name: "Calculadora de herencias (fara'id)",
      description: "Calcula con precisión el reparto del patrimonio según las cuotas fijas coránicas y la jurisprudencia islámica, incluidos los casos complejos."
    },
    age: {
      name: "Edad e hitos según la hégira",
      description: "Calcula tu edad exacta en años de la hégira, descubre cuándo es tu próximo cumpleaños según la hégira y sigue los hitos importantes de tu vida."
    },
    cards: {
      name: "Creador de tarjetas con citas coránicas",
      description: "Diseña tarjetas tipográficas espectaculares con aleyas del Corán y citas islámicas, optimizadas y listas para compartir al instante en redes sociales."
    },
    stamp: {
      name: "Membrete árabe y sello de fecha",
      description: "Genera encabezados con la fecha de la hégira y sellos oficiales de aspecto profesional para dar un toque cuidado a tu correspondencia y tus documentos."
    },
    tasbeeh: {
      name: "Tasbih inteligente y contador de dhikr",
      description: "Un bonito contador de tasbih digital pensado para el móvil, con objetivos, respuesta háptica y dhikr diarios predefinidos."
    },
    umrah: {
      name: "Simulador 3D de umra y hajj",
      description: "Un simulador 3D interactivo en WebGL para aprender el tawaf, explorar la Kaaba y memorizar las súplicas clave paso a paso."
    },
  },
};
