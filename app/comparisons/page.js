"use client";

import { useMemo, useState } from "react";
import { Plus, X, CalendarRange, Info } from "lucide-react";
import matches from "@/data/all-matches";

const COLORS = [
  { name: "A", label: "Comparison A", bar: "#e05260", soft: "border-[#e05260]/40", text: "text-[#e05260]", panel: "bg-[#351e25]" },
  { name: "B", label: "Comparison B", bar: "#5599ed", soft: "border-[#5599ed]/40", text: "text-[#5599ed]", panel: "bg-[#192d47]" },
];
const FILTERS = [
  { key: "team", label: "Team" },
  { key: "competition", label: "Competition" },
  { key: "season", label: "Season" },
  { key: "year", label: "Calendar year" },
];
const STAT_GROUPS = [
  { title: "Scoring & appearances", stats: [
    { key: "matches", label: "Appearances", type: "count" },
    { key: "goals", label: "Goals", type: "count" },
    { key: "assists", label: "Assists", type: "count" },
    { key: "goalsPer90", label: "Goals per 90", type: "rate" },
    { key: "assistsPer90", label: "Assists per 90", type: "rate" },
    { key: "minutes", label: "Minutes played", type: "count" },
  ]},
  { title: "Shooting & creativity", stats: [
    { key: "shots", label: "Shots", type: "sum" },
    { key: "shotsOnTarget", label: "Shots on target", type: "sum" },
    { key: "keyPasses", label: "Key passes", type: "sum" },
    { key: "bigChancesCreated", label: "Big chances created", type: "sum" },
    { key: "successfulDribbles", label: "Successful dribbles", type: "sum" },
    { key: "accurateThroughballs", label: "Accurate throughballs", type: "sum" },
  ]},
  { title: "Other performance statistics", stats: [
    { key: "aerialDuelsWon", label: "Aerial duels won", type: "sum" },
    { key: "freeKickAttempts", label: "Free-kick attempts", type: "sum" },
    { key: "xG", label: "Expected goals (xG)", type: "sum", decimals: 2 },
    { key: "xA", label: "Expected assists (xA)", type: "sum", decimals: 2 },
    { key: "rating", label: "Average rating", type: "average", decimals: 2 },
    { key: "motm", label: "Man of the Match awards", type: "motm" },
  ]},
];

const unique = (key) => [...new Set(matches.map((match) => match[key]).filter((value) => value !== null && value !== undefined && value !== ""))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
const TEAMS = unique("team");
const COMPETITIONS = unique("competition");
const SEASONS = unique("season");
const YEARS = [...new Set(matches.map((match) => match.date?.slice(0, 4)).filter(Boolean))].sort();

function emptySelection(label) {
  return { label, team: "All", competition: "All", season: "All", year: "All", startDate: "", endDate: "" };
}

function selectionMatches(selection) {
  return matches.filter((match) => {
    if (selection.team !== "All" && match.team !== selection.team) return false;
    if (selection.competition !== "All" && match.competition !== selection.competition) return false;
    if (selection.season !== "All" && match.season !== selection.season) return false;
    if (selection.year !== "All" && match.date?.slice(0, 4) !== selection.year) return false;
    if (selection.startDate && (!match.date || match.date < selection.startDate)) return false;
    if (selection.endDate && (!match.date || match.date > selection.endDate)) return false;
    return true;
  });
}

function aggregate(selection) {
  const selectedMatches = selectionMatches(selection);
  const total = (key) => selectedMatches.reduce((sum, match) => sum + (typeof match[key] === "number" ? match[key] : 0), 0);
  const statSum = (key) => {
    let value = 0;
    let recorded = 0;
    selectedMatches.forEach((match) => {
      const raw = match.stats?.[key];
      if (typeof raw === "number" && Number.isFinite(raw)) { value += raw; recorded += 1; }
    });
    return { value, recorded };
  };
  const minutes = total("minutesPlayed");
  const rating = statSum("rating");
  const values = {
    matches: selectedMatches.length,
    goals: total("goals"),
    assists: total("assists"),
    minutes,
    goalsPer90: minutes > 0 ? (total("goals") / minutes) * 90 : null,
    assistsPer90: minutes > 0 ? (total("assists") / minutes) * 90 : null,
    motm: selectedMatches.filter((match) => match.stats?.motm === true).length,
    rating: rating.recorded ? rating.value / rating.recorded : null,
  };
  const coverage = {
    matchesWithStats: selectedMatches.filter((match) => match.stats && typeof match.stats === "object").length,
    totalMatches: selectedMatches.length,
  };
  STAT_GROUPS.forEach((group) => group.stats.forEach((stat) => {
    if (["matches", "goals", "assists", "goalsPer90", "assistsPer90", "minutes", "rating", "motm"].includes(stat.key)) return;
    const result = statSum(stat.key);
    values[stat.key] = result.recorded ? result.value : null;
    values[stat.key + "Recorded"] = result.recorded;
  }));
  values.ratingRecorded = rating.recorded;
  values.motmRecorded = coverage.matchesWithStats;
  return { matches: selectedMatches, values, coverage };
}

function formatValue(value, stat) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  if (stat.decimals !== undefined) return value.toFixed(stat.decimals);
  if (stat.type === "rate") return value.toFixed(2);
  return Math.round(value).toLocaleString("en-US");
}

