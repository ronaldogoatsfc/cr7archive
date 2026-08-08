"use client";

import { useMemo, useState, Fragment } from "react";
import { ChevronRight, ChevronDown, Film, Video } from "lucide-react";
import matches from "@/data/unofficial-matches.json";
import {
  filterMatches,
  careerTotals,
  getSeasonsSorted,
  getUniqueValues,
} from "@/lib/stats";
import StatCard from "@/components/StatCard";

const DEFAULT_FILTERS = {
  season: "All",
  competition: "All",
  team: "All",
  result: "All",
  venue: "All",
  search: "",
};

export const metadata = {
  title: "Unofficial Match Logs — The Ronaldo Archive",
};

const STAT_FIELDS = [
  { key: "shots", label: "Shots" },
  { key: "shotsOnTarget", label: "Shots on Target" },
  { key: "keyPasses", label: "Key Passes" },
  { key: "bigChancesCreated", label: "Big Chances Created" },
  { key: "successfulDribbles", label: "Dribbles" },
  { key: "aerialDuelsWon", label: "Aerial Duels Won" },
  { key: "freeKickAttempts", label: "Free Kick Attempts" },
  { key: "accurateThroughballs", label: "Throughballs" },
  { key: "xG", label: "xG", decimals: 2 },
  { key: "xA", label: "xA", decimals: 2 },
  { key: "rating", label: "Rating", decimals: 1 },
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

const resultDot = { W: "bg-turf-bright", D: "bg-paper-dim", L: "bg-goal-red" };

function StatTile({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-pitch px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
        {label}
      </p>
      <p className="data-mono mt-1 text-lg text-gold">{value}</p>
    </div>
  );
}

function MatchDetail({ match }) {
  const hasStats = Boolean(match.stats);
  const hasFootage = match.hasMatchComp || match.hasFullMatch;

  return (
    <tr className="border-b border-line/60 bg-pitch">
      <td colSpan={10} className="px-4 py-5">
        {hasStats ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {STAT_FIELDS.map((f) => {
              const raw = match.stats[f.key];
              if (raw === undefined || raw === null) return null;
              const value =
                typeof raw === "number" && f.decimals
                  ? raw.toFixed(f.decimals)
                  : raw;
              return <StatTile key={f.key} label={f.label} value={value} />;
            })}
            {match.stats.motm && (
              <div className="flex items-center justify-center rounded-lg border border-gold bg-pitch px-3 py-2">
                <span className="font-mono text-xs uppercase tracking-widest text-gold">
                  Man of the Match
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-paper-dim">
            Detailed stats not yet logged for this match.
          </p>
        )}

        {hasFootage ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {match.hasMatchComp && (
              <a
                href={match.matchCompUrl || undefined}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => !match.matchCompUrl && e.preventDefault()}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  match.matchCompUrl
                    ? "border-line text-paper hover:border-gold hover:text-gold"
                    : "cursor-default border-line/50 text-paper-dim/50"
                }`}
              >
                <Film size={14} />
                {match.matchCompUrl
                  ? "Watch compilation"
                  : "Compilation available — link coming soon"}
              </a>
            )}
            {match.hasFullMatch && (
              <a
                href={match.fullMatchUrl || undefined}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => !match.fullMatchUrl && e.preventDefault()}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  match.fullMatchUrl
                    ? "border-line text-paper hover:border-gold hover:text-gold"
                    : "cursor-default border-line/50 text-paper-dim/50"
                }`}
              >
                <Video size={14} />
                {match.fullMatchUrl
                  ? "Watch full match"
                  : "Full match available — link coming soon"}
              </a>
            )}
          </div>
        ) : (
          <p className="mt-4 font-mono text-xs text-paper-dim/60">
            No footage linked for this match yet.
          </p>
        )}
      </td>
    </tr>
  );
}

