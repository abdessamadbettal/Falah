# Changelog

All notable changes to Falah.io are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Arabic (RTL) localization with English served unprefixed at the site root
- 16 client-side tools: prayer times, Hijri calendar, Ramadan countdown, date
  converter, Qibla finder, mosque finder, Quran explorer, tafseer, hadith
  collections, 99 Names, Hisnul Muslim, Zakat calculator, inheritance
  calculator, Hijri age, Quran card maker, and date stamp
- Hadith collections: 36,000+ hadiths across the six canonical books, the
  Muwatta and three Forty Hadith collections, prerendered as ~1,070 pages per
  locale — a page per kitab (split into parts past 50 hadiths) and a page per
  hadith for the Forty Hadith collections, with authentication grades,
  `Book`/`Chapter`/`Quotation` structured data, and a client-side search over
  every collection and book
- Prayer times for every country and 7,654 cities, prerendered as 23,694 pages
  across the three locales — a country hub comparing its largest cities and a
  page per city with today's five prayers, a live countdown, the month's
  timetable, coordinates, timezone, qibla bearing and distance to Makkah,
  `City`/`Country`/`BreadcrumbList` structured data, and their own sitemaps.
  Places come from GeoNames; Arabic and French city names are committed as
  `lib/city-names.json`
- Reusable form primitives (`Button`, `Input`, `Select`, `Checkbox`, `Field`)
- Skip-to-content link and installable PWA icons
- CI workflow (lint, typecheck, build) and contributor documentation
