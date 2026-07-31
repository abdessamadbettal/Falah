/** Structural metadata for the Quran — the 114 surahs, 30 juz and 60 hizb.
 *
 * Hardcoded on purpose. These values never change, and baking them in means
 * URLs, titles and navigation don't depend on a third-party API being up or
 * on its transliteration spelling ("Al-Faatiha" vs the "al-fatihah" people
 * actually search for). The verse text still comes from the API at build
 * time; only the skeleton lives here. */

export type SurahMeta = {
  n: number;
  /** URL slug — the standard transliteration, e.g. "al-kahf". */
  slug: string;
  translit: string;
  arabic: string;
  meaning: string;
  revelation: "Meccan" | "Medinan";
  ayahs: number;
  /** Mushaf page this surah opens on. */
  page: number;
  /** Juz this surah opens in. */
  juz: number;
};

export type JuzMeta = {
  n: number;
  arabic: string;
  translit: string;
  /** [surah, ayah] this juz opens at. */
  start: [number, number];
};

export type HizbMeta = { n: number; juz: number; start: [number, number] };

export const TOTAL_SURAHS = 114;
export const TOTAL_JUZ = 30;
export const TOTAL_HIZB = 60;
export const TOTAL_PAGES = 604;
export const TOTAL_AYAHS = 6236;