export default function UnofficialMatchesPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [expandedId, setExpandedId] = useState(null);

  const seasons = useMemo(() => getSeasonsSorted(matches), []);
  const competitions = useMemo(
    () => getUniqueValues(matches, "competition"),
    []
  );
  const teams = useMemo(() => getUniqueValues(matches, "team"), []);
  const venues = useMemo(() => getUniqueValues(matches, "venue"), []);

  const filtered = useMemo(
    () =>
      filterMatches(matches, filters).sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    [filters]
  );

  const totals = useMemo(() => careerTotals(filtered), [filtered]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRow(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Unofficial matches
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        Friendlies, exhibitions & youth games
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Pre-season friendlies, exhibition tours, youth-level games, and similar
        matches that don&apos;t count toward official career totals — kept
        here separately so the main match logs page stays accurate. Filter by
        season, competition, club, result, or venue.
      </p>
      <p className="mt-2 max-w-2xl font-mono text-xs uppercase tracking-widest text-goal-red">
        Not counted toward official career stats
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-pitch-raised p-5 sm:grid-cols-3 lg:grid-cols-6">
        <Select
          label="Season"
          value={filters.season}
          onChange={(v) => updateFilter("season", v)}
          options={seasons}
        />
        <Select
          label="Competition"
          value={filters.competition}
          onChange={(v) => updateFilter("competition", v)}
          options={competitions}
        />
        <Select
          label="Club / Team"
          value={filters.team}
          onChange={(v) => updateFilter("team", v)}
          options={teams}
        />
        <Select
          label="Result"
          value={filters.result}
          onChange={(v) => updateFilter("result", v)}
          options={["W", "D", "L"]}
        />
        <Select
          label="Venue"
          value={filters.venue}
          onChange={(v) => updateFilter("venue", v)}
          options={venues}
        />
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            Search opponent
          </span>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="e.g. Barcelona"
            className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          />
        </label>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="col-span-2 rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper sm:col-span-1"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Matches" value={totals.matches} />
        <StatCard label="Goals" value={totals.goals} />
        <StatCard label="Assists" value={totals.assists} accent="turf" />
        <StatCard
          label="Record"
          value={`${totals.wins}-${totals.draws}-${totals.losses}`}
          accent="turf"
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-pitch-raised text-left font-mono text-xs uppercase tracking-wider text-paper-dim">
              <th className="w-8 px-2 py-3"></th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Competition</th>
              <th className="px-4 py-3">Club</th>
              <th className="px-4 py-3">Opponent</th>
              <th className="px-4 py-3">Venue</th>
              <th className="px-4 py-3 text-center">Result</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Mins</th>
              <th className="px-4 py-3 text-center">G</th>
              <th className="px-4 py-3 text-center">A</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const isOpen = expandedId === m.id;
              const hasFootage = m.hasMatchComp || m.hasFullMatch;
              return (
                <Fragment key={m.id}>
                  <tr
                    onClick={() => toggleRow(m.id)}
                    className="cursor-pointer border-b border-line/60 transition hover:bg-pitch-raised"
                  >
                    <td className="px-2 py-3 text-paper-dim">
                      {isOpen ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </td>
                    <td className="data-mono px-4 py-3 text-paper-dim">
                      {m.date}
                    </td>
                    <td className="px-4 py-3 text-paper">
                      <span className="flex items-center gap-2">
                        {m.competition}
                        {hasFootage && (
                          <Film size={12} className="text-gold" />
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-paper-dim">{m.team}</td>
                    <td className="px-4 py-3 text-paper">{m.opponent}</td>
                    <td className="px-4 py-3 text-paper-dim">{m.venue}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          resultDot[m.result]
                        }`}
                        title={m.result}
                      />
                    </td>
                    <td className="data-mono px-4 py-3 text-center text-paper">
                      {m.scoreFor}–{m.scoreAgainst}
                    </td>
                    <td className="data-mono px-4 py-3 text-center text-paper-dim">
                      {m.minutesPlayed}&apos;
                    </td>
                    <td className="data-mono px-4 py-3 text-center font-semibold text-gold">
                      {m.goals}
                    </td>
                    <td className="data-mono px-4 py-3 text-center text-turf-bright">
                      {m.assists}
                    </td>
                  </tr>
                  {isOpen && <MatchDetail match={m} />}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={11}
                  className="px-4 py-10 text-center text-paper-dim"
                >
                  No unofficial matches logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}