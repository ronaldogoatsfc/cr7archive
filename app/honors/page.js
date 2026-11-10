"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import honors from "@/data/honors.json";
import {
  filterHonors,
  getYearsSorted,
  getSeasonsSorted,
  getUniqueValues,
} from "@/lib/stats";

const DEFAULT_FILTERS = {
  year: "All",
  season: "All",
  club: "All",
  award: "All",
  domestic: "All",
};

const CATEGORY_ORDER = [
  "Global Individual Award",
  "Continental Individual Award",
  "Domestic Individual Award",
  "National Team Award",
  "Individual Award",
  "Friendly Competition Award",
];

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <option value="All">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function HonorGroup({ category, items, onSelect }) {
  const groupedHonors = [...items.reduce((groups, honor) => {
    if (!groups.has(honor.name)) groups.set(honor.name, []);
    groups.get(honor.name).push(honor);
    return groups;
  }, new Map()).values()].map((group) => {
    const entries = group.sort((a, b) => {
      const aKey = a.date || `${a.year}-01-01`;
      const bKey = b.date || `${b.year}-01-01`;
      return aKey.localeCompare(bKey);
    });

    return {
      ...entries[0],
      entries,
      years: [...new Set(entries.map((honor) => honor.year))].sort((a, b) => a - b),
      clubs: [...new Set(entries.map((honor) => honor.club))],
      seasons: [...new Set(entries.map((honor) => honor.season))],
      notes: [...new Set(entries.map((honor) => honor.notes).filter(Boolean))],
      ids: entries.map((honor) => honor.id),
      count: entries.length,
    };
  }).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return Math.max(...b.years) - Math.max(...a.years);
  });

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-paper">
          {category}
        </h2>
        <span className="font-mono text-xs uppercase tracking-wider text-paper-dim">
          {items.length} {items.length === 1 ? "honor" : "honors"}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groupedHonors.map((honor) => (
          <article
            key={honor.name}
            id={`honor-${honor.ids[0]}`}
            role="button"
            tabIndex={0}
            aria-label={`View ${honor.name} wins`}
            onClick={() => onSelect(honor)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(honor);
              }
            }}
            className="scroll-mt-28 target:border-gold/80 flex min-h-48 cursor-pointer flex-col rounded-2xl border border-line bg-pitch-raised p-5 text-left transition hover:border-gold/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            {honor.ids.slice(1).map((id) => <span key={id} id={`honor-${id}`} className="scroll-mt-28" />)}
            <div className="flex items-start justify-between gap-3">
              <span className="font-display text-lg font-semibold leading-snug text-paper">
                {honor.name}
              </span>
              {honor.count > 1 && (
                <span className="shrink-0 rounded-full bg-pitch px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-gold">
                  {honor.count} wins
                </span>
              )}
            </div>
            <p className="stat-number mt-3 text-xl leading-relaxed text-gold">
              {honor.years.join(" · ")}
            </p>
            {honor.notes.length > 0 && (
              <p className="mt-2 text-xs leading-relaxed text-paper-dim">
                {honor.notes.join(" · ")}
              </p>
            )}
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-xs text-paper-dim">{honor.clubs.join(" · ")}</p>
              <p className="mt-1 text-xs text-paper-dim/80">{honor.seasons.join(" · ")}</p>
            </div>
            <span className="mt-auto border-t border-line pt-4 text-sm font-semibold text-gold">
              View wins <span aria-hidden="true">→</span>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function HonorDetailsModal({ honor, onClose }) {
  if (!honor) return null;

  const wins = honors
    .filter((entry) => entry.name === honor.name)
    .sort((a, b) => {
      const aKey = a.date || `${a.year}-01-01`;
      const bKey = b.date || `${b.year}-01-01`;
      return aKey.localeCompare(bKey);
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="honor-modal-title"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-pitch-raised p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
              Individual honor
            </p>
            <h2 id="honor-modal-title" className="mt-2 font-display text-2xl font-semibold text-paper">
              {honor.name}
            </h2>
            <p className="mt-1 text-sm text-paper-dim">
              {wins.length} {wins.length === 1 ? "recorded win" : "recorded wins"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close honor details"
            className="rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:border-gold hover:text-paper"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 divide-y divide-line border-y border-line">
          {wins.map((win) => (
            <div key={win.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-xl font-semibold text-gold">{win.year}</p>
                <p className="mt-1 text-sm text-paper">{win.season}</p>
                <p className="mt-1 text-xs text-paper-dim">{win.club}</p>
                {win.notes && <p className="mt-2 text-xs leading-relaxed text-paper-dim">{win.notes}</p>}
              </div>
              {win.articleSlug ? (
                <Link
                  href={`/articles/${win.articleSlug}`}
                  onClick={onClose}
                  className="shrink-0 text-sm font-semibold text-gold transition hover:text-gold-bright"
                >
                  Read article <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="shrink-0 text-xs text-paper-dim">No article yet</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line px-4 py-2 text-sm text-paper-dim transition hover:border-gold hover:text-paper"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default function HonorsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedHonor, setSelectedHonor] = useState(null);

  useEffect(() => {
    if (!selectedHonor) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") setSelectedHonor(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedHonor]);

  const years = useMemo(() => getYearsSorted(honors), []);
  const seasons = useMemo(() => getSeasonsSorted(honors), []);
  const clubs = useMemo(() => getUniqueValues(honors, "club"), []);
  const awards = useMemo(() => getUniqueValues(honors, "name"), []);

  const filtered = useMemo(
    () =>
      filterHonors(honors, filters).sort((a, b) => {
        const aKey = a.date || `${a.year}-01-01`;
        const bKey = b.date || `${b.year}-01-01`;
        return bKey.localeCompare(aKey);
      }),
    [filters]
  );

  const grouped = useMemo(() => {
    const groups = new Map();
    for (const honor of filtered) {
      if (!groups.has(honor.category)) groups.set(honor.category, []);
      groups.get(honor.category).push(honor);
    }
    return [...groups.entries()].sort(([a], [b]) => {
      const aIndex = CATEGORY_ORDER.indexOf(a);
      const bIndex = CATEGORY_ORDER.indexOf(b);
      return (aIndex === -1 ? CATEGORY_ORDER.length : aIndex) -
        (bIndex === -1 ? CATEGORY_ORDER.length : bIndex);
    });
  }, [filtered]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Individual honors & awards
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        {filtered.length} honors logged
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Filter by year, season, club, award, or domestic vs. international
        recognition. Honors are grouped by award type within global, continental, and domestic award levels.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-pitch-raised p-5 sm:grid-cols-3 lg:grid-cols-5">
        <Select label="Year" value={filters.year} onChange={(v) => updateFilter("year", v)} options={years} />
        <Select label="Season" value={filters.season} onChange={(v) => updateFilter("season", v)} options={seasons} />
        <Select label="Club" value={filters.club} onChange={(v) => updateFilter("club", v)} options={clubs} />
        <Select label="Award" value={filters.award} onChange={(v) => updateFilter("award", v)} options={awards} />
        <Select label="Domestic" value={filters.domestic} onChange={(v) => updateFilter("domestic", v)} options={["Domestic", "International"]} />
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper sm:col-span-1"
        >
          Reset filters
        </button>
      </div>

      {grouped.length > 0 ? (
        grouped.map(([category, items]) => <HonorGroup key={category} category={category} items={items} onSelect={setSelectedHonor} />)
      ) : (
        <div className="mt-6 rounded-2xl border border-line bg-pitch-raised px-5 py-10 text-center text-paper-dim">
          No honors fit these filters. Try resetting them.
        </div>
      )}
      <HonorDetailsModal honor={selectedHonor} onClose={() => setSelectedHonor(null)} />
    </div>
  );
}