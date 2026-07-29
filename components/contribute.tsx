"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDict } from "@/components/locale";
import {
  brandCls,
  btnGhost,
  btnPrimary,
  Eyebrow,
  GITHUB_URL,
  goldCls,
  lineCls,
  mutedCls,
  Reveal,
  StarField,
} from "@/components/ui";
import type { Community, Contributor } from "@/lib/github";

/** Where each way to help actually lands. Keyed off `contributions[].key` in
 * the dictionaries; `share` has no URL because it opens the share sheet. */
const WAY_LINKS: Record<string, string> = {
  code: `${GITHUB_URL}/blob/main/CONTRIBUTING.md`,
  translate: `${GITHUB_URL}/tree/main/locales`,
  bugs: `${GITHUB_URL}/issues/new`,
  docs: `${GITHUB_URL}/blob/main/README.md`,
};

/** Keeps the colonnade to one comfortable wall; the rest are one click away. */
const MAX_FACES = 23;

const wayCls = `group flex h-full items-center gap-3.5 rounded-2xl border ${lineCls} bg-white px-4 py-3.5 text-start transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:shadow-[0_14px_30px_-22px_rgba(4,120,87,0.5)] dark:bg-zinc-900/60 dark:hover:border-emerald-400/50`;

/** Every face sits in its own arch — the same mihrab silhouette the tool
 * icons use, turned into a colonnade of the people who built the thing. */
function Niche({ person }: { person: Contributor }) {
  const d = useDict();
  return (
    <a
      href={person.profileUrl}
      target="_blank"
      rel="noreferrer"
      title={`@${person.login}`}
      className="group flex w-20 flex-col items-center text-center sm:w-24"
    >
      <span
        className={`relative block h-24 w-20 overflow-hidden rounded-t-full rounded-b-lg border ${lineCls} bg-white transition-[transform,border-color,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:border-emerald-600 group-hover:shadow-[0_16px_30px_-18px_rgba(4,120,87,0.55)] dark:bg-zinc-900 dark:group-hover:border-emerald-400`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: avatars are remote and already CDN-sized via ?s=160 */}
        <img
          src={person.avatarUrl}
          alt=""
          width={160}
          height={160}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="size-full object-cover"
        />
      </span>
      <span className="mt-2.5 w-full truncate text-xs font-semibold transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
        @{person.login}
      </span>
      <span className={`font-mono text-[11px] ${mutedCls}`}>
        {d.home.commits(person.contributions)}
      </span>
    </a>
  );
}

/** The empty arch at the end of the row. It is the invitation. */
function OpenNiche() {
  const d = useDict();
  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer"
      className="group flex w-20 flex-col items-center text-center sm:w-24"
    >
      <span className="grid h-24 w-20 place-items-center rounded-t-full rounded-b-lg border border-dashed border-emerald-600/45 text-emerald-700/70 transition-[transform,border-color,background-color] duration-300 group-hover:-translate-y-1 group-hover:border-emerald-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-400/70 dark:group-hover:border-emerald-400 dark:group-hover:bg-emerald-500/10 dark:group-hover:text-emerald-400">
        <Icon icon="ph:plus" className="size-5" />
      </span>
      <span className="mt-2.5 w-full text-xs font-semibold transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
        {d.home.joinTitle}
      </span>
      <span className={`font-mono text-[11px] ${mutedCls}`}>{d.home.joinHint}</span>
    </a>
  );
}

/** One pill of repo vitals, in the same shape as the Hijri date on the home
 * hero. Renders nothing when the build had no network to read them with. */
function Vitals({ community }: { community: Community }) {
  const d = useDict();
  const { stars, forks, contributors } = community;
  if (stars === null && forks === null && contributors.length === 0) return null;

  const items = [
    stars !== null && { icon: "ph:star-fill", value: stars, label: d.home.statStars, gold: true },
    forks !== null && { icon: "ph:git-fork", value: forks, label: d.home.statForks },
    contributors.length > 0 && {
      icon: "ph:users-three",
      value: contributors.length,
      label: d.home.statPeople,
    },
  ].filter(Boolean) as { icon: string; value: number; label: string; gold?: boolean }[];

  return (
    <p
      className={`inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-full border ${lineCls} bg-zinc-50 px-5 py-2.5 font-mono text-xs dark:bg-zinc-900/60`}
    >
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          <Icon icon={it.icon} className={`size-3.5 ${it.gold ? goldCls : brandCls}`} />
          <span className="font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
            {it.value}
          </span>
          <span className={mutedCls}>{it.label}</span>
        </span>
      ))}
    </p>
  );
}

