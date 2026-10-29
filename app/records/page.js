"use client";

import { useMemo, useState } from "react";
import records from "@/data/records.json";
import matches from "@/data/all-matches";
import { filterRecords, getUniqueValues } from "@/lib/stats";

function goalsAfterAge(matches, minimumAge) {
  const birthYear = 1985;
  return matches.reduce((total, match) => {
    if (!match.date) return total;
    const [year, month, day] = match.date.split("-").map(Number);
    let age = year - birthYear;
    if (month < 2 || (month === 2 && day < 5)) age -= 1;
    return age >= minimumAge ? total + (match.goals || 0) : total;
  }, 0);
}

function countGoals(matches, predicate = () => true) {
  return matches.reduce(
    (total, match) => total + (predicate(match) ? match.goals || 0 : 0),
    0
  );
}

function getDynamicRecordNotes(record) {
  switch (record.id) {
    case "most-goals-official":
      return `${countGoals(matches).toLocaleString("en-US")} goals scored in official senior matches`;
    case "most-goals-after-turning-30":
      return `${goalsAfterAge(matches, 30).toLocaleString("en-US")} goals scored after turning 30 years old`;
    case "most-mens-international-goals-scored":
      return `${countGoals(matches, (match) => match.team === "Portugal").toLocaleString("en-US")} international goals`;
    case "real-madrid-all-time-top-goalscorer":
      return `${countGoals(matches, (match) => match.team === "Real Madrid").toLocaleString("en-US")} goals`;
    case "most-goals-uefa-champions-league":
      return `${countGoals(matches, (match) => /champions league|european cup/i.test(match.competition || "") && !/qualifying/i.test(match.competition || "")).toLocaleString("en-US")} goals`;
    default:
      return record.notes;
  }
}

const DEFAULT_FILTERS = {
  category: "All",
  club: "All",
  status: "All",
  search: "",
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

function RecordRow({ record }) {
  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-paper">{record.name}</span>
        <span className="rounded-full bg-pitch px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
          {record.category}
        </span>
      </div>
      <p className="mt-1 text-sm text-paper-dim">
        {[record.club, record.period].filter(Boolean).join(" · ")}
      </p>
      {record.notes && (
        <p className="mt-1 text-xs text-paper-dim/80">{record.notes}</p>
      )}
      {record.status === "Former" && record.brokenBy && (
        <p className="mt-2 font-mono text-xs text-goal-red">
          Broken by: {record.brokenBy}
        </p>
      )}
    </div>
  );
}

function RecordGroup({ title, items, emptyLabel }) {
  return (
    <div className="mt-10">
      <h2 className="font-display text-xl font-semibold text-paper">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-pitch-raised">
        {items.length > 0 ? (
          items.map((r) => <RecordRow key={r.id} record={r} />)
        ) : (
          <p className="px-5 py-8 text-center text-paper-dim">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const categories = useMemo(() => getUniqueValues(records, "category"), []);
  const clubs = useMemo(() => getUniqueValues(records, "club"), []);

  const recordsWithLiveCounts = useMemo(
    () =>
      records.map((record) => ({
        ...record,
        notes: getDynamicRecordNotes(record),
      })),
    []
  );

  const filtered = useMemo(
    () => filterRecords(recordsWithLiveCounts, filters),
    [filters, recordsWithLiveCounts]
  );

  const current = filtered.filter((r) => r.status === "Current");
  const former = filtered.filter((r) => r.status === "Former");

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Records
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        Career milestones & standout numbers
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Filter by category or club. Currently held and previously held
        records are listed separately below.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-pitch-raised p-5 sm:grid-cols-4">
        <Select
          label="Category"
          value={filters.category}
          onChange={(v) => updateFilter("category", v)}
          options={categories}
        />
        <Select
          label="Club"
          value={filters.club}
          onChange={(v) => updateFilter("club", v)}
          options={clubs}
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={(v) => updateFilter("status", v)}
          options={["Current", "Former"]}
        />
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            Search
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="e.g. goals"
            className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          />
        </label>
      </div>

      <RecordGroup
        title="Currently Held Records"
        items={current}
        emptyLabel="No current records match these filters."
      />
      <RecordGroup
        title="Previously Held Records"
        items={former}
        emptyLabel="No former records match these filters."
      />
    </div>
  );
}