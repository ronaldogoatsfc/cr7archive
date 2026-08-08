"use client";

import { useMemo, useState } from "react";
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

export default function HonorsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

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

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Individual honors & awards
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        {filtered.length} honors logged
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Filter by year, season, club, award, or domestic vs. international
        recognition.
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
          label="Award"
          value={filters.award}
          onChange={(v) => updateFilter("award", v)}
          options={awards}
        />
        <Select
          label="Domestic"
          value={filters.domestic}
          onChange={(v) => updateFilter("domestic", v)}
          options={["Domestic", "International"]}
        />
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper sm:col-span-1"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-pitch-raised">
        {filtered.map((h) => (
          <div
            key={h.id}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-paper">{h.name}</span>
                <span className="rounded-full bg-pitch px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                  {h.category}
                </span>
                <span className="rounded-full bg-pitch px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                  {h.domestic ? "Domestic" : "International"}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-paper-dim">
                {h.club} · {h.season}
              </p>
              {h.notes && (
                <p className="mt-1 text-xs text-paper-dim/80">{h.notes}</p>
              )}
            </div>
            <span className="stat-number text-2xl text-gold">{h.year}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-paper-dim">
            No honors fit these filters. Try resetting them.
          </p>
        )}
      </div>
    </div>
  );
}