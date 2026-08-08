export const ayahFinder = {
  meta: {
    title: "Ayah Finder — Find any Quran verse by text or voice",
    description:
      "Search all 6,236 ayahs of the Quran by typing or speaking Arabic text, and jump straight to the verse in the reader.",
  },
  title: "Ayah Finder",
  side: "باحث الآيات",
  intro:
    "Search every ayah of the Quran by typing or speaking Arabic, then read it in the full reader.",
  mic: "Start listening",
  listening: "Listening…",
  unsupported: "Voice input not supported",
  micError: "Voice input failed. Check your microphone and permission, then try again.",
  micPermission: "Microphone access was denied. Allow the mic for this site in your browser.",
  micNoDevice: "No microphone found. Check your system audio settings.",
  micNetwork: "Couldn't reach the speech service. Check your internet connection and disable ad-blockers for this site, then try again.",
  micInsecure: "Voice input needs a secure connection. Open the app at localhost or HTTPS.",
  placeholder: "Type Arabic text, e.g. «الرحمن»",
  results: (n: number) => `${n} result${n === 1 ? "" : "s"}`,
  noResults: "No matching ayahs. Try another phrase.",
  confidence: "Confidence",
  ayah: "Ayah",
  loading: "Searching…",
  error: "Could not search. Check your connection and try again.",
  read: "Read",
  privacy:
    "Your search runs entirely in your browser — your query, voice and the index never leave your device.",
  emptyTip: "Type or speak a few Arabic words to find a matching ayah.",
};
