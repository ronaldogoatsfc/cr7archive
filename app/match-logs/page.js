"use client";

import { useMemo, useState, Fragment } from "react";
import { ChevronRight, ChevronDown, Film, Video, Info } from "lucide-react";
import matches from "@/data/all-matches";
import {
  filterMatches,
  careerTotals,
  getSeasonsSorted,
  getUniqueValues,
  getStageOptions,
} from "@/lib/stats";
import StatCard from "@/components/StatCard";

const DEFAULT_FILTERS = {
  // basic
  season: "All",
  competition: "All",
  team: "All",
  result: "All",
  venue: "All",
  search: "",
  // match details
  stage: "All",
  leg: "All",
  // goal involvement
  minGoals: "Any",
  minAssists: "Any",
  minGoalContributions: "Any",
  // performance stats
  minShots: "Any",
  minShotsOnTarget: "Any",
  minKeyPasses: "Any",
  minBigChancesCreated: "Any",
  minDribbles: "Any",
  minAerialDuelsWon: "Any",
  minFreeKickAttempts: "Any",
  minThroughballs: "Any",
  minXG: "Any",
  minRating: "Any",
  motm: "All",
  // footage
  hasMatchComp: "All",
  hasFullMatch: "All",
};

export const metadata = {
  title: "Match Logs — The Ronaldo Archive",
};

const COUNT_THRESHOLDS = ["1+", "2+", "3+", "4+", "5+"];
const XG_THRESHOLDS = ["0.5+", "1+", "1.5+", "2+"];
const RATING_THRESHOLDS = ["6+", "7+", "7.5+", "8+", "9+"];

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

