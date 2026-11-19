import type { ayahFinder as en } from "../../en/tools/ayah-finder";

export const ayahFinder: typeof en = {
  meta: {
    title: "Buscador de aleyas — encuentra aleyas del Corán por texto o voz",
    description:
      "Busca entre las 6236 aleyas del Corán escribiendo o diciendo un texto en árabe y salta directamente a la aleya en el lector.",
  },
  title: "Buscador de aleyas",
  side: "باحث الآيات",
  intro:
    "Busca en todas las aleyas del Corán escribiendo o hablando en árabe y luego léelas en el lector completo.",
  mic: "Empezar a escuchar",
  listening: "Escuchando…",
  unsupported: "Entrada de voz no disponible",
  micError: "La entrada de voz ha fallado. Comprueba tu micrófono y los permisos e inténtalo de nuevo.",
  micPermission: "Se ha denegado el acceso al micrófono. Permite el micrófono para este sitio en tu navegador.",
  micNoDevice: "No se ha encontrado ningún micrófono. Revisa los ajustes de audio del sistema.",
  micNetwork: "No se ha podido conectar con el servicio de voz. Comprueba tu conexión a internet y desactiva los bloqueadores de anuncios para este sitio; después, inténtalo de nuevo.",
  micInsecure: "La entrada de voz necesita una conexión segura. Abre la aplicación en localhost o con HTTPS.",
  placeholder: "Escribe un texto en árabe, p. ej. «الرحمن»",
  results: (n: number) => `${n} resultado${n === 1 ? "" : "s"}`,
  noResults: "No hay aleyas que coincidan. Prueba con otra frase.",
  confidence: "Confianza",
  ayah: "Aleya",
  loading: "Buscando…",
  error: "No se ha podido buscar. Comprueba tu conexión e inténtalo de nuevo.",
  read: "Leer",
  privacy:
    "La búsqueda se ejecuta por completo en tu navegador: tu consulta, tu voz y el índice nunca salen de tu dispositivo.",
  emptyTip: "Escribe o di unas palabras en árabe para encontrar una aleya que coincida.",
};
