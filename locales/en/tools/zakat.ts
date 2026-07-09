export const zakat = {
  meta: {
    title: "Zakat Calculator — calculate 2.5% on cash, gold & savings",
    description:
      "Free Zakat calculator: work out the 2.5% due on your cash, gold, silver, investments and business assets against the gold or silver nisab, with a full guide. Private, in your browser, no ads.",
  },
  title: "Zakat Calculator",
  side: "حاسبة الزكاة",
  intro:
    "Add up your zakatable wealth, compare it with the nisab, and get the 2.5% due — all computed on your device. Nothing you type is sent anywhere.",
  currency: "Currency",
  cash: "Cash & bank balances",
  goldGrams: "Gold (grams)",
  goldPrice: (c: string) => `Gold price per gram (${c})`,
  goldPriceHint: "Check today's price with your local dealer.",
  silverGrams: "Silver (grams)",
  silverPrice: (c: string) => `Silver price per gram (${c})`,
  investments: "Investments & shares",
  investmentsHint: "Stocks, funds, crypto held for gain.",
  business: "Business assets",
  businessHint: "Trade goods and receivables.",
  liabilities: "Short-term liabilities",
  liabilitiesHint: "Debts due now — subtracted from the total.",
  nisabBasis: "Nisab basis",
  nisabHint: "The silver nisab is lower; many scholars prefer it so more zakat reaches the poor.",
  silverOpt: (g: number) => `Silver (${g} g)`,
  goldOpt: (g: number) => `Gold (${g} g)`,
  totalWealth: "Zakatable wealth",
  nisabLabel: (basis: string) => `Nisab (${basis})`,
  basisNames: { gold: "gold", silver: "silver" },
  due: "Zakat due (2.5%)",
  belowNisab: "Your wealth is below the nisab — no zakat is due. Voluntary charity (sadaqah) is always rewarded.",
  reset: "Reset",
  nisabProgress: "Progress to nisab",
  assetsHeading: "Your assets",
  deductionsHeading: "Deductions & nisab",
  disclaimer:
    "Zakat is due after one lunar year (hawl) above the nisab. This calculator covers the common cases; for complex holdings, ask a qualified scholar.",
  faqEyebrow: "Zakat FAQ",
  faqH2: "Common Zakat questions",
  faq: [
    {
      q: "How much Zakat do I pay?",
      a: "Zakat is 2.5% (one-fortieth) of your total zakatable wealth, once it has remained above the nisab for a full lunar year.",
    },
    {
      q: "Do I pay Zakat on my salary?",
      a: "Not on income as you earn it, but on the savings you still hold when your Zakat year completes. Whatever you spend or give during the year is not counted — only what remains above the nisab.",
    },
    {
      q: "Is there Zakat on gold jewellery I wear?",
      a: "Scholars differ. Many hold that gold and silver are always zakatable, even when worn; others exempt jewellery in regular use. Follow the position of a scholar you trust.",
    },
    {
      q: "Should I use the gold or the silver nisab?",
      a: "Either is valid, but the silver nisab is lower, so using it means Zakat is due on smaller wealth — which benefits the poor. This calculator lets you choose.",
    },
    {
      q: "Do I subtract my debts?",
      a: "Yes — immediate, short-term debts due now are subtracted before comparing with the nisab. Long-term debts such as a mortgage are usually not deducted in full; ask a scholar about your case.",
    },
  ],
};