export const SURAHS: SurahMeta[] = [
  { n: 1, slug: "al-fatihah", translit: "Al-Fatihah", arabic: "سُورَةُ ٱلْفَاتِحَةِ", meaning: "The Opening", revelation: "Meccan", ayahs: 7, page: 1, juz: 1 },
  { n: 2, slug: "al-baqarah", translit: "Al-Baqarah", arabic: "سُورَةُ البَقَرَةِ", meaning: "The Cow", revelation: "Medinan", ayahs: 286, page: 2, juz: 1 },
  { n: 3, slug: "ali-imran", translit: "Ali 'Imran", arabic: "سُورَةُ آلِ عِمۡرَانَ", meaning: "The Family of Imraan", revelation: "Medinan", ayahs: 200, page: 50, juz: 3 },
  { n: 4, slug: "an-nisa", translit: "An-Nisa", arabic: "سُورَةُ النِّسَاءِ", meaning: "The Women", revelation: "Medinan", ayahs: 176, page: 77, juz: 4 },
  { n: 5, slug: "al-maidah", translit: "Al-Maidah", arabic: "سُورَةُ المَائـِدَةِ", meaning: "The Table", revelation: "Medinan", ayahs: 120, page: 106, juz: 6 },
  { n: 6, slug: "al-anam", translit: "Al-Anam", arabic: "سُورَةُ الأَنۡعَامِ", meaning: "The Cattle", revelation: "Meccan", ayahs: 165, page: 128, juz: 7 },
  { n: 7, slug: "al-araf", translit: "Al-Araf", arabic: "سُورَةُ الأَعۡرَافِ", meaning: "The Heights", revelation: "Meccan", ayahs: 206, page: 151, juz: 8 },
  { n: 8, slug: "al-anfal", translit: "Al-Anfal", arabic: "سُورَةُ الأَنفَالِ", meaning: "The Spoils of War", revelation: "Medinan", ayahs: 75, page: 177, juz: 9 },
  { n: 9, slug: "at-tawbah", translit: "At-Tawbah", arabic: "سُورَةُ التَّوۡبَةِ", meaning: "The Repentance", revelation: "Medinan", ayahs: 129, page: 187, juz: 10 },
  { n: 10, slug: "yunus", translit: "Yunus", arabic: "سُورَةُ يُونُسَ", meaning: "Jonas", revelation: "Meccan", ayahs: 109, page: 208, juz: 11 },
  { n: 11, slug: "hud", translit: "Hud", arabic: "سُورَةُ هُودٍ", meaning: "Hud", revelation: "Meccan", ayahs: 123, page: 221, juz: 11 },
  { n: 12, slug: "yusuf", translit: "Yusuf", arabic: "سُورَةُ يُوسُفَ", meaning: "Joseph", revelation: "Meccan", ayahs: 111, page: 235, juz: 12 },
  { n: 13, slug: "ar-rad", translit: "Ar-Rad", arabic: "سُورَةُ الرَّعۡدِ", meaning: "The Thunder", revelation: "Medinan", ayahs: 43, page: 249, juz: 13 },
  { n: 14, slug: "ibrahim", translit: "Ibrahim", arabic: "سُورَةُ إِبۡرَاهِيمَ", meaning: "Abraham", revelation: "Meccan", ayahs: 52, page: 255, juz: 13 },
  { n: 15, slug: "al-hijr", translit: "Al-Hijr", arabic: "سُورَةُ الحِجۡرِ", meaning: "The Rock", revelation: "Meccan", ayahs: 99, page: 262, juz: 14 },
  { n: 16, slug: "an-nahl", translit: "An-Nahl", arabic: "سُورَةُ النَّحۡلِ", meaning: "The Bee", revelation: "Meccan", ayahs: 128, page: 267, juz: 14 },
  { n: 17, slug: "al-isra", translit: "Al-Isra", arabic: "سُورَةُ الإِسۡرَاءِ", meaning: "The Night Journey", revelation: "Meccan", ayahs: 111, page: 282, juz: 15 },
  { n: 18, slug: "al-kahf", translit: "Al-Kahf", arabic: "سُورَةُ الكَهۡفِ", meaning: "The Cave", revelation: "Meccan", ayahs: 110, page: 293, juz: 15 },
  { n: 19, slug: "maryam", translit: "Maryam", arabic: "سُورَةُ مَرۡيَمَ", meaning: "Mary", revelation: "Meccan", ayahs: 98, page: 305, juz: 16 },
  { n: 20, slug: "taha", translit: "Ta-Ha", arabic: "سُورَةُ طه", meaning: "Taa-Haa", revelation: "Meccan", ayahs: 135, page: 312, juz: 16 },
  { n: 21, slug: "al-anbiya", translit: "Al-Anbiya", arabic: "سُورَةُ الأَنبِيَاءِ", meaning: "The Prophets", revelation: "Meccan", ayahs: 112, page: 322, juz: 17 },
  { n: 22, slug: "al-hajj", translit: "Al-Hajj", arabic: "سُورَةُ الحَجِّ", meaning: "The Pilgrimage", revelation: "Medinan", ayahs: 78, page: 332, juz: 17 },
  { n: 23, slug: "al-muminun", translit: "Al-Muminun", arabic: "سُورَةُ المُؤۡمِنُونَ", meaning: "The Believers", revelation: "Meccan", ayahs: 118, page: 342, juz: 18 },
  { n: 24, slug: "an-nur", translit: "An-Nur", arabic: "سُورَةُ النُّورِ", meaning: "The Light", revelation: "Medinan", ayahs: 64, page: 350, juz: 18 },
  { n: 25, slug: "al-furqan", translit: "Al-Furqan", arabic: "سُورَةُ الفُرۡقَانِ", meaning: "The Criterion", revelation: "Meccan", ayahs: 77, page: 359, juz: 18 },
  { n: 26, slug: "ash-shuara", translit: "Ash-Shuara", arabic: "سُورَةُ الشُّعَرَاءِ", meaning: "The Poets", revelation: "Meccan", ayahs: 227, page: 367, juz: 19 },
  { n: 27, slug: "an-naml", translit: "An-Naml", arabic: "سُورَةُ النَّمۡلِ", meaning: "The Ant", revelation: "Meccan", ayahs: 93, page: 377, juz: 19 },
  { n: 28, slug: "al-qasas", translit: "Al-Qasas", arabic: "سُورَةُ القَصَصِ", meaning: "The Stories", revelation: "Meccan", ayahs: 88, page: 385, juz: 20 },
  { n: 29, slug: "al-ankabut", translit: "Al-Ankabut", arabic: "سُورَةُ العَنكَبُوتِ", meaning: "The Spider", revelation: "Meccan", ayahs: 69, page: 396, juz: 20 },
  { n: 30, slug: "ar-rum", translit: "Ar-Rum", arabic: "سُورَةُ الرُّومِ", meaning: "The Romans", revelation: "Meccan", ayahs: 60, page: 404, juz: 21 },
  { n: 31, slug: "luqman", translit: "Luqman", arabic: "سُورَةُ لُقۡمَانَ", meaning: "Luqman", revelation: "Meccan", ayahs: 34, page: 411, juz: 21 },
  { n: 32, slug: "as-sajdah", translit: "As-Sajdah", arabic: "سُورَةُ السَّجۡدَةِ", meaning: "The Prostration", revelation: "Meccan", ayahs: 30, page: 415, juz: 21 },
  { n: 33, slug: "al-ahzab", translit: "Al-Ahzab", arabic: "سُورَةُ الأَحۡزَابِ", meaning: "The Clans", revelation: "Medinan", ayahs: 73, page: 418, juz: 21 },
  { n: 34, slug: "saba", translit: "Saba", arabic: "سُورَةُ سَبَإٍ", meaning: "Sheba", revelation: "Meccan", ayahs: 54, page: 428, juz: 22 },
  { n: 35, slug: "fatir", translit: "Fatir", arabic: "سُورَةُ فَاطِرٍ", meaning: "The Originator", revelation: "Meccan", ayahs: 45, page: 434, juz: 22 },
  { n: 36, slug: "yasin", translit: "Ya-Sin", arabic: "سُورَةُ يسٓ", meaning: "Yaseen", revelation: "Meccan", ayahs: 83, page: 440, juz: 22 },
  { n: 37, slug: "as-saffat", translit: "As-Saffat", arabic: "سُورَةُ الصَّافَّاتِ", meaning: "Those drawn up in Ranks", revelation: "Meccan", ayahs: 182, page: 446, juz: 23 },
  { n: 38, slug: "sad", translit: "Sad", arabic: "سُورَةُ صٓ", meaning: "The letter Saad", revelation: "Meccan", ayahs: 88, page: 453, juz: 23 },
  { n: 39, slug: "az-zumar", translit: "Az-Zumar", arabic: "سُورَةُ الزُّمَرِ", meaning: "The Groups", revelation: "Meccan", ayahs: 75, page: 458, juz: 23 },
  { n: 40, slug: "ghafir", translit: "Ghafir", arabic: "سُورَةُ غَافِرٍ", meaning: "The Forgiver", revelation: "Meccan", ayahs: 85, page: 467, juz: 24 },
  { n: 41, slug: "fussilat", translit: "Fussilat", arabic: "سُورَةُ فُصِّلَتۡ", meaning: "Explained in detail", revelation: "Meccan", ayahs: 54, page: 477, juz: 24 },
  { n: 42, slug: "ash-shura", translit: "Ash-Shura", arabic: "سُورَةُ الشُّورَىٰ", meaning: "Consultation", revelation: "Meccan", ayahs: 53, page: 483, juz: 25 },
  { n: 43, slug: "az-zukhruf", translit: "Az-Zukhruf", arabic: "سُورَةُ الزُّخۡرُفِ", meaning: "Ornaments of gold", revelation: "Meccan", ayahs: 89, page: 489, juz: 25 },
  { n: 44, slug: "ad-dukhan", translit: "Ad-Dukhan", arabic: "سُورَةُ الدُّخَانِ", meaning: "The Smoke", revelation: "Meccan", ayahs: 59, page: 496, juz: 25 },
  { n: 45, slug: "al-jathiyah", translit: "Al-Jathiyah", arabic: "سُورَةُ الجَاثِيَةِ", meaning: "Crouching", revelation: "Meccan", ayahs: 37, page: 499, juz: 25 },
  { n: 46, slug: "al-ahqaf", translit: "Al-Ahqaf", arabic: "سُورَةُ الأَحۡقَافِ", meaning: "The Dunes", revelation: "Meccan", ayahs: 35, page: 502, juz: 26 },
  { n: 47, slug: "muhammad", translit: "Muhammad", arabic: "سُورَةُ مُحَمَّدٍ", meaning: "Muhammad", revelation: "Medinan", ayahs: 38, page: 507, juz: 26 },
  { n: 48, slug: "al-fath", translit: "Al-Fath", arabic: "سُورَةُ الفَتۡحِ", meaning: "The Victory", revelation: "Medinan", ayahs: 29, page: 511, juz: 26 },
  { n: 49, slug: "al-hujurat", translit: "Al-Hujurat", arabic: "سُورَةُ الحُجُرَاتِ", meaning: "The Inner Apartments", revelation: "Medinan", ayahs: 18, page: 515, juz: 26 },
  { n: 50, slug: "qaf", translit: "Qaf", arabic: "سُورَةُ قٓ", meaning: "The letter Qaaf", revelation: "Meccan", ayahs: 45, page: 518, juz: 26 },
  { n: 51, slug: "adh-dhariyat", translit: "Adh-Dhariyat", arabic: "سُورَةُ الذَّارِيَاتِ", meaning: "The Winnowing Winds", revelation: "Meccan", ayahs: 60, page: 520, juz: 26 },
  { n: 52, slug: "at-tur", translit: "At-Tur", arabic: "سُورَةُ الطُّورِ", meaning: "The Mount", revelation: "Meccan", ayahs: 49, page: 523, juz: 27 },
  { n: 53, slug: "an-najm", translit: "An-Najm", arabic: "سُورَةُ النَّجۡمِ", meaning: "The Star", revelation: "Meccan", ayahs: 62, page: 526, juz: 27 },
  { n: 54, slug: "al-qamar", translit: "Al-Qamar", arabic: "سُورَةُ القَمَرِ", meaning: "The Moon", revelation: "Meccan", ayahs: 55, page: 528, juz: 27 },
  { n: 55, slug: "ar-rahman", translit: "Ar-Rahman", arabic: "سُورَةُ الرَّحۡمَٰن", meaning: "The Beneficent", revelation: "Medinan", ayahs: 78, page: 531, juz: 27 },
  { n: 56, slug: "al-waqiah", translit: "Al-Waqiah", arabic: "سُورَةُ الوَاقِعَةِ", meaning: "The Inevitable", revelation: "Meccan", ayahs: 96, page: 534, juz: 27 },
  { n: 57, slug: "al-hadid", translit: "Al-Hadid", arabic: "سُورَةُ الحَدِيدِ", meaning: "The Iron", revelation: "Medinan", ayahs: 29, page: 537, juz: 27 },
  { n: 58, slug: "al-mujadila", translit: "Al-Mujadila", arabic: "سُورَةُ المُجَادلَةِ", meaning: "The Pleading Woman", revelation: "Medinan", ayahs: 22, page: 542, juz: 28 },
  { n: 59, slug: "al-hashr", translit: "Al-Hashr", arabic: "سُورَةُ الحَشۡرِ", meaning: "The Exile", revelation: "Medinan", ayahs: 24, page: 545, juz: 28 },
  { n: 60, slug: "al-mumtahanah", translit: "Al-Mumtahanah", arabic: "سُورَةُ المُمۡتَحنَةِ", meaning: "She that is to be examined", revelation: "Medinan", ayahs: 13, page: 549, juz: 28 },
  { n: 61, slug: "as-saff", translit: "As-Saff", arabic: "سُورَةُ الصَّفِّ", meaning: "The Ranks", revelation: "Medinan", ayahs: 14, page: 551, juz: 28 },
  { n: 62, slug: "al-jumuah", translit: "Al-Jumuah", arabic: "سُورَةُ الجُمُعَةِ", meaning: "Friday", revelation: "Medinan", ayahs: 11, page: 553, juz: 28 },
  { n: 63, slug: "al-munafiqun", translit: "Al-Munafiqun", arabic: "سُورَةُ المُنَافِقُونَ", meaning: "The Hypocrites", revelation: "Medinan", ayahs: 11, page: 554, juz: 28 },
  { n: 64, slug: "at-taghabun", translit: "At-Taghabun", arabic: "سُورَةُ التَّغَابُنِ", meaning: "Mutual Disillusion", revelation: "Medinan", ayahs: 18, page: 556, juz: 28 },
  { n: 65, slug: "at-talaq", translit: "At-Talaq", arabic: "سُورَةُ الطَّلَاقِ", meaning: "Divorce", revelation: "Medinan", ayahs: 12, page: 558, juz: 28 },
  { n: 66, slug: "at-tahrim", translit: "At-Tahrim", arabic: "سُورَةُ التَّحۡرِيمِ", meaning: "The Prohibition", revelation: "Medinan", ayahs: 12, page: 560, juz: 28 },
  { n: 67, slug: "al-mulk", translit: "Al-Mulk", arabic: "سُورَةُ المُلۡكِ", meaning: "The Sovereignty", revelation: "Meccan", ayahs: 30, page: 562, juz: 29 },
  { n: 68, slug: "al-qalam", translit: "Al-Qalam", arabic: "سُورَةُ القَلَمِ", meaning: "The Pen", revelation: "Meccan", ayahs: 52, page: 564, juz: 29 },
  { n: 69, slug: "al-haqqah", translit: "Al-Haqqah", arabic: "سُورَةُ الحَاقَّةِ", meaning: "The Reality", revelation: "Meccan", ayahs: 52, page: 566, juz: 29 },
  { n: 70, slug: "al-maarij", translit: "Al-Maarij", arabic: "سُورَةُ المَعَارِجِ", meaning: "The Ascending Stairways", revelation: "Meccan", ayahs: 44, page: 568, juz: 29 },
  { n: 71, slug: "nuh", translit: "Nuh", arabic: "سُورَةُ نُوحٍ", meaning: "Noah", revelation: "Meccan", ayahs: 28, page: 570, juz: 29 },
  { n: 72, slug: "al-jinn", translit: "Al-Jinn", arabic: "سُورَةُ الجِنِّ", meaning: "The Jinn", revelation: "Meccan", ayahs: 28, page: 572, juz: 29 },
  { n: 73, slug: "al-muzzammil", translit: "Al-Muzzammil", arabic: "سُورَةُ المُزَّمِّلِ", meaning: "The Enshrouded One", revelation: "Meccan", ayahs: 20, page: 574, juz: 29 },
  { n: 74, slug: "al-muddaththir", translit: "Al-Muddaththir", arabic: "سُورَةُ المُدَّثِّرِ", meaning: "The Cloaked One", revelation: "Meccan", ayahs: 56, page: 575, juz: 29 },
  { n: 75, slug: "al-qiyamah", translit: "Al-Qiyamah", arabic: "سُورَةُ القِيَامَةِ", meaning: "The Resurrection", revelation: "Meccan", ayahs: 40, page: 577, juz: 29 },
  { n: 76, slug: "al-insan", translit: "Al-Insan", arabic: "سُورَةُ الإِنسَانِ", meaning: "Man", revelation: "Medinan", ayahs: 31, page: 578, juz: 29 },
  { n: 77, slug: "al-mursalat", translit: "Al-Mursalat", arabic: "سُورَةُ المُرۡسَلَاتِ", meaning: "The Emissaries", revelation: "Meccan", ayahs: 50, page: 580, juz: 29 },
  { n: 78, slug: "an-naba", translit: "An-Naba", arabic: "سُورَةُ النَّبَإِ", meaning: "The Announcement", revelation: "Meccan", ayahs: 40, page: 582, juz: 30 },
  { n: 79, slug: "an-naziat", translit: "An-Naziat", arabic: "سُورَةُ النَّازِعَاتِ", meaning: "Those who drag forth", revelation: "Meccan", ayahs: 46, page: 583, juz: 30 },
  { n: 80, slug: "abasa", translit: "Abasa", arabic: "سُورَةُ عَبَسَ", meaning: "He frowned", revelation: "Meccan", ayahs: 42, page: 585, juz: 30 },
  { n: 81, slug: "at-takwir", translit: "At-Takwir", arabic: "سُورَةُ التَّكۡوِيرِ", meaning: "The Overthrowing", revelation: "Meccan", ayahs: 29, page: 586, juz: 30 },
  { n: 82, slug: "al-infitar", translit: "Al-Infitar", arabic: "سُورَةُ الانفِطَارِ", meaning: "The Cleaving", revelation: "Meccan", ayahs: 19, page: 587, juz: 30 },
  { n: 83, slug: "al-mutaffifin", translit: "Al-Mutaffifin", arabic: "سُورَةُ المُطَفِّفِينَ", meaning: "Defrauding", revelation: "Meccan", ayahs: 36, page: 587, juz: 30 },
  { n: 84, slug: "al-inshiqaq", translit: "Al-Inshiqaq", arabic: "سُورَةُ الانشِقَاقِ", meaning: "The Splitting Open", revelation: "Meccan", ayahs: 25, page: 589, juz: 30 },
  { n: 85, slug: "al-buruj", translit: "Al-Buruj", arabic: "سُورَةُ البُرُوجِ", meaning: "The Constellations", revelation: "Meccan", ayahs: 22, page: 590, juz: 30 },
  { n: 86, slug: "at-tariq", translit: "At-Tariq", arabic: "سُورَةُ الطَّارِقِ", meaning: "The Morning Star", revelation: "Meccan", ayahs: 17, page: 591, juz: 30 },
  { n: 87, slug: "al-ala", translit: "Al-Ala", arabic: "سُورَةُ الأَعۡلَىٰ", meaning: "The Most High", revelation: "Meccan", ayahs: 19, page: 591, juz: 30 },
  { n: 88, slug: "al-ghashiyah", translit: "Al-Ghashiyah", arabic: "سُورَةُ الغَاشِيَةِ", meaning: "The Overwhelming", revelation: "Meccan", ayahs: 26, page: 592, juz: 30 },
  { n: 89, slug: "al-fajr", translit: "Al-Fajr", arabic: "سُورَةُ الفَجۡرِ", meaning: "The Dawn", revelation: "Meccan", ayahs: 30, page: 593, juz: 30 },
  { n: 90, slug: "al-balad", translit: "Al-Balad", arabic: "سُورَةُ البَلَدِ", meaning: "The City", revelation: "Meccan", ayahs: 20, page: 594, juz: 30 },
  { n: 91, slug: "ash-shams", translit: "Ash-Shams", arabic: "سُورَةُ الشَّمۡسِ", meaning: "The Sun", revelation: "Meccan", ayahs: 15, page: 595, juz: 30 },
  { n: 92, slug: "al-layl", translit: "Al-Layl", arabic: "سُورَةُ اللَّيۡلِ", meaning: "The Night", revelation: "Meccan", ayahs: 21, page: 595, juz: 30 },
  { n: 93, slug: "ad-duha", translit: "Ad-Duha", arabic: "سُورَةُ الضُّحَىٰ", meaning: "The Morning Hours", revelation: "Meccan", ayahs: 11, page: 596, juz: 30 },
  { n: 94, slug: "ash-sharh", translit: "Ash-Sharh", arabic: "سُورَةُ الشَّرۡحِ", meaning: "The Consolation", revelation: "Meccan", ayahs: 8, page: 596, juz: 30 },
  { n: 95, slug: "at-tin", translit: "At-Tin", arabic: "سُورَةُ التِّينِ", meaning: "The Fig", revelation: "Meccan", ayahs: 8, page: 597, juz: 30 },
  { n: 96, slug: "al-alaq", translit: "Al-Alaq", arabic: "سُورَةُ العَلَقِ", meaning: "The Clot", revelation: "Meccan", ayahs: 19, page: 597, juz: 30 },
  { n: 97, slug: "al-qadr", translit: "Al-Qadr", arabic: "سُورَةُ القَدۡرِ", meaning: "The Power, Fate", revelation: "Meccan", ayahs: 5, page: 598, juz: 30 },
  { n: 98, slug: "al-bayyinah", translit: "Al-Bayyinah", arabic: "سُورَةُ البَيِّنَةِ", meaning: "The Evidence", revelation: "Medinan", ayahs: 8, page: 598, juz: 30 },
  { n: 99, slug: "az-zalzalah", translit: "Az-Zalzalah", arabic: "سُورَةُ الزَّلۡزَلَةِ", meaning: "The Earthquake", revelation: "Medinan", ayahs: 8, page: 599, juz: 30 },
  { n: 100, slug: "al-adiyat", translit: "Al-Adiyat", arabic: "سُورَةُ العَادِيَاتِ", meaning: "The Chargers", revelation: "Meccan", ayahs: 11, page: 599, juz: 30 },
  { n: 101, slug: "al-qariah", translit: "Al-Qariah", arabic: "سُورَةُ القَارِعَةِ", meaning: "The Calamity", revelation: "Meccan", ayahs: 11, page: 600, juz: 30 },
  { n: 102, slug: "at-takathur", translit: "At-Takathur", arabic: "سُورَةُ التَّكَاثُرِ", meaning: "Competition", revelation: "Meccan", ayahs: 8, page: 600, juz: 30 },
  { n: 103, slug: "al-asr", translit: "Al-Asr", arabic: "سُورَةُ العَصۡرِ", meaning: "The Declining Day, Epoch", revelation: "Meccan", ayahs: 3, page: 601, juz: 30 },
  { n: 104, slug: "al-humazah", translit: "Al-Humazah", arabic: "سُورَةُ الهُمَزَةِ", meaning: "The Traducer", revelation: "Meccan", ayahs: 9, page: 601, juz: 30 },
  { n: 105, slug: "al-fil", translit: "Al-Fil", arabic: "سُورَةُ الفِيلِ", meaning: "The Elephant", revelation: "Meccan", ayahs: 5, page: 601, juz: 30 },
  { n: 106, slug: "quraysh", translit: "Quraysh", arabic: "سُورَةُ قُرَيۡشٍ", meaning: "Quraysh", revelation: "Meccan", ayahs: 4, page: 602, juz: 30 },
  { n: 107, slug: "al-maun", translit: "Al-Maun", arabic: "سُورَةُ المَاعُونِ", meaning: "Almsgiving", revelation: "Meccan", ayahs: 7, page: 602, juz: 30 },
  { n: 108, slug: "al-kawthar", translit: "Al-Kawthar", arabic: "سُورَةُ الكَوۡثَرِ", meaning: "Abundance", revelation: "Meccan", ayahs: 3, page: 602, juz: 30 },
  { n: 109, slug: "al-kafirun", translit: "Al-Kafirun", arabic: "سُورَةُ الكَافِرُونَ", meaning: "The Disbelievers", revelation: "Meccan", ayahs: 6, page: 603, juz: 30 },
  { n: 110, slug: "an-nasr", translit: "An-Nasr", arabic: "سُورَةُ النَّصۡرِ", meaning: "Divine Support", revelation: "Medinan", ayahs: 3, page: 603, juz: 30 },
  { n: 111, slug: "al-masad", translit: "Al-Masad", arabic: "سُورَةُ المَسَدِ", meaning: "The Palm Fibre", revelation: "Meccan", ayahs: 5, page: 603, juz: 30 },
  { n: 112, slug: "al-ikhlas", translit: "Al-Ikhlas", arabic: "سُورَةُ الإِخۡلَاصِ", meaning: "Sincerity", revelation: "Meccan", ayahs: 4, page: 604, juz: 30 },
  { n: 113, slug: "al-falaq", translit: "Al-Falaq", arabic: "سُورَةُ الفَلَقِ", meaning: "The Dawn", revelation: "Meccan", ayahs: 5, page: 604, juz: 30 },
  { n: 114, slug: "an-nas", translit: "An-Nas", arabic: "سُورَةُ النَّاسِ", meaning: "Mankind", revelation: "Meccan", ayahs: 6, page: 604, juz: 30 },
];

