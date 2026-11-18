import type { umrah as en } from "../../en/tools/umrah";

export const umrah: typeof en = {
  meta: {
    title: "Simulador de umra en 3D — guía interactiva del tawaf",
    description: "Un simulador interactivo en 3D (WebGL) para aprender a realizar el tawaf alrededor de la Kaaba con las súplicas y los pasos exactos.",
  },
  title: "Simulador de umra",
  side: "Guía 3D",
  intro: "Explora en 3D la Mezquita Sagrada (Masjid al-Haram). Aprende los pasos del tawaf, los lugares clave y las súplicas exactas que se recitan en cada esquina.",
  hajrAlAswad: "Hajr al-Aswad (Piedra Negra)",
  hajrAlAswadDesc: "El punto de inicio del tawaf. Señálala y di: «Bismillahi Allahu Akbar» (En el nombre de Allah, Allah es el más grande).",
  ruknYamani: "Rukn al-Yamani",
  ruknYamaniDesc: "Entre esta esquina y la Piedra Negra, recita: «Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar».",
  maqamIbrahim: "Maqam Ibrahim",
  maqamIbrahimDesc: "Tras completar las 7 vueltas, reza 2 rak'as detrás del Maqam Ibrahim si es posible.",
  step: "Paso",
  nextStep: "Siguiente paso",
  prevStep: "Anterior",
  loading3d: "Cargando la experiencia 3D…",
  dragToRotate: "Arrastra para girar",

  // Phase 2: Umrah Stages
  stageIhram: "Etapa 1: Ihram",
  stageTawaf: "Etapa 2: Tawaf",
  stageSai: "Etapa 3: Sa'i",
  stageHalq: "Etapa 4: Halq / Taqsir",

  ihramNiyyah: "La intención (niyya)",
  ihramNiyyahDesc: "Recita: «Allahumma labbayka ‘umrah» (Aquí estoy, oh Allah, para realizar la umra).",
  ihramTalbiyah: "La talbiya",
  ihramTalbiyahDesc: "Recita: «Labbayk Allahumma labbayk, labbayka la sharika laka labbayk. Innal-hamda wan-ni’mata laka wal-mulk, la sharika lak».",
  enterIhram: "Entrar en estado de ihram",

  tawafCircuit: "Vuelta",
  completeCircuit: "Completar vuelta",
  tawafComplete: "¡Tawaf completado! Dirígete al Maqam Ibrahim.",
  proceedToSai: "Pasar al sa'i",

  saiSafa: "Monte Safa",
  saiSafaDesc: "Recita: «Inna as-Safa wal-Marwata min sha’a’irillah» (En verdad, As-Safa y Al-Marwa están entre los símbolos de Allah).",
  saiMarwa: "Monte Marwa",
  saiLap: "Trayecto",
  completeLap: "Completar trayecto",
  saiComplete: "¡Sa'i completado! Pasa al halq.",
  proceedToHalq: "Pasar al halq",

  halqTitle: "Halq / Taqsir (afeitado o corte del cabello)",
  halqDesc: "Para salir del estado de ihram, lo ideal es que los hombres se afeiten la cabeza (halq) o se corten el pelo por igual en toda la cabeza (taqsir). Las mujeres se recogen el cabello y cortan el largo de la yema de un dedo.",
  completeUmrah: "Completar la umra",
  umrahSuccess: "¡Enhorabuena! Que Allah acepte tu umra.",
};
