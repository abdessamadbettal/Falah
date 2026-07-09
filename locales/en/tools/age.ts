export const age = {
  meta: {
    title: "Hijri Age Calculator — your age in the Islamic calendar",
    description:
      "Convert your date of birth to the Hijri calendar, get your exact Hijri age, your next Hijri birthday, and Islamic milestones. Computed on your device.",
  },
  title: "Hijri Age Calculator",
  side: "العمر الهجري",
  intro:
    "Your exact age in the Islamic calendar, your next Hijri birthday, and milestones along the way — computed on your device.",
  dob: "Date of birth (Gregorian)",
  hijriAge: "Hijri age",
  gregAge: "Gregorian age",
  born: "Born",
  shorterYear: "The Hijri year is ~11 days shorter, so your Hijri age runs ahead.",
  nextBirthday: "Next Hijri birthday",
  todayBirthday: "Today — happy Hijri birthday!",
  inDays: (date: string, days: number) => `${date} · in ${days} days`,
  hijriYears: (n: number) => `${n} Hijri years`,
  milestones: [
    "Around the age of legal maturity (bulugh) in many schools",
    "The age at which the Prophet ﷺ received revelation",
    "The Prophet's ﷺ age at passing — a reminder to increase good deeds",
  ],
  prompt: "Enter your date of birth to see your Hijri age.",
};