export const JUZ: JuzMeta[] = [
  { n: 1, arabic: "آلم", translit: "Alif Lam Mim", start: [1, 1] },
  { n: 2, arabic: "سَيَقُولُ", translit: "Sayaqul", start: [2, 142] },
  { n: 3, arabic: "تِلْكَ ٱلرُّسُل", translit: "Tilka ar-Rusul", start: [2, 253] },
  { n: 4, arabic: "لَن تَنَالُوا۟", translit: "Lan Tanalu", start: [3, 93] },
  { n: 5, arabic: "وَٱلْمُحْصَنَٰت", translit: "Wal-Muhsanat", start: [4, 24] },
  { n: 6, arabic: "لَا يُحِبُّ ٱللَّه", translit: "La Yuhibbullah", start: [4, 148] },
  { n: 7, arabic: "وَإِذَا سَمِعُوا۟", translit: "Wa Idha Sami'u", start: [5, 82] },
  { n: 8, arabic: "وَلَوْ أَنَّنَا", translit: "Wa Lau Annana", start: [6, 111] },
  { n: 9, arabic: "قَالَ ٱلْمَلَأ", translit: "Qalal Mala'u", start: [7, 88] },
  { n: 10, arabic: "وَٱعْلَمُوٓا۟", translit: "Wa'lamu", start: [8, 41] },
  { n: 11, arabic: "يَعْتَذِرُونَ", translit: "Ya'tadhirun", start: [9, 93] },
  { n: 12, arabic: "وَمَا مِن دَآبَّة", translit: "Wa Ma Min Dabbah", start: [11, 6] },
  { n: 13, arabic: "وَمَآ أُبَرِّئُ", translit: "Wa Ma Ubarri'u", start: [12, 53] },
  { n: 14, arabic: "رُبَمَا", translit: "Rubama", start: [15, 1] },
  { n: 15, arabic: "سُبْحَٰنَ ٱلَّذِى", translit: "Subhanalladhi", start: [17, 1] },
  { n: 16, arabic: "قَالَ أَلَمْ", translit: "Qala Alam", start: [18, 75] },
  { n: 17, arabic: "ٱقْتَرَبَ لِلنَّاسِ", translit: "Iqtaraba Lin-Nas", start: [21, 1] },
  { n: 18, arabic: "قَدْ أَفْلَحَ", translit: "Qad Aflaha", start: [23, 1] },
  { n: 19, arabic: "وَقَالَ ٱلَّذِينَ", translit: "Wa Qalalladhina", start: [25, 21] },
  { n: 20, arabic: "أَمَّنْ خَلَقَ", translit: "Amman Khalaqa", start: [27, 56] },
  { n: 21, arabic: "ٱتْلُ مَآ أُوحِىَ", translit: "Utlu Ma Uhiya", start: [29, 46] },
  { n: 22, arabic: "وَمَن يَقْنُتْ", translit: "Wa Man Yaqnut", start: [33, 31] },
  { n: 23, arabic: "وَمَا لِىَ", translit: "Wa Ma Liya", start: [36, 28] },
  { n: 24, arabic: "فَمَنْ أَظْلَمُ", translit: "Faman Azlamu", start: [39, 32] },
  { n: 25, arabic: "إِلَيْهِ يُرَدُّ", translit: "Ilayhi Yuraddu", start: [41, 47] },
  { n: 26, arabic: "حمٓ", translit: "Ha Mim", start: [46, 1] },
  { n: 27, arabic: "قَالَ فَمَا خَطْبُكُمْ", translit: "Qala Fama Khatbukum", start: [51, 31] },
  { n: 28, arabic: "قَدْ سَمِعَ ٱللَّهُ", translit: "Qad Sami'allahu", start: [58, 1] },
  { n: 29, arabic: "تَبَٰرَكَ ٱلَّذِى", translit: "Tabarakalladhi", start: [67, 1] },
  { n: 30, arabic: "عَمَّ", translit: "'Amma", start: [78, 1] },
];

