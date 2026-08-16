"use client";

import { useMemo, useState } from "react";
import records from "@/data/records.json";
import { filterRecords, getUniqueValues } from "@/lib/stats";

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
        {record.club} · {record.period}
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

  const filtered = useMemo(() => filterRecords(records, filters), [filters]);

  const current = filtered.filter((r) => r.status === "Current");
  const former = filtered.filter((r) => r.status === "Former");

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
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