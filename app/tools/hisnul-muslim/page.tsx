"use client";

import { useState } from "react";
import { ToolShell, cardCls, goldCls, lineCls, mutedCls } from "@/components/ui";

type Dua = { arabic: string; translation: string; source: string };
type DuaCategory = { label: string; icon?: string; duas: Dua[] };

const CATEGORIES: DuaCategory[] = [
  {
    label: "Morning & evening",
    duas: [
      {
        arabic:
          "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        translation:
          "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and promise as far as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me — for none forgives sins but You. (Sayyid al-Istighfar)",
        source: "Al-Bukhari",
      },
      {
        arabic:
          "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        translation:
          "We have entered the morning, and the dominion has entered it belonging to Allah. Praise is to Allah; there is no god but Allah alone, without partner. (In the evening: 'Amsayna wa-amsal-mulku lillah…')",
        source: "Muslim",
      },
    ],
  },
  {
    label: "Sleep & waking",
    duas: [
      {
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        translation: "In Your name, O Allah, I die and I live.",
        source: "Al-Bukhari",
      },
      {
        arabic:
          "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        translation:
          "Praise is to Allah who gave us life after having taken it from us, and to Him is the resurrection.",
        source: "Al-Bukhari",
      },
    ],
  },
  {
    label: "Home & mosque",
    duas: [
      {
        arabic:
          "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        translation:
          "In the name of Allah, I place my trust in Allah; there is no might nor power except with Allah. (On leaving home)",
        source: "Abu Dawud, At-Tirmidhi",
      },
      {
        arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        translation: "O Allah, open for me the doors of Your mercy. (On entering the mosque)",
        source: "Muslim",
      },
      {
        arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        translation: "O Allah, I ask You of Your bounty. (On leaving the mosque)",
        source: "Muslim",
      },
    ],
  },
  {
    label: "Food",
    duas: [
      {
        arabic: "بِسْمِ اللَّهِ — وَإِنْ نَسِيتَ: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
        translation:
          "In the name of Allah. If you forget at the start: 'In the name of Allah, at its beginning and its end.'",
        source: "Abu Dawud, At-Tirmidhi",
      },
      {
        arabic:
          "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        translation:
          "Praise is to Allah who fed me this and provided it for me without any might or power on my part. (After eating)",
        source: "Abu Dawud, At-Tirmidhi, Ibn Majah",
      },
    ],
  },
  {
    label: "Distress & anxiety",
    duas: [
      {
        arabic:
          "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
        translation:
          "There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Mighty Throne. There is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
        source: "Al-Bukhari, Muslim",
      },
      {
        arabic:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        translation:
          "O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by men.",
        source: "Al-Bukhari",
      },
    ],
  },
  {
    label: "Travel",
    duas: [
      {
        arabic:
          "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        translation:
          "Glory to Him who has subjected this to us, and we could never have it by our own efforts. Surely, to our Lord we are returning.",
        source: "Muslim (Quran 43:13–14)",
      },
    ],
  },
];

export default function HisnulMuslimPage() {
  const [active, setActive] = useState(0);
  const category = CATEGORIES[active];

  return (
    <ToolShell
      icon="ph:hands-praying"
      title="Hisnul Muslim"
      arabic="حصن المسلم"
      intro="Authentic daily supplications from the Fortress of the Muslim, organized by moment of the day. A growing selection — all embedded, all offline."
      wide
    >
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c, i) => (
          <button
            key={c.label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              i === active
                ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                : `${lineCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {category.duas.map((dua, i) => (
          <article key={i} className={`${cardCls} p-6`}>
            <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose">
              {dua.arabic}
            </p>
            <p className={`mt-4 border-t ${lineCls} pt-4 text-sm leading-relaxed ${mutedCls}`}>
              {dua.translation}
            </p>
            <p className={`mt-2 text-xs font-semibold uppercase tracking-wide ${goldCls}`}>
              {dua.source}
            </p>
          </article>
        ))}
      </div>
    </ToolShell>
  );
}