export const HIZB: HizbMeta[] = [
  { n: 1, juz: 1, start: [1, 1] },
  { n: 2, juz: 1, start: [2, 75] },
  { n: 3, juz: 2, start: [2, 142] },
  { n: 4, juz: 2, start: [2, 203] },
  { n: 5, juz: 3, start: [2, 253] },
  { n: 6, juz: 3, start: [3, 15] },
  { n: 7, juz: 4, start: [3, 93] },
  { n: 8, juz: 4, start: [3, 171] },
  { n: 9, juz: 5, start: [4, 24] },
  { n: 10, juz: 5, start: [4, 88] },
  { n: 11, juz: 6, start: [4, 148] },
  { n: 12, juz: 6, start: [5, 27] },
  { n: 13, juz: 7, start: [5, 82] },
  { n: 14, juz: 7, start: [6, 36] },
  { n: 15, juz: 8, start: [6, 111] },
  { n: 16, juz: 8, start: [7, 1] },
  { n: 17, juz: 9, start: [7, 88] },
  { n: 18, juz: 9, start: [7, 171] },
  { n: 19, juz: 10, start: [8, 41] },
  { n: 20, juz: 10, start: [9, 34] },
  { n: 21, juz: 11, start: [9, 93] },
  { n: 22, juz: 11, start: [10, 26] },
  { n: 23, juz: 12, start: [11, 6] },
  { n: 24, juz: 12, start: [11, 84] },
  { n: 25, juz: 13, start: [12, 53] },
  { n: 26, juz: 13, start: [13, 19] },
  { n: 27, juz: 14, start: [15, 1] },
  { n: 28, juz: 14, start: [16, 51] },
  { n: 29, juz: 15, start: [17, 1] },
  { n: 30, juz: 15, start: [17, 99] },
  { n: 31, juz: 16, start: [18, 75] },
  { n: 32, juz: 16, start: [20, 1] },
  { n: 33, juz: 17, start: [21, 1] },
  { n: 34, juz: 17, start: [22, 1] },
  { n: 35, juz: 18, start: [23, 1] },
  { n: 36, juz: 18, start: [24, 21] },
  { n: 37, juz: 19, start: [25, 21] },
  { n: 38, juz: 19, start: [26, 111] },
  { n: 39, juz: 20, start: [27, 56] },
  { n: 40, juz: 20, start: [28, 51] },
  { n: 41, juz: 21, start: [29, 46] },
  { n: 42, juz: 21, start: [31, 22] },
  { n: 43, juz: 22, start: [33, 31] },
  { n: 44, juz: 22, start: [34, 24] },
  { n: 45, juz: 23, start: [36, 28] },
  { n: 46, juz: 23, start: [37, 145] },
  { n: 47, juz: 24, start: [39, 32] },
  { n: 48, juz: 24, start: [40, 41] },
  { n: 49, juz: 25, start: [41, 47] },
  { n: 50, juz: 25, start: [43, 24] },
  { n: 51, juz: 26, start: [46, 1] },
  { n: 52, juz: 26, start: [48, 18] },
  { n: 53, juz: 27, start: [51, 31] },
  { n: 54, juz: 27, start: [55, 1] },
  { n: 55, juz: 28, start: [58, 1] },
  { n: 56, juz: 28, start: [62, 1] },
  { n: 57, juz: 29, start: [67, 1] },
  { n: 58, juz: 29, start: [72, 1] },
  { n: 59, juz: 30, start: [78, 1] },
  { n: 60, juz: 30, start: [87, 1] },
];

const BY_SLUG = new Map(SURAHS.map((s) => [s.slug, s]));

export const surahBySlug = (slug: string): SurahMeta | undefined => BY_SLUG.get(slug);
export const surahByNumber = (n: number): SurahMeta | undefined => SURAHS[n - 1];
export const juzByNumber = (n: number): JuzMeta | undefined => JUZ[n - 1];
export const hizbByNumber = (n: number): HizbMeta | undefined => HIZB[n - 1];
