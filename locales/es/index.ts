import type { en } from "../en";
import { common } from "./common";
import { meta } from "./meta";
import { home } from "./home";
import { about } from "./about";
import { tools } from "./tools";
import { quranBrowse } from "./tools/quran-browse";
import { hadithBrowse } from "./tools/hadith-browse";
import { prayerPlaces } from "./tools/prayer-places";
import { namePage } from "./tools/name-page";

export const es: typeof en = {
  code: "es",
  name: "Español",

  common,
  meta,
  home,
  about,
  tools,
  quranBrowse,
  hadithBrowse,
  prayerPlaces,
  namePage,
};