/** The closing invitation, shared by the home and About pages: why to help,
 * the concrete ways to do it, and the people who already did. */
export function Contribute({ community }: { community: Community }) {
  const d = useDict();
  const [copied, setCopied] = useState(false);
  const faces = community.contributors.slice(0, MAX_FACES);
  const rest = community.contributors.length - faces.length;

  async function share() {
    const url = window.location.origin;
    if (navigator.share) {
      // A cancelled share sheet rejects — that isn't a failure worth reporting.
      try {
        await navigator.share({ title: d.common.tagline, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <section id="contribute" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <Eyebrow>{d.home.contributeEyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl">{d.home.contributeH2}</h2>
            <p className={`mt-4 leading-relaxed ${mutedCls}`}>{d.home.contributeP}</p>
          </Reveal>
          <Reveal i={1} className="lg:pb-1">
            <Vitals community={community} />
          </Reveal>
        </div>

        {/* the concrete ways in — every one of them a real destination */}
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {d.home.contributions.map((c, i) => (
            <li key={c.key} className="h-full">
              <Reveal i={i % 3} className="h-full">
                {c.key === "share" ? (
                  <button type="button" onClick={share} className={`w-full ${wayCls}`}>
                    <Icon icon={c.icon} className={`size-5 shrink-0 ${brandCls}`} />
                    <span className="text-sm font-medium">
                      {copied ? d.home.shareCopied : c.label}
                    </span>
                    <Icon
                      icon={copied ? "ph:check" : "ph:share-network"}
                      className={`ms-auto size-4 shrink-0 transition-colors ${copied ? brandCls : mutedCls} group-hover:text-emerald-700 dark:group-hover:text-emerald-400`}
                    />
                  </button>
                ) : (
                  <a
                    href={WAY_LINKS[c.key]}
                    target="_blank"
                    rel="noreferrer"
                    className={wayCls}
                  >
                    <Icon icon={c.icon} className={`size-5 shrink-0 ${brandCls}`} />
                    <span className="text-sm font-medium">{c.label}</span>
                    <Icon
                      icon="ph:arrow-up-right"
                      className={`ms-auto size-4 shrink-0 ${mutedCls} transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-700 rtl:-scale-x-100 dark:group-hover:text-emerald-400`}
                    />
                  </a>
                )}
              </Reveal>
            </li>
          ))}
        </ul>

        {/* the colonnade */}
        <Reveal className="mt-12">
          <div
            className={`relative overflow-hidden rounded-3xl border ${lineCls} bg-zinc-50 px-6 py-8 sm:px-10 sm:py-10 dark:bg-zinc-900/50`}
          >
            <StarField className="pointer-events-none absolute -top-14 -right-14 size-72 text-emerald-700/6 dark:text-emerald-400/8" />

            <div className="relative">
              <h3 className="font-display text-xl sm:text-2xl">{d.home.contributorsTitle}</h3>
              <p className={`mt-2 max-w-xl text-sm leading-relaxed ${mutedCls}`}>
                {d.home.contributorsP}
              </p>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-7">
                {faces.map((person) => (
                  <Niche key={person.login} person={person} />
                ))}
                <OpenNiche />
                {rest > 0 ? (
                  <a
                    href={`${GITHUB_URL}/graphs/contributors`}
                    target="_blank"
                    rel="noreferrer"
                    className={`grid h-24 w-20 place-items-center self-start rounded-t-full rounded-b-lg border ${lineCls} font-mono text-sm font-semibold transition-colors hover:border-emerald-600 hover:text-emerald-700 dark:hover:border-emerald-400 dark:hover:text-emerald-400`}
                  >
                    +{rest}
                  </a>
                ) : null}
              </div>

              <div className={`mt-9 flex flex-wrap gap-3 border-t ${lineCls} pt-8`}>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={btnPrimary}>
                  <Icon icon="ph:git-pull-request" className="size-4" />
                  {d.home.contributeCta}
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className={btnGhost}>
                  <Icon icon="ph:star" className="size-4" />
                  {d.home.contributeStar}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
