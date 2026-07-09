export const qibla = {
  meta: {
    title: "Qibla Finder — direction to the Kaaba with live compass",
    description:
      "Find the Qibla direction from any city: the exact bearing from true north, distance to the Kaaba in Makkah, and a live compass on supported phones. Private — computed on your device.",
  },
  title: "Qibla Finder",
  side: "اتجاه القبلة",
  intro:
    "The great-circle bearing from your location to the Kaaba in Makkah, computed locally. On phones with a compass, the needle turns live as you rotate.",
  yourLocation: "Your location",
  enableCompass: "Enable live compass",
  compassActive: "Compass active",
  noCompass: "No compass sensor here — use the bearing from true north instead.",
  fromNorth: "from true north",
  toQibla: "to the Qibla",
  needleLive: "Needle is live — it points at the Qibla as you turn.",
  faceNorth: "Face true north, then turn by the angle shown.",
  distance: (km: string) => `Distance to the Kaaba: ${km} km.`,
  prompt: "Search for your city or use your location to find the Qibla.",
  guideEyebrow: "Step by step",
  guideH2: "How to find the Qibla",
  guide: [
    {
      icon: "ph:map-pin",
      title: "Set your location",
      body: "Search for your city or tap “Use my location”. The Qibla is the great-circle direction from there to the Kaaba in Makkah.",
    },
    {
      icon: "ph:compass-rose",
      title: "Turn on the live compass",
      body: "On a phone, tap “Enable live compass” and allow motion access. The needle then rotates as you turn, pointing straight at the Qibla.",
    },
    {
      icon: "ph:arrows-clockwise",
      title: "Calibrate for accuracy",
      body: "If the needle drifts, wave your phone in a figure-8 a few times and keep away from magnets, speakers, laptops and metal desks.",
    },
    {
      icon: "ph:navigation-arrow",
      title: "No compass? Use the angle",
      body: "On a laptop or a phone without a compass, face true north and turn by the degrees shown to face the Qibla.",
    },
  ],
  faqEyebrow: "Qibla FAQ",
  faqH2: "About the Qibla direction",
  faq: [
    {
      q: "What is the Qibla?",
      a: "The Qibla is the direction Muslims face in prayer — toward the Kaaba in the Sacred Mosque (Masjid al-Haram) in Makkah.",
    },
    {
      q: "How accurate is the Qibla compass?",
      a: "The bearing is calculated precisely from your coordinates to the Kaaba. Live-compass accuracy depends on your phone's magnetometer, so calibrate it for the best result.",
    },
    {
      q: "Why does the needle point the wrong way?",
      a: "Phone compasses read magnetic north and are easily disturbed by nearby metal, magnets or electronics. Recalibrate with a figure-8 motion, away from interference.",
    },
    {
      q: "Does the Qibla finder work on a laptop?",
      a: "Yes, though most laptops have no compass. It shows the exact bearing from true north so you can align using a physical compass or a map.",
    },
    {
      q: "Is my location private?",
      a: "The Qibla direction is computed on your device. If you use city search, only the city name is sent to look up its coordinates — your precise GPS position is never uploaded.",
    },
  ],
};