function Select({ label, value, onChange, options, allLabel = "All", infoTitle, infoContent }) {
  return (
    <label className="flex flex-col gap-1">
      {/* Align the label text and info button horizontally */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          {label}
        </span>
        {infoTitle && (
          <InfoButton title={infoTitle}>
            {infoContent}
          </InfoButton>
        )}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <option value="All">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function MinSelect({ label, value, onChange, options, infoTitle, infoContent }) {
  return (
    <label className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          {label}
        </span>
        {infoTitle && (
          <InfoButton title={infoTitle}>
            {infoContent}
          </InfoButton>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <option value="Any">Any</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-gold">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {children}
      </div>
    </div>
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

function InfoButton({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Information about ${title}`}
        className="flex h-5 w-5 items-center justify-center rounded-full text-paper-dim transition hover:bg-pitch hover:text-gold"
      >
        <Info size={14} />
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-50 w-72 rounded-xl border border-line bg-pitch-raised p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <h4 className="font-display text-sm font-semibold text-paper">
              {title}
            </h4>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-paper-dim transition hover:text-paper"
              aria-label="Close information"
            >
              ×
            </button>
          </div>

          <div className="mt-2 text-xs leading-5 text-paper-dim">
            {children}
          </div>
        </div>
      )}
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

export default function MatchLogsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [expandedId, setExpandedId] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const seasons = useMemo(() => getSeasonsSorted(matches), []);
  const competitions = useMemo(
    () => getUniqueValues(matches, "competition"),
    []
  );
  const teams = useMemo(() => getUniqueValues(matches, "team"), []);
  const venues = useMemo(() => getUniqueValues(matches, "venue"), []);
  const stages = useMemo(() => getStageOptions(matches), []);

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
        Match Logs
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        Every match, filtered your way
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Slice the log by season, competition, club, result, or venue — or dig
        into performance filters below. Click any row for detailed match
        stats and footage.
      </p>

      <div className="mt-8 space-y-5 rounded-2xl border border-line bg-pitch-raised p-5">
        <FilterSection title="Basic">
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
        </FilterSection>

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="font-mono text-xs uppercase tracking-widest text-gold hover:text-gold-bright"
        >
          {showAdvanced ? "Hide advanced filters ▲" : "Show advanced filters ▼"}
        </button>

        {showAdvanced && (
          <>
            <FilterSection title="Match details">
              <Select
                label="Stage"
                value={filters.stage}
                onChange={(v) => updateFilter("stage", v)}
                options={stages}
              />
              <Select
                label="Leg"
                value={filters.leg}
                onChange={(v) => updateFilter("leg", v)}
                options={["1st Leg", "2nd Leg"]}
              />
            </FilterSection>

            <FilterSection title="Goal involvement">
              <MinSelect
                label="Goals"
                value={filters.minGoals}
                onChange={(v) => updateFilter("minGoals", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Assists"
                value={filters.minAssists}
                onChange={(v) => updateFilter("minAssists", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Goal Contributions"
                value={filters.minGoalContributions}
                onChange={(v) => updateFilter("minGoalContributions", v)}
                options={COUNT_THRESHOLDS}
              />
            </FilterSection>

            <FilterSection title="Performance stats">
              <MinSelect
                label="Shots"
                value={filters.minShots}
                onChange={(v) => updateFilter("minShots", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Shots on Target"
                value={filters.minShotsOnTarget}
                onChange={(v) => updateFilter("minShotsOnTarget", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Key Passes"
                value={filters.minKeyPasses}
                onChange={(v) => updateFilter("minKeyPasses", v)}
                options={COUNT_THRESHOLDS}
                infoTitle="Key Passes"
                infoContent="The final pass leading to a shot on goal by a teammate."
              />
              <MinSelect
                label="Big Chances Created"
                value={filters.minBigChancesCreated}
                onChange={(v) => updateFilter("minBigChancesCreated", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Dribbles"
                value={filters.minDribbles}
                onChange={(v) => updateFilter("minDribbles", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Aerial Duels Won"
                value={filters.minAerialDuelsWon}
                onChange={(v) => updateFilter("minAerialDuelsWon", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Free Kick Attempts"
                value={filters.minFreeKickAttempts}
                onChange={(v) => updateFilter("minFreeKickAttempts", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="Throughballs"
                value={filters.minThroughballs}
                onChange={(v) => updateFilter("minThroughballs", v)}
                options={COUNT_THRESHOLDS}
              />
              <MinSelect
                label="xG"
                value={filters.minXG}
                onChange={(v) => updateFilter("minXG", v)}
                options={XG_THRESHOLDS}
                infoTitle="Expected Goals"
                infoContent="Measures the quality of a shot based on variables like distance, angle, phase of play, 
                and type of assist. An xG of 0.75 means a player would be expected to score that chance 75% of the 
                time."
              />
              <MinSelect
                label="Match Rating"
                value={filters.minRating}
                onChange={(v) => updateFilter("minRating", v)}
                options={RATING_THRESHOLDS}
              />
              <Select
                label="Man of the Match"
                value={filters.motm}
                onChange={(v) => updateFilter("motm", v)}
                options={["Yes", "No"]}
                infoTitle="Man of the Match Awards"
                infoContent="These are counted by the number of instances Cristiano Ronaldo was the Man of the Match, 
                as chosen by rating apps. Different rating apps were used in various cases, such as an app not having 
                a rating for that specific game, while another one did. Fan-voted Man of the Match awards also exist, 
                but they were not used in the total as to remain consistent with the other data."
              />
            </FilterSection>

            <FilterSection title="Match footage">
              <Select
                label="Has Compilation"
                value={filters.hasMatchComp}
                onChange={(v) => updateFilter("hasMatchComp", v)}
                options={["Yes", "No"]}
                infoTitle="Match Compilations"
                infoContent="'Yes' if there is a match compilation link for that game and 'No' if there is not. If 
                you find one, please send us a link to it. The match compilation should be in 720p or better. It 
                should not be cropped. Watermarks are okay."
              />
              <Select
                label="Has Full Match"
                value={filters.hasFullMatch}
                onChange={(v) => updateFilter("hasFullMatch", v)}
                options={["Yes", "No"]}
                infoTitle="Full Match"
                infoContent="'Yes' if there is a full match link for that game and 'No' if there is not. If you 
                find one, please send us a link to it. The full match should be in 720p or better. It should not be 
                cropped. Watermarks are okay."                
              />
            </FilterSection>
          </>
        )}

        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="rounded-lg border border-line px-4 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper"
        >
          Reset all filters
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
                  No matches fit these filters. Try resetting them.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}