/** Copy for the prerendered country and city prayer-times pages.
 *
 * Almost everything here is a function of the place, because the pages are
 * only worth publishing if each one reads as though it were written about
 * that city — 7,654 pages of the same paragraph with the name swapped is the
 * definition of the thin content Google throws away. */
export const prayerPlaces = {
  // ------------------------------------------------------------- the hub
  hubEyebrow: "Browse by place",
  hubTitle: "Prayer times by country",
  hubIntro:
    "Every country in the world, with its own prayer timetable, the calculation method its mosques follow, and a page for each of its cities.",
  hubCities: (n: number) => `${n} ${n === 1 ? "city" : "cities"}`,

  // ------------------------------------------------------------ the pages
  cityTitle: (city: string, country: string) => `Prayer Times in ${city}, ${country} Today`,
  cityH1: (city: string) => `Prayer Times in ${city}`,
  cityIntro: (city: string, country: string) =>
    `Today's five daily prayer times for ${city}, ${country}, calculated from the sun's position at the city's own coordinates and shown in local time. The countdown to the next prayer runs live on your device.`,
  cityDescription: (label: string, coords: string, qibla: string) =>
    `Prayer times for ${label} (${coords}): today's Fajr, Dhuhr, Asr, Maghrib and Isha in local time, a full month's timetable, and the qibla direction — ${qibla}. Free, no ads, no tracking.`,
  cityKeywords: (city: string, country: string) => [
    `prayer times ${city}`,
    `salah times ${city}`,
    `namaz times ${city}`,
    `fajr time ${city}`,
    `maghrib time ${city}`,
    `iftar time ${city}`,
    `prayer times ${country}`,
    `qibla direction ${city}`,
  ],

  countryTitle: (country: string) => `Prayer Times in ${country} — All Cities`,
  countryH1: (country: string) => `Prayer Times in ${country}`,
  countryIntro: (country: string, n: number) =>
    `Prayer times for ${n} ${n === 1 ? "city" : "cities"} across ${country}. Pick your city for today's Fajr, Dhuhr, Asr, Maghrib and Isha in local time, this month's full timetable and the qibla direction.`,
  countryDescription: (country: string, n: number, largest: string) =>
    `Prayer times for all ${n} cities in ${country}, ${largest} among them. Today's Fajr, Dhuhr, Asr, Maghrib and Isha in local time, monthly timetables and qibla directions. Free and open source.`,

  // ------------------------------------------------------------- sections
  breadcrumb: "Breadcrumb",
  citiesIn: (country: string) => `Cities in ${country}`,
  citiesInBody: (country: string) =>
    `Every city in ${country} with its own prayer timetable, largest first.`,
  nearby: (city: string) => `Prayer times near ${city}`,
  nearbyBody: "The closest cities with their own timetable.",
  population: (n: number) => `${n.toLocaleString("en-US")} people`,

  todayIn: (city: string) => `Today in ${city}`,
  countryToday: (country: string) => `Today across ${country}`,
  countryTodayBody: (n: number) =>
    `The five daily prayers right now in the ${n} largest cities, each in its own local time. Prayer times move roughly four minutes per degree of longitude, so a country this size does not have one answer.`,
  liveNote: (tz: string) =>
    `Times are shown in ${tz}, the city's own timezone, on a 24-hour clock — not your device's.`,

  timetable: (city: string, month: string) => `${month} prayer timetable for ${city}`,
  timetableBody: (city: string) =>
    `Every day this month, computed for ${city}'s coordinates. Sunrise ends the Fajr window; it is not a prayer.`,
  dateColumn: "Date",

  // --------------------------------------------------------------- facts
  factsTitle: (city: string) => `About ${city}`,
  coordinates: "Coordinates",
  timezone: "Timezone",
  qiblaDirection: "Qibla direction",
  toMakkah: "Distance to Makkah",
  method: "Calculation method",
  region: "Region",
  km: (n: number) => `${n.toLocaleString("en-US")} km`,
  fromNorth: (degrees: number, point: string) => `${degrees}° ${point} from north`,
  compass: { n: "N", ne: "NE", e: "E", se: "SE", s: "S", sw: "SW", w: "W", nw: "NW" },
  listComma: ", ",

  // ----------------------------------------------------------------- FAQ
  faqEyebrow: "Prayer times FAQ",
  faqH2: (place: string) => `Prayer times in ${place}`,
  cityFaq: (city: string, country: string, tz: string, method: string, qibla: string) => [
    {
      q: `What time is Fajr in ${city} today?`,
      a: `Today's Fajr time for ${city} is at the top of this page, with a live countdown. It is computed from the sun's position at ${city}'s coordinates using the ${method} method and shown in ${tz}, so it is correct whether you are reading this in ${city} or planning a trip from elsewhere.`,
    },
    {
      q: `What time is Maghrib — iftar — in ${city}?`,
      a: `Maghrib begins the moment the sun sets in ${city}, and in Ramadan that is the time to break your fast. Today's Maghrib is listed above and the monthly timetable below gives every day this month, so you can plan ahead.`,
    },
    {
      q: `Which calculation method does ${country} follow?`,
      a: `${country} generally follows ${method}, which is what this page uses by default. Methods differ mainly in the sun angle they use for Fajr and Isha, so the two ends of the day can vary by several minutes between them. If your mosque follows another method, the prayer times tool lets you switch and see the difference.`,
    },
    {
      q: `Which direction is the qibla from ${city}?`,
      a: `The qibla from ${city} is ${qibla}, measured as a great-circle bearing to the Kaaba in Makkah — the shortest path across the earth's surface, which is why it can differ from the direction a flat map suggests.`,
    },
    {
      q: `Are these times accurate for ${city}?`,
      a: `They are calculated for ${city}'s own coordinates rather than a country-wide average, which matters: prayer times shift by roughly four minutes for every degree of longitude. For the closest match, use the page for the city nearest you.`,
    },
  ],
  countryFaq: (country: string, method: string, n: number, largest: string) => [
    {
      q: `What are today's prayer times in ${country}?`,
      a: `Prayer times vary across ${country} — they shift by about four minutes for every degree of longitude, and more where the country spans several timezones. Pick your city from the list on this page for exact times, or use the prayer times tool to detect your location automatically.`,
    },
    {
      q: `Which prayer time calculation method is used in ${country}?`,
      a: `Pages for cities in ${country} use ${method} by default, the method most widely followed there. Methods differ in the sun angle used for Fajr and Isha, so they mainly disagree at dawn and at night.`,
    },
    {
      q: `Which cities in ${country} are covered?`,
      a: `${n} ${n === 1 ? "city has a page of its own" : "cities have pages of their own"}, starting with ${largest}. Each has today's times, a monthly timetable and the qibla direction. If yours is not listed, the nearest one is within a few minutes.`,
    },
    {
      q: `When does Ramadan start in ${country}?`,
      a: `Ramadan follows the Hijri calendar, so its Gregorian date moves back about eleven days each year and the exact start depends on the moon sighting your country follows. The Ramadan countdown tracks it, and each city page gives the Fajr and Maghrib times that set suhoor and iftar.`,
    },
  ],
};
