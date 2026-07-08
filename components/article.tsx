import { Eyebrow, Star8, goldCls, mutedCls } from "@/components/ui";

export type ArticleSection = {
  /** Section heading. */
  h: string;
  /** Body paragraphs. */
  p?: string[];
  /** Optional bullet list rendered under the paragraphs. */
  list?: string[];
};

/** Renders long-form, markdown-style educational content as clean prose —
 * headings, paragraphs and star-marked lists — matching the site's type. */
export function Article({
  eyebrow,
  heading,
  intro,
  sections,
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
  sections: ArticleSection[];
}) {
  return (
    <section className="mt-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 font-display text-2xl sm:text-3xl">{heading}</h2>
      {intro ? (
        <p className={`mt-4 max-w-3xl leading-relaxed ${mutedCls}`}>{intro}</p>
      ) : null}
      <div className="mt-8 max-w-3xl space-y-8">
        {sections.map((s) => (
          <div key={s.h}>
            <h3 className="font-display text-xl">{s.h}</h3>
            {s.p?.map((para, i) => (
              <p key={i} className={`mt-2 leading-relaxed ${mutedCls}`}>
                {para}
              </p>
            ))}
            {s.list ? (
              <ul className="mt-3 space-y-2">
                {s.list.map((li) => (
                  <li key={li} className="flex gap-2.5">
                    <Star8 className={`mt-1 size-3.5 shrink-0 ${goldCls}`} />
                    <span className={`leading-relaxed ${mutedCls}`}>{li}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
