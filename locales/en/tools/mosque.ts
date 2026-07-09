export const mosque = {
  meta: {
    title: "Mosque Finder — mosques near me on a live map",
    description:
      "Find mosques and prayer rooms near you on an interactive map using OpenStreetMap community data, with one-tap directions. Free and private — your location is used once and never stored.",
  },
  title: "Mosque Finder",
  side: "أقرب مسجد",
  intro:
    "Nearby mosques on an interactive map, from OpenStreetMap's community data. Allow location access — or search a place — and your position is used only for this one search, never stored.",
  radius: "Search radius",
  find: "Find mosques",
  searchArea: "Search this area",
  searching: "Searching…",
  locationNeeded: "Allow location access, or search for a place, to see nearby mosques.",
  resultCount: (n: number) => (n === 1 ? "1 mosque nearby" : `${n} mosques nearby`),
  errorService: "The map service didn't respond. Try again in a moment.",
  unnamed: "Unnamed mosque",
  away: (km: string) => `${km} km away`,
  directions: "Directions",
  osm: "OpenStreetMap",
  noResults: (r: number) =>
    `No mosques tagged within ${r} km here. Try a wider radius — community map coverage varies by area.`,
  faqEyebrow: "Mosque Finder FAQ",
  faqH2: "Finding mosques near you",
  faq: [
    {
      q: "How does the mosque finder work?",
      a: "With your permission it uses your device location to search OpenStreetMap's community data for places of worship tagged as Muslim within your chosen radius, then plots them on the map.",
    },
    {
      q: "Is my location stored or tracked?",
      a: "No. Your coordinates are used for a single search and never saved. The only request made is the OpenStreetMap query that returns nearby mosques — there are no accounts and no tracking.",
    },
    {
      q: "A mosque near me is missing — why?",
      a: "OpenStreetMap is community-edited, so coverage varies by area. Try a wider radius, and consider adding the mosque on openstreetmap.org so others can find it too.",
    },
    {
      q: "How do I get directions to a mosque?",
      a: "Tap “Directions” on any result to open turn-by-turn navigation to that mosque in your maps app.",
    },
    {
      q: "Do I need an app or account?",
      a: "No. The finder runs entirely in your browser — no sign-up, no install, no ads.",
    },
  ],
};