function describeSelection(selection) {
  const parts = [];
  if (selection.team !== "All") parts.push(selection.team);
  if (selection.competition !== "All") parts.push(selection.competition);
  if (selection.season !== "All") parts.push(selection.season);
  if (selection.year !== "All") parts.push(selection.year);
  if (selection.startDate || selection.endDate) parts.push(`${selection.startDate || "Start"} – ${selection.endDate || "Present"}`);
  return parts.length ? parts.join(" · ") : "Entire career";
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-line bg-pitch px-3 py-2.5 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
        <option value="All">Any {label.toLowerCase()}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ComparisonPanel({ selection, index, update, remove, canRemove }) {
  const color = COLORS[index];
  return (
    <section className={`rounded-2xl border ${color.soft} bg-pitch-raised p-4 sm:p-5`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color.bar }} />
          <h2 className="font-display text-lg font-semibold text-paper">{color.label}</h2>
        </div>
        {canRemove && <button type="button" onClick={remove} className="rounded-lg p-2 text-paper-dim transition hover:bg-pitch hover:text-paper" aria-label={`Remove ${color.label}`}><X size={16} /></button>}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FilterSelect label="Team" value={selection.team} options={TEAMS} onChange={(value) => update("team", value)} />
        <FilterSelect label="Competition" value={selection.competition} options={COMPETITIONS} onChange={(value) => update("competition", value)} />
        <FilterSelect label="Season" value={selection.season} options={SEASONS} onChange={(value) => update("season", value)} />
        <FilterSelect label="Calendar year" value={selection.year} options={YEARS} onChange={(value) => update("year", value)} />
      </div>
      <div className="mt-4 border-t border-line pt-4">
        <div className="mb-2 flex items-center gap-2 text-paper-dim"><CalendarRange size={14} /><span className="font-mono text-[10px] uppercase tracking-widest">Optional custom date range</span></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5"><span className="text-xs text-paper-dim">From</span><input type="date" value={selection.startDate} max={selection.endDate || undefined} onChange={(event) => update("startDate", event.target.value)} className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper" /></label>
          <label className="flex flex-col gap-1.5"><span className="text-xs text-paper-dim">Through</span><input type="date" value={selection.endDate} min={selection.startDate || undefined} onChange={(event) => update("endDate", event.target.value)} className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper" /></label>
        </div>
      </div>
      <p className="mt-4 text-sm text-paper-dim">{describeSelection(selection)}</p>
    </section>
  );
}

