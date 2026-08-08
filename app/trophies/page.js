"use client";

import { useMemo, useState } from "react";
import trophies from "@/data/trophies.json";
import {
  filterTrophies,
  trophyTotal,
  getYearsSorted,
  getSeasonsSorted,
  getUniqueValues,
} from "@/lib/stats";

const DEFAULT_FILTERS = {
  year: "All",
  season: "All",
  club: "All",
  competition: "All",
  domestic: "All",
  includeFriendlies: false,
};

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

export default function TrophiesPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const years = useMemo(() => getYearsSorted(trophies), []);
  const seasons = useMemo(() => getSeasonsSorted(trophies), []);
  const clubs = useMemo(() => getUniqueValues(trophies, "club"), []);
  const competitions = useMemo(() => getUniqueValues(trophies, "name"), []);

  const filtered = useMemo(
    () =>
      filterTrophies(trophies, filters).sort((a, b) => b.year - a.year),
    [filters]
  );

  const officialCount = useMemo(() => trophyTotal(filtered), [filtered]);
  const friendlyCount = filtered.filter((t) => t.isFriendly).length;

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Trophy cabinet
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        {officialCount} official trophies
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Filter by year, season, club, competition, or domestic vs.
        international. Friendly and exhibition trophies are shown separately
        and never count toward the official total.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-pitch-raised p-5 sm:grid-cols-3 lg:grid-cols-5">
        <Select
          label="Year"
          value={filters.year}
          onChange={(v) => updateFilter("year", v)}
          options={years}
        />
        <Select
          label="Season"
          value={filters.season}
          onChange={(v) => updateFilter("season", v)}
          options={seasons}
        />
        <Select
          label="Club"
          value={filters.club}
          onChange={(v) => updateFilter("club", v)}
          options={clubs}
        />
        <Select
          label="Competition"
          value={filters.competition}
          onChange={(v) => updateFilter("competition", v)}
          options={competitions}
        />
        <Select
          label="Domestic"
          value={filters.domestic}
          onChange={(v) => updateFilter("domestic", v)}
          options={["Domestic", "International"]}
        />
        <label className="col-span-2 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-paper-dim sm:col-span-1">
          <input
            type="checkbox"
            checked={filters.includeFriendlies}
            onChange={(e) =>
              updateFilter("includeFriendlies", e.target.checked)
            }
            className="accent-[color:var(--gold)]"
          />
          Include friendlies
        </label>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper"
        >
          Reset filters
        </button>
      </div>

      {filters.includeFriendlies && (
        <p className="mt-4 font-mono text-xs text-paper-dim">
          Showing {friendlyCount} friendly/exhibition{" "}
          {friendlyCount === 1 ? "trophy" : "trophies"} below, marked and
          excluded from the count above.
        </p>
      )}

      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-pitch-raised">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-paper">{t.name}</span>
                {t.isFriendly && (
                  <span className="rounded-full border border-goal-red px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-goal-red">
                    Friendly — not counted
                  </span>
                )}
                <span className="rounded-full bg-pitch px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                  {t.domestic ? "Domestic" : "International"}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-paper-dim">
                {t.club} · {t.season}
              </p>
              {t.notes && (
                <p className="mt-1 text-xs text-paper-dim/80">{t.notes}</p>
              )}
            </div>
            <span className="stat-number text-2xl text-gold">{t.year}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-paper-dim">
            No trophies fit these filters. Try resetting them.
          </p>
        )}
      </div>
    </div>
  );
}