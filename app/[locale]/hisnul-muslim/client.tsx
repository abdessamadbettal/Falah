"use client";

import { useState } from "react";
import { useDict, useLocale } from "@/components/locale";
import { ToolShell, cardCls, goldCls, lineCls, mutedCls } from "@/components/ui";

type Dua = { arabic: string; translation: string; translationFr: string; source: string };

// Category order matches dict.tools.hisnul.categories.
const DUAS: Dua[][] = [
  [
    {
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      translation:
        "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and promise as far as I am able. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me — for none forgives sins but You. (Sayyid al-Istighfar)",
      translationFr:
        "Ô Allah, Tu es mon Seigneur ; il n'y a de divinité que Toi. Tu m'as créé et je suis Ton serviteur, fidèle autant que je le puis à Ton pacte et à Ta promesse. Je me réfugie auprès de Toi contre le mal que j'ai commis. Je reconnais Ton bienfait envers moi et je reconnais mon péché : pardonne-moi, car nul ne pardonne les péchés sauf Toi. (Sayyid al-Istighfar)",
      source: "Al-Bukhari",
    },
    {
      arabic:
        "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      translation:
        "We have entered the morning, and the dominion has entered it belonging to Allah. Praise is to Allah; there is no god but Allah alone, without partner. (In the evening: 'Amsayna wa-amsal-mulku lillah…')",
      translationFr:
        "Nous voici au matin, et la royauté appartient à Allah. Louange à Allah ; il n'y a de divinité qu'Allah, Seul, sans associé. (Le soir : « Amsayna wa-amsal-moulkou lillah… »)",
      source: "Muslim",
    },
  ],
  [
    {
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      translation: "In Your name, O Allah, I die and I live.",
      translationFr: "En Ton nom, ô Allah, je meurs et je vis.",
      source: "Al-Bukhari",
    },
    {
      arabic:
        "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
      translation:
        "Praise is to Allah who gave us life after having taken it from us, and to Him is the resurrection.",
      translationFr:
        "Louange à Allah qui nous a rendu la vie après nous l'avoir reprise, et c'est vers Lui que se fera la résurrection.",
      source: "Al-Bukhari",
    },
  ],
  [
    {
      arabic:
        "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      translation:
        "In the name of Allah, I place my trust in Allah; there is no might nor power except with Allah. (On leaving home)",
      translationFr:
        "Au nom d'Allah, je place ma confiance en Allah ; il n'y a de force ni de puissance qu'en Allah. (En sortant de chez soi)",
      source: "Abu Dawud, At-Tirmidhi",
    },
    {
      arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
      translation: "O Allah, open for me the doors of Your mercy. (On entering the mosque)",
      translationFr: "Ô Allah, ouvre-moi les portes de Ta miséricorde. (En entrant à la mosquée)",
      source: "Muslim",
    },
    {
      arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
      translation: "O Allah, I ask You of Your bounty. (On leaving the mosque)",
      translationFr: "Ô Allah, je Te demande de Ta grâce. (En sortant de la mosquée)",
      source: "Muslim",
    },
  ],
  [
    {
      arabic: "بِسْمِ اللَّهِ — وَإِنْ نَسِيتَ: بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
      translation:
        "In the name of Allah. If you forget at the start: 'In the name of Allah, at its beginning and its end.'",
      translationFr:
        "Au nom d'Allah. En cas d'oubli au début : « Au nom d'Allah, à son début et à sa fin. »",
      source: "Abu Dawud, At-Tirmidhi",
    },
    {
      arabic:
        "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
      translation:
        "Praise is to Allah who fed me this and provided it for me without any might or power on my part. (After eating)",
      translationFr:
        "Louange à Allah qui m'a nourri de ceci et me l'a accordé sans force ni puissance de ma part. (Après le repas)",
      source: "Abu Dawud, At-Tirmidhi, Ibn Majah",
    },
  ],
  [
    {
      arabic:
        "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
      translation:
        "There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Mighty Throne. There is no god but Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
      translationFr:
        "Il n'y a de divinité qu'Allah, l'Immense, le Très Indulgent. Il n'y a de divinité qu'Allah, Seigneur du Trône immense. Il n'y a de divinité qu'Allah, Seigneur des cieux, Seigneur de la terre et Seigneur du noble Trône.",
      source: "Al-Bukhari, Muslim",
    },
    {
      arabic:
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
      translation:
        "O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from miserliness and cowardice, from the burden of debt and from being overpowered by men.",
      translationFr:
        "Ô Allah, je me réfugie auprès de Toi contre le souci et la tristesse, l'incapacité et la paresse, l'avarice et la lâcheté, le poids de la dette et la domination des hommes.",
      source: "Al-Bukhari",
    },
  ],
  [
    {
      arabic:
        "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
      translation:
        "Glory to Him who has subjected this to us, and we could never have it by our own efforts. Surely, to our Lord we are returning.",
      translationFr:
        "Gloire à Celui qui a mis ceci à notre service alors que nous n'étions pas capables de le dominer. Et c'est vers notre Seigneur que nous retournerons.",
      source: "Muslim (Quran 43:13–14)",
    },
  ],
];

export default function HisnulMuslimClient() {
  const d = useDict();
  const t = d.tools.hisnul;
  const locale = useLocale();
  const [active, setActive] = useState(0);

  return (
    <ToolShell icon="ph:hands-praying" title={t.title} side={t.side} intro={t.intro} wide>
      <div className="flex flex-wrap gap-2">
        {t.categories.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              i === active
                ? "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-emerald-950"
                : `${lineCls} hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {DUAS[active].map((dua, i) => (
          <article key={i} className={`${cardCls} p-6`}>
            <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose">
              {dua.arabic}
            </p>
            {locale !== "ar" ? (
              <p className={`mt-4 border-t ${lineCls} pt-4 text-sm leading-relaxed ${mutedCls}`}>
                {locale === "fr" ? dua.translationFr : dua.translation}
              </p>
            ) : null}
            <p className={`mt-2 text-xs font-semibold uppercase tracking-wide ${goldCls}`}>
              {dua.source}
            </p>
          </article>
        ))}
      </div>
    </ToolShell>
  );
}