function ComparisonRow({ stat, values, labels }) {
  const a = values[0];
  const b = values[1];
  const aValid = typeof a === "number" && Number.isFinite(a);
  const bValid = typeof b === "number" && Number.isFinite(b);
  const max = Math.max(aValid ? a : 0, bValid ? b : 0);
  const aWidth = aValid && max > 0 ? (a / max) * 100 : 0;
  const bWidth = bValid && max > 0 ? (b / max) * 100 : 0;
  const tied = aValid && bValid && Math.abs(a - b) < 0.000001;
  const aWins = aValid && bValid && a > b;
  const bWins = aValid && bValid && b > a;
  const difference = aValid && bValid ? Math.abs(a - b) : null;
  const diffText = difference === null ? "Insufficient data" : tied ? "Tied" : `${aWins ? labels[0] : labels[1]} leads by ${formatValue(difference, stat)}`;
  return (
    <div className="border-t border-line/70 py-4 first:border-t-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-sm font-medium text-paper">{stat.label}</h4>
        <span className={`text-xs font-medium ${tied ? "text-paper-dim" : aWins ? "text-[#e05260]" : bWins ? "text-[#5599ed]" : "text-paper-dim"}`}>{diffText}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)] items-center gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-12 shrink-0 text-right font-mono text-sm font-semibold ${aWins ? "text-[#e05260]" : "text-paper"}`}>{formatValue(a, stat)}</span>
          <div className="flex h-3 flex-1 justify-end overflow-hidden rounded-l-sm bg-pitch">
            <div className="h-full rounded-l-sm bg-[#e05260]" style={{ width: `${aWidth}%`, opacity: aWins || !bWins ? 1 : 0.55 }} />
          </div>
        </div>
        <div className="h-6 bg-line" />
        <div className="flex items-center gap-2">
          <div className="flex h-3 flex-1 overflow-hidden rounded-r-sm bg-pitch">
            <div className="h-full rounded-r-sm bg-[#5599ed]" style={{ width: `${bWidth}%`, opacity: bWins || !aWins ? 1 : 0.55 }} />
          </div>
          <span className={`w-12 shrink-0 font-mono text-sm font-semibold ${bWins ? "text-[#5599ed]" : "text-paper"}`}>{formatValue(b, stat)}</span>
        </div>
      </div>
    </div>
  );
}

export default function ComparisonsPage() {
  const [selections, setSelections] = useState([emptySelection("A")]);
  const [showAll, setShowAll] = useState(true);
  const aggregates = useMemo(() => selections.map(aggregate), [selections]);
  const updateSelection = (index, key, value) => setSelections((current) => current.map((selection, i) => i === index ? { ...selection, [key]: value } : selection));
  const addSelection = () => {
    if (selections.length >= 2) return;
    setSelections((current) => [...current, emptySelection("B")]);
  };
  const removeSelection = (index) => setSelections((current) => current.filter((_, i) => i !== index));
  const ready = selections.length === 2;
  const labels = selections.map((selection, index) => `Ronaldo ${index === 0 ? "A" : "B"}`);
  const totalSelected = aggregates.map((aggregate) => aggregate.matches.length);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <div className="mb-8 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">Explore the numbers</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl">Career Comparisons</h1>
        <p className="mt-4 text-base leading-7 text-paper-dim">Compare Cristiano Ronaldo across seasons, clubs, competitions, calendar years, or custom date ranges. Choose any combination of filters to build each comparison.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {selections.map((selection, index) => (
          <ComparisonPanel key={index} selection={selection} index={index} update={(key, value) => updateSelection(index, key, value)} remove={() => removeSelection(index)} canRemove={selections.length > 1} />
        ))}
        {selections.length < 2 && (
          <button type="button" onClick={addSelection} className="flex min-h-28 items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-pitch-raised/40 p-5 text-sm font-medium text-paper-dim transition hover:border-gold hover:text-gold">
            <Plus size={18} /> Add a comparison
          </button>
        )}
      </div>

      {!ready ? (
        <div className="mt-8 rounded-2xl border border-line bg-pitch-raised p-8 text-center">
          <Plus className="mx-auto text-gold" size={24} />
          <h2 className="mt-3 font-display text-xl font-semibold text-paper">Add a second selection to compare</h2>
          <p className="mt-2 text-sm leading-6 text-paper-dim">Configure Ronaldo A, then add Ronaldo B to see the side-by-side statistics.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-paper">Statistical breakdown</h2>
              <p className="mt-1 text-sm text-paper-dim">{totalSelected[0].toLocaleString()} appearances vs. {totalSelected[1].toLocaleString()} appearances</p>
            </div>
            <button type="button" onClick={() => setShowAll((value) => !value)} className="rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch-raised hover:text-paper">{showAll ? "Collapse all sections" : "Expand all sections"}</button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {aggregates.map((aggregate, index) => (
              <div key={index} className={`min-w-0 flex-1 rounded-xl border ${COLORS[index].soft} ${COLORS[index].panel} p-4 text-white`}>
                <p className="font-mono text-xs uppercase tracking-widest opacity-80">Ronaldo {index === 0 ? "A" : "B"}</p>
                <p className="mt-2 text-sm font-semibold">{describeSelection(selections[index])}</p>
                <p className="mt-2 text-xs opacity-80">{aggregate.matches.length.toLocaleString()} appearances · {aggregate.values.goals.toLocaleString()} goals · {aggregate.values.assists.toLocaleString()} assists</p>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            {STAT_GROUPS.map((group) => (
              <details key={group.title} open={showAll} className="overflow-hidden rounded-2xl border border-line bg-pitch-raised">
                <summary className="cursor-pointer list-none px-5 py-4 font-display text-lg font-semibold text-paper marker:hidden">{group.title}</summary>
                <div className="px-5 pb-2">
                  {group.stats.map((stat) => (
                    <ComparisonRow key={stat.key} stat={stat} values={aggregates.map((aggregate) => aggregate.values[stat.key])} labels={labels} />
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-line bg-pitch-raised p-4">
            <div className="flex items-start gap-2"><Info size={16} className="mt-0.5 shrink-0 text-gold" /><div><h3 className="text-sm font-semibold text-paper">Detailed-statistics coverage</h3><p className="mt-1 text-sm leading-6 text-paper-dim">Ronaldo A: detailed stats recorded for {aggregates[0].coverage.matchesWithStats.toLocaleString()} of {aggregates[0].coverage.totalMatches.toLocaleString()} appearances. Ronaldo B: detailed stats recorded for {aggregates[1].coverage.matchesWithStats.toLocaleString()} of {aggregates[1].coverage.totalMatches.toLocaleString()} appearances. Missing statistics are left blank rather than counted as zero. Individual statistics may have different coverage.</p></div></div>
          </div>
        </>
      )}
      <p className="mt-8 text-xs leading-5 text-paper-dim">Comparisons are calculated from the match data currently recorded in The Ronaldo Archive. Custom date ranges are inclusive of both selected dates. Per-90 rates use recorded minutes played. Incomplete match records may affect totals and comparisons.</p>
    </div>
  );
}
