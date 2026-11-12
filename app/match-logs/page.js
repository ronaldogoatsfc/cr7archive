"use client";

import { useMemo, useState, useEffect, Fragment } from "react";
import { ChevronRight, ChevronDown, Film, Video, Info, Check } from "lucide-react";
import matches from "@/data/all-matches";
import {
  filterMatches,
  careerTotals,
  getSeasonsSorted,
  getUniqueValues,
  getStageOptions,
  hasRecordedDetailedStats,
} from "@/lib/stats";
import StatCard from "@/components/StatCard";

const DEFAULT_FILTERS = {
  // basic
  season: "All",
  year: "All",
  dateFrom: "",
  dateTo: "",
  competition: "All",
  team: "All",
  manager: "All",
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
  scoredBy: "",
  assistedBy: "",
  goalType: "All",
  goalTypeMin: "Any",
  finish: "All",
  finishMin: "Any",
  shotLocation: "All",
  shotLocationMin: "Any",
  // performance stats
  detailedStats: "All",
  minShots: "Any",
  minShotsOnTarget: "Any",
  minKeyPasses: "Any",
  minBigChancesCreated: "Any",
  minDribbles: "Any",
  minAerialDuelsWon: "Any",
  minThroughballs: "Any",
  minFreeKickAttempts: "Any",
  minXG: "Any",
  minRating: "Any",
  motm: "All",
  // footage
  hasMatchComp: "All",
  hasFullMatch: "All",
};

function getCountThresholds(getValue) {
  const maximum = matches.reduce((max, match) => {
    const value = Number(getValue(match));
    return Number.isFinite(value) ? Math.max(max, Math.floor(value)) : max;
  }, 0);

  return Array.from({ length: maximum }, (_, index) =>
    index === maximum - 1 ? String(index + 1) : `${index + 1}+`
  );
}

const GOAL_THRESHOLDS = getCountThresholds((match) => match.goals);
const ASSIST_THRESHOLDS = getCountThresholds((match) => match.assists);
const CONTRIBUTION_THRESHOLDS = getCountThresholds(
  (match) => (Number(match.goals) || 0) + (Number(match.assists) || 0)
);
const SHOT_THRESHOLDS = getCountThresholds((match) => match.stats?.shots);
const SHOTS_ON_TARGET_THRESHOLDS = getCountThresholds((match) => match.stats?.shotsOnTarget);
const KEY_PASS_THRESHOLDS = getCountThresholds((match) => match.stats?.keyPasses);
const BIG_CHANCE_THRESHOLDS = getCountThresholds((match) => match.stats?.bigChancesCreated);
const DRIBBLE_THRESHOLDS = getCountThresholds((match) => match.stats?.successfulDribbles);
const AERIAL_DUEL_THRESHOLDS = getCountThresholds((match) => match.stats?.aerialDuelsWon);
const THROUGHBALL_THRESHOLDS = getCountThresholds((match) => match.stats?.accurateThroughballs);
const FREE_KICK_ATTEMPT_THRESHOLDS = getCountThresholds((match) => match.stats?.freeKickAttempts);
const XG_MAX = matches.reduce((max, match) => Math.max(max, Number(match.stats?.xG) || 0), 0);
const XG_THRESHOLDS = Array.from({ length: Math.ceil(XG_MAX * 2) }, (_, index) => {
  const value = (index + 1) * 0.5;
  return { value: String(value), label: `${value.toFixed(1)}+` };
});
const withExactZeroAndOne = (thresholds) => [
  { value: "=0", label: "0" },
  { value: "=1", label: "1" },
  ...thresholds,
];
const SHOT_OPTIONS = withExactZeroAndOne(SHOT_THRESHOLDS);
const SHOTS_ON_TARGET_OPTIONS = withExactZeroAndOne(SHOTS_ON_TARGET_THRESHOLDS);
const KEY_PASS_OPTIONS = withExactZeroAndOne(KEY_PASS_THRESHOLDS);
const BIG_CHANCE_OPTIONS = withExactZeroAndOne(BIG_CHANCE_THRESHOLDS);
const DRIBBLE_OPTIONS = withExactZeroAndOne(DRIBBLE_THRESHOLDS);
const AERIAL_DUEL_OPTIONS = withExactZeroAndOne(AERIAL_DUEL_THRESHOLDS);
const THROUGHBALL_OPTIONS = withExactZeroAndOne(THROUGHBALL_THRESHOLDS);
const FREE_KICK_ATTEMPT_OPTIONS = withExactZeroAndOne(FREE_KICK_ATTEMPT_THRESHOLDS);
const RATING_THRESHOLDS = [
  "Below 6/10",
  "6/10+",
  "6.5/10+",
  "7/10+",
  "7.5/10+",
  "8/10+",
  "8.5/10+",
  "9/10+",
  "9.5/10+",
  "10/10",
];

function getGoalEventOptions(key) {
  return [...new Set(
    matches.flatMap((match) =>
      (match.goalEvents || [])
        .map((event) => event[key])
        .filter((value) => typeof value === "string" && value.trim())
    )
  )].sort((a, b) => a.localeCompare(b));
}

const GOAL_TYPE_OPTIONS = getGoalEventOptions("goalType");
const FINISH_OPTIONS = getGoalEventOptions("bodyPart");
const SHOT_LOCATION_OPTIONS = getGoalEventOptions("shotLocation");
const GOAL_EVENT_COUNT_OPTIONS = getCountThresholds((match) => match.goalEvents?.length)
  .map((value, index) => ({ value: String(index + 1), label: String(index + 1) + "+" }));

const STAT_GROUPS = [
  {
    title: "Shooting",
    fields: [
      { key: "shots", label: "Shots" },
      { key: "shotsOnTarget", label: "On target" },
      { key: "xG", label: "Expected goals (xG)", decimals: 2 },
    ],
  },
  {
    title: "Creation",
    fields: [
      { key: "keyPasses", label: "Key passes" },
      { key: "bigChancesCreated", label: "Big chances created" },
      { key: "xA", label: "xA", decimals: 2 },
      { key: "accurateThroughballs", label: "Throughballs" },
      { key: "freeKickAttempts", label: "Free kick attempts" },
    ],
  },
  {
    title: "Other",
    fields: [
      { key: "successfulDribbles", label: "Dribbles" },
      { key: "aerialDuelsWon", label: "Aerial duels won" },
    ],
  },
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
        {options.map((opt) => {
          const option = typeof opt === "string" ? { value: opt, label: opt } : opt;
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
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
        {options.map((opt) => {
          const option = typeof opt === "string" ? { value: opt, label: opt } : opt;
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
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

function getRatingColor(rating) {
  if (rating <= 5.9) return "bg-goal-red text-white";
  if (rating < 7) return "bg-orange-500 text-white";
  if (rating < 8) return "bg-green-600 text-white";
  if (rating < 9) return "bg-sky-300 text-slate-950";
  return "bg-blue-600 text-white";
}

function getScoreColor(result) {
  if (result === "W") return "text-turf-bright";
  if (result === "L") return "text-goal-red";
  return "text-paper-dim";
}

function nonOptaAssistCount(matches) {
  return matches.reduce(
    (total, match) =>
      total +
      (match.assistEvents || []).filter((event) => event.optaAssist === false).length,
    0
  );
}

function detailedStatsTotals(matches) {
  const fields = [
    ["shots", "Shots"],
    ["shotsOnTarget", "Shots on Target"],
    ["keyPasses", "Key Passes"],
    ["bigChancesCreated", "Big Chances Created"],
    ["successfulDribbles", "Successful Dribbles"],
    ["aerialDuelsWon", "Aerial Duels Won"],
    ["accurateThroughballs", "Accurate Throughballs"],
  ];

  const sumMetric = (key) => {
    let value = 0;
    let recorded = 0;
    for (const match of matches) {
      const raw = match.stats?.[key];
      if (typeof raw === "number" && Number.isFinite(raw)) {
        value += raw;
        recorded += 1;
      }
    }
    return { value, recorded };
  };

  const totals = fields.map(([key, label]) => ({
    key,
    label,
    ...sumMetric(key),
  }));
  const xA = sumMetric("xA");
  const xG = sumMetric("xG");
  const ratings = sumMetric("rating");

  return {
    totals,
    xA: { ...xA, value: xA.value.toFixed(2) },
    xG: { ...xG, value: xG.value.toFixed(2) },
    averageRating: {
      value: ratings.recorded ? (ratings.value / ratings.recorded).toFixed(2) : "—",
      recorded: ratings.recorded,
    },
    motm: matches.filter((match) => match.stats?.motm === true).length,
    matchesWithStats: matches.filter(hasRecordedDetailedStats).length,
  };
}

function goalEventSummary(matches) {
  const definitions = [
    { key: "goalType", title: "Goal Type" },
    { key: "bodyPart", title: "Finish" },
    { key: "shotLocation", title: "Shot Location" },
  ];

  return definitions.map(({ key, title }) => {
    const counts = new Map();
    for (const match of matches) {
      for (const event of match.goalEvents || []) {
        const value =
          key === "shotLocation" && event.goalType === "Penalty"
            ? "Inside Box"
            : event[key];
        if (typeof value !== "string" || !value.trim()) continue;
        counts.set(value, (counts.get(value) || 0) + 1);
      }
    }
    return {
      title,
      items: [...counts.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    };
  }).filter((group) => group.items.length > 0);
}

function SummaryStatCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-line bg-pitch-raised p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
        {label}
      </p>
      <p className="data-mono mt-2 text-2xl font-semibold text-gold">{value}</p>
      {detail && <p className="mt-1 text-xs text-paper-dim">{detail}</p>}
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

function EventSection({ title, count, events, type }) {
  const [open, setOpen] = useState(false);
  const hasEvents = Array.isArray(events) && events.length > 0;
  const nonOptaCount =
    type === "assist"
      ? (events || []).filter((event) => event.optaAssist === false).length
      : 0;
  const fields =
    type === "goal"
      ? [
          ["goalType", "Goal type"],
          ["bodyPart", "Finish"],
          ["shotLocation", "Shot location"],
          ["goalkeeper", "Goalkeeper"],
          ["assistedBy", "Assisted by"],
          ["gameState", "Game state"],
          ["goalPeriod", "Goal period"],
          ["description", "Notes"],
        ]
      : [
          ["assistedPlayer", "Scorer"],
          ["optaAssist", "Opta credited"],
          ["assistClarification", "Clarification"],
        ];

  if (!count && !hasEvents) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 bg-pitch-raised px-4 py-3 text-left transition hover:bg-pitch-raised/70"
      >
        <span className="flex items-center gap-2 font-display text-sm font-semibold text-paper">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          {title}
          <span className="font-mono text-xs text-paper-dim">({count})</span>
          {nonOptaCount > 0 && (
            <span className="font-mono text-[10px] font-medium text-gold">
              {nonOptaCount} non-Opta assist{nonOptaCount === 1 ? "" : "s"}
            </span>
          )}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          {open ? "Hide" : "View"}
        </span>
      </button>

      {open && (
        <div className="space-y-3 p-4">
          {type === "assist" && (
            <p className="text-xs leading-5 text-paper-dim">
              The count above includes only Opta-credited assists. Additional non-Opta goal involvements, such as rebounds, deflections, or fouls won, are listed separately and are not included in the assist total.
            </p>
          )}
          {hasEvents ? (
            <>
              {events.map((event, index) => {
                const visibleFields = fields.filter(
                  ([key]) =>
                    event[key] !== undefined &&
                    event[key] !== null &&
                    event[key] !== ""
                );

                return (
                  <div
                    key={event.id || `${event.minute || "event"}-${index}`}
                    className="rounded-lg border border-line/70 bg-pitch p-3"
                  >
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gold">
                        {type === "goal" ? `Goal${event.goalNumber ? ` #${event.goalNumber}` : ` ${index + 1}`}` : event.optaAssist ? `Assist${event.assistNumber ? ` #${event.assistNumber}` : ` ${index + 1}`}` : "Non-Opta involvement"}
                      </span>
                      {event.minute !== undefined && event.minute !== null && (
                        <span className="rounded-full bg-pitch-raised px-2 py-0.5 font-mono text-xs text-paper-dim">
                          {event.minute}'
                        </span>
                      )}
                    </div>
                    {visibleFields.length > 0 ? (
                      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                        {visibleFields.map(([key, label]) => (
                          <div key={key}>
                            <dt className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                              {label}
                            </dt>
                            <dd className="mt-0.5 text-sm text-paper">
                              {key === "optaAssist" ? (event[key] ? "Yes" : "No") : event[key]}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-sm text-paper-dim">
                        Event recorded; additional details have not been added yet.
                      </p>
                    )}
                  </div>
                );
              })}
              {events.length < count && (
                <p className="text-xs text-paper-dim">
                  {count - events.length} {type === "goal" ? "goal" : "assist"}
                  {count - events.length === 1 ? "" : "s"} still need event details.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm leading-6 text-paper-dim">
              Event-by-event details have not been added for this match yet.
              The match totals above remain the source for the recorded goal and assist counts.
            </p>
          )}
        </div>
      )}
    </div>
  );
}


function cleanPlayerName(value) {
  return value.replace(/^\*+|\*+$/g, "").trim();
}

function parseStartingXI(value) {
  if (!value) return [];
  return value.split("|").map((group) =>
    group.split(",").map((player) => player.trim()).filter(Boolean).map((player) => ({
      name: cleanPlayerName(player),
      exitOrder: (player.match(/\*+$/) || [""])[0].length,
    }))
  );
}

function parseUsedSubstitutes(value) {
  if (!value) return [];
  return value.split(",").map((player) => player.trim()).filter(Boolean).map((player) => {
    const entryOrder = (player.match(/^\*+/) || [""])[0].length;
    const exitOrder = (player.match(/\*+$/) || [""])[0].length;
    return { name: cleanPlayerName(player), entryOrder, exitOrder };
  });
}

function MatchDetails({ match }) {
  const homeGroups = parseStartingXI(match.ronaldo_starting_xi);
  const awayGroups = parseStartingXI(match.opponent_starting_xi);
  const homeSubs = parseUsedSubstitutes(match.ronaldo_team_subs);
  const awaySubs = parseUsedSubstitutes(match.opponent_team_subs);
  const hasDetails =
    homeGroups.length > 0 ||
    awayGroups.length > 0 ||
    homeSubs.length > 0 ||
    awaySubs.length > 0 ||
    match.ronaldo_team_formation ||
    match.opponent_formation;

  if (!hasDetails) return null;

  const getPlayersOnPitch = (groups, side, formation) => {
    const isHome = side === "home";
    const players = [];
    const point = (progress, y) => ({
      left: (isHome ? 4 + progress * 43 : 96 - progress * 43) + "%",
      top: y + "%",
    });
    const addGroup = (groupIndex, positions) => {
      (groups[groupIndex] || []).forEach((player, index) => {
        const position = positions[index] || positions[positions.length - 1] || { progress: 0.5, y: 50 };
        // The opponent faces the opposite direction, so its back line's
        // left-to-right positional order is vertically mirrored on the pitch.
        const displayY = !isHome && groupIndex === 1 ? 100 - position.y : position.y;
        players.push({
          ...player,
          ...point(position.progress, displayY),
          side,
          groupIndex,
        });
      });
    };

    // Goalkeeper
    addGroup(0, [{ progress: 0.06, y: 50 }]);

    // Three defenders: LCB-CB-RCB. Four defenders: LB-LCB-RCB-RB.
    const defenders = groups[1] || [];
    const defensiveLine = defenders.length === 3
      ? [25, 50, 75].map((y) => ({ progress: 0.27, y }))
      : defenders.length === 4
        ? [19, 39, 61, 81].map((y) => ({ progress: 0.25, y }))
        : defenders.map((_, index) => ({
            progress: 0.27,
            y: defenders.length === 1 ? 50 : 15 + (index / (defenders.length - 1)) * 70,
          }));
    addGroup(1, defensiveLine);

    // A diamond midfield is DM-LCM-RCM-CAM. A double-six midfield
    // places the two central midfielders deeper than the outside mids.
    const midfield = groups[2] || [];
    const midfieldPositions = /diamond/i.test(formation || "") && midfield.length === 4
      ? [
          { progress: 0.43, y: 50 },
          { progress: 0.56, y: 34 },
          { progress: 0.56, y: 66 },
          { progress: 0.70, y: 50 },
        ]
      : midfield.length === 4 && /double 6/i.test(formation || "")
        ? [
            { progress: 0.48, y: 37 },
            { progress: 0.48, y: 63 },
            { progress: 0.70, y: 25 },
            { progress: 0.70, y: 75 },
          ]
        : midfield.map((_, index) => ({
            progress: 0.56,
            y: midfield.length === 1 ? 50 : 15 + (index / (midfield.length - 1)) * 70,
          }));
    addGroup(2, midfieldPositions);

    // Three forwards: LW-RW-ST. Two forwards: a central pair.
    const forwards = groups[3] || [];
    const forwardPositions = forwards.length === 3
      ? [
          { progress: 0.82, y: 25 },
          { progress: 0.82, y: 75 },
          { progress: 0.94, y: 50 },
        ]
      : forwards.length === 2
        ? [
            { progress: 0.91, y: 39 },
            { progress: 0.91, y: 61 },
          ]
        : forwards.map((_, index) => ({
            progress: 0.92,
            y: forwards.length === 1 ? 50 : 20 + (index / (forwards.length - 1)) * 60,
          }));
    addGroup(3, forwardPositions);

    return players;
  };

  const getSubstitutionPairs = (startingXI, substitutes) => {
    const outgoing = parseStartingXI(startingXI)
      .flat()
      .filter((player) => player.exitOrder > 0);
    return parseUsedSubstitutes(substitutes)
      .filter((player) => player.entryOrder > 0)
      .sort((a, b) => a.entryOrder - b.entryOrder)
      .map((player) => ({
        ...player,
        replacedPlayer: outgoing.find((starter) => starter.exitOrder === player.entryOrder)?.name || null,
      }));
  };

  const renderPlayers = (players) => (
    players.map((player) => (
      <div
        key={player.side + "-" + player.groupIndex + "-" + player.name}
        className="absolute z-10 flex w-[104px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
        style={{ left: player.left, top: player.top }}
        title={player.name}
      >
        <span className={"relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-pitch text-[10px] font-bold shadow-md sm:h-7 sm:w-7 " + (player.side === "home" ? "bg-gold text-pitch" : "bg-paper text-pitch")}>
          •
          {player.exitOrder > 0 && (
            <span className="absolute -right-2 -top-2 rounded-full bg-goal-red px-1 text-[8px] leading-3 text-white">
              OFF {player.exitOrder}
            </span>
          )}
        </span>
        <span className="mt-0.5 max-w-full truncate rounded bg-pitch/90 px-1 py-0.5 text-[9px] font-medium leading-tight text-white shadow sm:text-[10px]">
          {player.name}
        </span>
      </div>
    ))
  );

  const renderSubs = (pairs) => (
    pairs.length > 0 ? (
      <ul className="mt-2 space-y-2">
        {pairs.map((player) => (
          <li key={player.name} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="rounded bg-gold/10 px-1.5 py-1 font-mono text-[9px] font-semibold uppercase text-gold">
              IN {player.entryOrder}
            </span>
            <span className="font-medium text-paper">{player.name}</span>
            <span className="text-paper-dim">for</span>
            <span className="font-medium text-paper">
              {player.replacedPlayer || "Outgoing player not recorded"}
            </span>
            {player.exitOrder > 0 && (
              <span className="text-[10px] text-paper-dim">(later substituted off)</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-xs text-paper-dim/60">No used substitutes recorded.</p>
    )
  );

  const homePlayers = getPlayersOnPitch(homeGroups, "home", match.ronaldo_team_formation);
  const awayPlayers = getPlayersOnPitch(awayGroups, "away", match.opponent_formation);
  const homeSubPairs = getSubstitutionPairs(match.ronaldo_starting_xi, match.ronaldo_team_subs);
  const awaySubPairs = getSubstitutionPairs(match.opponent_starting_xi, match.opponent_team_subs);

  return (
    <section className="mt-5 space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 bg-line" />
        <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
          Match Details
        </h3>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-pitch-raised p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-semibold text-paper">{match.team}</p>
              <p className="mt-1 text-[10px] text-paper-dim">Manager: {match.manager || "Not recorded"}</p>
            </div>
            <span className="rounded bg-gold/10 px-2 py-1 font-mono text-[10px] text-gold">
              {match.ronaldo_team_formation || "Formation unavailable"}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-pitch-raised p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-sm font-semibold text-paper">{match.opponent}</p>
              <p className="mt-1 text-[10px] text-paper-dim">Manager: {match.opponent_manager || "Not recorded"}</p>
            </div>
            <span className="rounded bg-paper/5 px-2 py-1 font-mono text-[10px] text-paper-dim">
              {match.opponent_formation || "Formation unavailable"}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-pitch-raised p-2 sm:p-3">
        <div
          className="relative mx-auto aspect-[2/1] min-w-[700px] overflow-hidden rounded-lg border border-white/50"
          aria-label={`Starting lineups: ${match.team} versus ${match.opponent}`}
          style={{
            backgroundColor: "#246342",
            backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0, rgba(255,255,255,.035) 10%, transparent 10%, transparent 20%)",
          }}
        >
          <div className="absolute inset-[3%] border border-white/55" />
          <div className="absolute bottom-[3%] left-1/2 top-[3%] border-l border-white/55" />
          <div className="absolute left-1/2 top-1/2 h-[28%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/55" />
          <div className="absolute left-[3%] top-[25%] h-[50%] w-[12%] border border-white/55" />
          <div className="absolute right-[3%] top-[25%] h-[50%] w-[12%] border border-white/55" />
          <div className="absolute left-[3%] top-[38%] h-[24%] w-[4%] border border-white/55" />
          <div className="absolute right-[3%] top-[38%] h-[24%] w-[4%] border border-white/55" />
          {renderPlayers(homePlayers)}
          {renderPlayers(awayPlayers)}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-pitch-raised p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold">
            {match.team} · Used substitutes
          </p>
          {renderSubs(homeSubPairs)}
        </div>
        <div className="rounded-lg border border-line bg-pitch-raised p-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            {match.opponent} · Used substitutes
          </p>
          {renderSubs(awaySubPairs)}
        </div>
      </div>
      <p className="text-[10px] leading-4 text-paper-dim/70">
        Each team occupies its own half of the pitch. Substitutions are paired by matching entry and exit order in the lineup data.
      </p>
    </section>
  );
}

function MatchDetail({ match }) {
  const hasStats = hasRecordedDetailedStats(match) || match.stats?.motm === true;
  const hasFootage = match.hasMatchComp || match.hasFullMatch;

  return (
    <div className="border-t border-line/60 bg-pitch px-4 py-5">
        {(match.goals > 0 || match.assists > 0 || match.assistEvents?.length > 0) && (
          <div className="mb-5 space-y-2">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gold">
              Goal involvements
            </p>
            <EventSection
              title="Goals"
              count={match.goals || 0}
              events={match.goalEvents}
              type="goal"
            />
            <EventSection
              title="Assists"
              count={match.assists || 0}
              events={match.assistEvents}
              type="assist"
            />
          </div>
        )}

        {hasStats ? (
          <div className="space-y-3">
            {match.statsStatus === "unofficial" && match.statsSource === "manual" && (
              <div className="rounded-lg border border-gold/50 bg-gold/10 px-3 py-2">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-gold">
                  Unofficial Match Data
                </p>
                <p className="mt-1 text-xs leading-5 text-paper-dim">
                  Manually recorded independently from available footage; not verified by an official statistical provider.
                </p>
              </div>
            )}
            <div className="rounded-xl border border-line/70 bg-pitch-raised p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0">
              {STAT_GROUPS.map((group, index) => {
                const fields = group.fields
                  .map((field) => {
                    const raw = match.stats[field.key];
                    if (raw === undefined || raw === null) return null;
                    return {
                      ...field,
                      value:
                        typeof raw === "number" && field.decimals
                          ? raw.toFixed(field.decimals)
                          : raw,
                    };
                  })
                  .filter(Boolean);

                if (group.title === "Other") {
                  if (match.yellowCard !== undefined && match.yellowCard !== null) {
                    fields.push({ key: "yellowCard", label: "Yellow cards", value: match.yellowCard ? 1 : 0 });
                  }
                  if (match.redCard !== undefined && match.redCard !== null) {
                    fields.push({ key: "redCard", label: "Red cards", value: match.redCard ? 1 : 0 });
                  }
                }

                if (fields.length === 0 && !(group.title === "Other" && match.stats.motm)) return null;

                return (
                  <section
                    key={group.title}
                    className={`min-w-0 ${index > 0 ? "sm:border-l sm:border-line sm:pl-4" : ""} `}
                  >
                    <h3 className="mb-2 border-b border-gold/60 pb-2 font-mono text-[10px] uppercase tracking-widest text-gold">
                      {group.title}
                    </h3>
                    <dl className="space-y-2">
                      {fields.map((field) => (
                        <div key={field.key} className="flex items-start justify-between gap-2">
                          <dt className="min-w-0 text-xs leading-5 text-paper-dim">{field.label}</dt>
                          <dd className="data-mono shrink-0 pr-2 text-sm font-medium text-paper">{field.value}</dd>
                        </div>
                      ))}
                    </dl>
                    {group.title === "Other" && match.stats.motm && (
                      <p className="mt-3 border-t border-line pt-2 font-mono text-[10px] uppercase tracking-wider text-gold">
                        ★ Man of the Match
                      </p>
                    )}
                  </section>
                );
              })}
            </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-paper-dim">
            Detailed stats not yet logged for this match.
          </p>
        )}

        <MatchDetails match={match} />

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
    </div>
  );
}

export default function MatchLogsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    const dateFrom = params.get("dateFrom");
    const dateTo = params.get("dateTo");

    if (!search && !dateFrom && !dateTo) return;

    setFilters((current) => ({
      ...current,
      ...(search ? { search } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }));
  }, []);
  const [expandedId, setExpandedId] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [includeUnofficialStats, setIncludeUnofficialStats] = useState(false);

  const seasons = useMemo(() => getSeasonsSorted(matches), []);
  const years = useMemo(
    () => [...new Set(matches.map((match) => match.date?.slice(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a)),
    []
  );
  const competitions = useMemo(
    () => getUniqueValues(matches, "competition"),
    []
  );
  const teams = useMemo(() => getUniqueValues(matches, "team"), []);
  const venues = useMemo(() => getUniqueValues(matches, "venue"), []);
  const stages = useMemo(() => getStageOptions(matches), []);
  const managers = useMemo(
    () => [...new Set(matches.map((match) => match.manager).filter(Boolean))].sort(),
    []
  );

  const filtered = useMemo(
    () =>
      filterMatches(matches, filters).sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        return dateB.localeCompare(dateA);
      }),
    [filters]
  );

  const totals = useMemo(() => careerTotals(filtered), [filtered]);
  const assistedGoalCount = useMemo(() => {
    const query = filters.assistedBy.trim();
    if (!query) return null;

    const normalizedQuery = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    return filtered.reduce(
      (count, match) =>
        count +
        (match.goalEvents || []).filter((event) => {
          const name = String(event.assistedBy || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
          return name.includes(normalizedQuery);
        }).length,
      0
    );
  }, [filtered, filters.assistedBy]);
  const detailedTotals = useMemo(() => {
    const summaryMatches = includeUnofficialStats
      ? filtered
      : filtered.filter(
          (match) => !(match.statsStatus === "unofficial" && match.statsSource === "manual")
        );
    const totals = detailedStatsTotals(summaryMatches);

    // Keep coverage based on all filtered matches, even when unofficial stats
    // are excluded from the numerical totals.
    return {
      ...totals,
      matchesWithStats: filtered.filter(hasRecordedDetailedStats).length,
    };
  }, [filtered, includeUnofficialStats]);
  const goalSummary = useMemo(() => goalEventSummary(filtered), [filtered]);
  const nonOptaAssists = useMemo(() => nonOptaAssistCount(filtered), [filtered]);
  const unofficialStatsMatches = useMemo(
    () => filtered.filter((match) => match.statsStatus === "unofficial" && match.statsSource === "manual").length,
    [filtered]
  );

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
            label="Year"
            value={filters.year}
            onChange={(v) => updateFilter("year", v)}
            options={years}
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
            label="Venue"
            value={filters.venue}
            onChange={(v) => updateFilter("venue", v)}
            options={venues}
            infoTitle="Venue"
            infoContent="Home means the match was played at Ronaldo's team's home ground, and away means it was played at the opponent's ground. Neutral means the match was played at a venue that was not considered either team's home ground, such as a tournament venue or a final at a neutral stadium."
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
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                  Date from
                </span>
                <input
                  type="date"
                  value={filters.dateFrom}
                  max={filters.dateTo || undefined}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                  Date to
                </span>
                <input
                  type="date"
                  value={filters.dateTo}
                  min={filters.dateFrom || undefined}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                  className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                />
              </label>
              <Select
                label="Manager"
                value={filters.manager}
                onChange={(v) => updateFilter("manager", v)}
                options={managers}
              />
              <Select
                label="Result"
                value={filters.result}
                onChange={(v) => updateFilter("result", v)}
                options={["W", "D", "L"]}
              />
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
                options={GOAL_THRESHOLDS}
              />
              <MinSelect
                label="Assists"
                value={filters.minAssists}
                onChange={(v) => updateFilter("minAssists", v)}
                options={ASSIST_THRESHOLDS}
              />
              <MinSelect
                label="Goal Contributions"
                value={filters.minGoalContributions}
                onChange={(v) => updateFilter("minGoalContributions", v)}
                options={CONTRIBUTION_THRESHOLDS}
              />
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                  Scored by
                </span>
                <input
                  type="search"
                  value={filters.scoredBy}
                  onChange={(e) => updateFilter("scoredBy", e.target.value)}
                  placeholder="e.g. Cristiano Ronaldo"
                  className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
                  Assisted by
                </span>
                <input
                  type="search"
                  value={filters.assistedBy}
                  onChange={(e) => updateFilter("assistedBy", e.target.value)}
                  placeholder="e.g. Karim Benzema"
                  className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                />
              </label>
              <Select
                label="Goal Type"
                value={filters.goalType}
                onChange={(v) => updateFilter("goalType", v)}
                options={GOAL_TYPE_OPTIONS}
              />
              <MinSelect
                label="Goal Type Count"
                value={filters.goalTypeMin}
                onChange={(v) => updateFilter("goalTypeMin", v)}
                options={GOAL_EVENT_COUNT_OPTIONS}
              />
              <Select
                label="Finish"
                value={filters.finish}
                onChange={(v) => updateFilter("finish", v)}
                options={FINISH_OPTIONS}
              />
              <MinSelect
                label="Finish Count"
                value={filters.finishMin}
                onChange={(v) => updateFilter("finishMin", v)}
                options={GOAL_EVENT_COUNT_OPTIONS}
              />
              <Select
                label="Shot Location"
                value={filters.shotLocation}
                onChange={(v) => updateFilter("shotLocation", v)}
                options={SHOT_LOCATION_OPTIONS}
              />
              <MinSelect
                label="Shot Location Count"
                value={filters.shotLocationMin}
                onChange={(v) => updateFilter("shotLocationMin", v)}
                options={GOAL_EVENT_COUNT_OPTIONS}
              />
            </FilterSection>

            <FilterSection title="Performance stats">
              <Select
                label="Detailed Stats"
                value={filters.detailedStats}
                onChange={(v) => updateFilter("detailedStats", v)}
                options={["Yes", "No"]}
                infoTitle="Detailed Match Statistics"
                infoContent="Yes includes matches with at least one recorded performance statistic, such as shots, key passes, dribbles, expected goals, or match rating. Goals and assists alone do not count."
              />
              <MinSelect
                label="Shots"
                value={filters.minShots}
                onChange={(v) => updateFilter("minShots", v)}
                options={SHOT_OPTIONS}
              />
              <MinSelect
                label="Shots on Target"
                value={filters.minShotsOnTarget}
                onChange={(v) => updateFilter("minShotsOnTarget", v)}
                options={SHOTS_ON_TARGET_OPTIONS}
              />
              <MinSelect
                label="Key Passes"
                value={filters.minKeyPasses}
                onChange={(v) => updateFilter("minKeyPasses", v)}
                options={KEY_PASS_OPTIONS}
                infoTitle="Key Passes"
                infoContent="The final pass leading to a shot on goal by a teammate."
              />
              <MinSelect
                label="Big Chances Created"
                value={filters.minBigChancesCreated}
                onChange={(v) => updateFilter("minBigChancesCreated", v)}
                options={BIG_CHANCE_OPTIONS}
              />
              <MinSelect
                label="Dribbles"
                value={filters.minDribbles}
                onChange={(v) => updateFilter("minDribbles", v)}
                options={DRIBBLE_OPTIONS}
              />
              <MinSelect
                label="Aerial Duels Won"
                value={filters.minAerialDuelsWon}
                onChange={(v) => updateFilter("minAerialDuelsWon", v)}
                options={AERIAL_DUEL_OPTIONS}
              />
              <MinSelect
                label="Free Kick Attempts"
                value={filters.minFreeKickAttempts}
                onChange={(v) => updateFilter("minFreeKickAttempts", v)}
                options={FREE_KICK_ATTEMPT_OPTIONS}
              />
              <MinSelect
                label="Expected Goals (xG)"
                value={filters.minXG}
                onChange={(v) => updateFilter("minXG", v)}
                options={XG_THRESHOLDS}
              />
              <MinSelect
                label="Throughballs"
                value={filters.minThroughballs}
                onChange={(v) => updateFilter("minThroughballs", v)}
                options={THROUGHBALL_OPTIONS}
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
        <StatCard
          label="Goals"
          value={totals.goals}
          detail={
            assistedGoalCount !== null
              ? `${assistedGoalCount} ${assistedGoalCount === 1 ? "goal" : "goals"} assisted by ${filters.assistedBy.trim()}`
              : undefined
          }
        />
        <StatCard
          label="Assists"
          value={totals.assists}
          detail={`${nonOptaAssists} non-Opta involvements (not included in total)`}
        />
        <div className="rounded-2xl border border-line bg-pitch-raised p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-paper-dim">Record (W-D-L)</p>
          <p className="stat-number mt-2 flex items-baseline gap-1 text-4xl font-semibold tabular-nums">
            <span className="text-turf-bright">{totals.wins}</span>
            <span className="text-paper-dim">-</span>
            <span className="text-paper-dim">{totals.draws}</span>
            <span className="text-paper-dim">-</span>
            <span className="text-goal-red">{totals.losses}</span>
          </p>
        </div>
      </div>

      <section className="mt-8">
        <button
          type="button"
          onClick={() => setShowDetailedStats((value) => !value)}
          aria-expanded={showDetailedStats}
          className="flex w-full flex-col justify-between gap-3 text-left sm:flex-row sm:items-center"
        >
          <span className="flex items-center gap-2">
            {showDetailedStats ? (
              <ChevronDown size={20} className="shrink-0 text-gold" />
            ) : (
              <ChevronRight size={20} className="shrink-0 text-gold" />
            )}
            <span className="font-display text-2xl font-semibold text-paper">
              Detailed Stats Summary
            </span>
          </span>
          <span className="font-mono text-xs text-paper-dim sm:text-right">
            <span className="block">Detailed stats recorded for {detailedTotals.matchesWithStats} of {filtered.length} matches</span>
            {unofficialStatsMatches > 0 && (
              <span className="mt-1 block text-gold">
                {unofficialStatsMatches} {unofficialStatsMatches === 1 ? "match has" : "matches have"} unofficial stats
              </span>
            )}
          </span>
        </button>

        {showDetailedStats && (
          <>
            <p className="mt-2 max-w-3xl text-sm text-paper-dim">
              Totals for the matches currently selected by your filters. Only recorded values are included;
              missing stats are excluded rather than treated as zero. Unofficial match data is excluded by
              default, but you can include it below.
              {unofficialStatsMatches > 0 && (
                <span className="mt-1 block text-gold">
                  {includeUnofficialStats
                    ? `These totals include manually recorded, unverified stats from ${unofficialStatsMatches} ${unofficialStatsMatches === 1 ? "match" : "matches"}.`
                    : `Unofficial stats from ${unofficialStatsMatches} ${unofficialStatsMatches === 1 ? "match are" : "matches are"} excluded from these totals.`}
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={() => setIncludeUnofficialStats((value) => !value)}
              aria-pressed={includeUnofficialStats}
              className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                includeUnofficialStats
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-line bg-pitch-raised text-paper-dim hover:border-gold hover:text-paper"
              }`}
            >
              <span className={`flex h-4 w-4 items-center justify-center rounded border ${
                includeUnofficialStats ? "border-gold bg-gold text-pitch" : "border-paper-dim"
              }`}>
                {includeUnofficialStats && <Check size={12} strokeWidth={3} />}
              </span>
              Include unofficial stats in totals
            </button>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {detailedTotals.totals.map((stat) => (
            <SummaryStatCard
              key={stat.key}
              label={stat.label}
              value={stat.value.toLocaleString()}
              detail={`Recorded for ${stat.recorded} matches`}
            />
          ))}
          <SummaryStatCard
            label="Expected Goals (xG)"
            value={detailedTotals.xG.value}
            detail={`Recorded for ${detailedTotals.xG.recorded} matches`}
          />
          <SummaryStatCard
            label="Expected Assists (xA)"
            value={detailedTotals.xA.value}
            detail={`Recorded for ${detailedTotals.xA.recorded} matches`}
          />
          <SummaryStatCard
            label="Average Rating"
            value={detailedTotals.averageRating.value}
            detail={`Rated appearances: ${detailedTotals.averageRating.recorded}`}
          />
              <SummaryStatCard
                label="Man of the Match"
                value={detailedTotals.motm.toLocaleString()}
                detail="Recorded awards"
              />
            </div>
            {goalSummary.length > 0 && (
              <section className="mt-6 border-t border-line pt-5">
                <h3 className="font-display text-lg font-semibold text-paper">Goal Summary</h3>
                <p className="mt-1 text-xs text-paper-dim">
                  Breakdown of Ronaldo's recorded goals in the currently filtered matches. Location totals combine open-play and penalty goals, with penalties counted as inside-box goals.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {goalSummary.map((group) => (
                    <div key={group.title} className="rounded-xl border border-line bg-pitch-raised p-4">
                      <h4 className="mb-3 border-b border-gold/60 pb-2 font-mono text-[10px] uppercase tracking-widest text-gold">
                        {group.title}
                      </h4>
                      <dl className="space-y-2">
                        {group.items.map((item) => (
                          <div key={item.label} className="flex items-center justify-between gap-3">
                            <dt className="text-xs text-paper-dim">{item.label}</dt>
                            <dd className="data-mono text-sm font-medium text-paper">{item.count}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>

      <section className="mt-8 space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-paper">Match Log</h2>
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
            {filtered.length.toLocaleString()} {filtered.length === 1 ? "appearance" : "appearances"}
          </p>
        </div>
        <div className="space-y-2">
          {filtered.map((m) => {
            const isOpen = expandedId === m.id;
            const hasFootage = m.hasMatchComp || m.hasFullMatch;
            const rating = m.stats?.rating;
            const hasRating =
              rating !== undefined &&
              rating !== null &&
              Number.isFinite(Number(rating));
            const stage = m.stage || "Stage not recorded";
            const isKnockout = /play.?off|round of|quarter.?final|semi.?final|final/i.test(stage);
            const stageDescription = `${isKnockout ? "Knockout · " : ""}${stage}${m.leg ? ` · ${m.leg}` : ""}`;
            return (
              <article
                key={m.id}
                id={`match-${m.id}`}
                className={`scroll-mt-28 target:border-gold/80 overflow-hidden rounded-xl border transition-colors ${isOpen ? "border-gold/50 bg-pitch-raised" : "border-line bg-pitch-raised/60 hover:border-line-bright"}`}
              >
                <button
                  type="button"
                  onClick={() => toggleRow(m.id)}
                  aria-expanded={isOpen}
                  className="w-full cursor-pointer text-left"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line/70 px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="font-display text-sm font-semibold text-paper">{m.competition}</span>
                      {hasFootage && <Film size={13} className="text-gold" aria-label="Match footage available" />}
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                      {m.date}
                    </span>
                  </div>

                  <div className="px-4 py-4 sm:px-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${isKnockout ? "border border-gold/40 bg-gold/10 text-gold" : "border border-line bg-pitch text-paper-dim"}`}>
                        {stageDescription}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                        {m.venue}
                      </span>
                                          </div>

                    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-5">
                        <p className="truncate font-display text-base font-semibold text-paper sm:text-lg">{m.team}</p>
                        <div className="text-center">
                          <p className={`data-mono text-2xl font-bold tracking-tight sm:text-3xl ${getScoreColor(m.result)}`}>
                            {m.scoreFor}–{m.scoreAgainst}
                          </p>
                          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-paper-dim">
                            {m.result === "W" ? "Win" : m.result === "D" ? "Draw" : m.result === "L" ? "Loss" : "Result"}
                          </p>
                        </div>
                        <p className="truncate text-right font-display text-base font-semibold text-paper sm:text-lg">{m.opponent}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t border-line/70 pt-3 md:justify-between md:border-l md:border-t-0 md:pl-5 md:pt-0">
                        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-xs">
                          <span className="text-paper-dim">{m.minutesPlayed}&apos;</span>
                          <span className="text-gold"><span className="font-semibold">{m.goals}</span> G</span>
                          <span className="text-turf-bright"><span className="font-semibold">{m.assists}</span> A{m.assistEvents?.some((event) => event.optaAssist === false) && <sup className="ml-0.5 text-[9px] text-gold">*</sup>}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {(hasRating || m.stats?.motm) && (
                            <span
                              className={`relative inline-flex h-8 min-w-8 items-center justify-center rounded-sm px-1.5 font-mono text-xs font-bold ${hasRating ? getRatingColor(Number(rating)) : "border border-gold bg-gold text-pitch"}`}
                              title={`${hasRating ? `Match rating: ${Number(rating).toFixed(1)}` : "No match rating recorded"}${m.stats?.motm ? " · Man of the Match (★)" : ""}`}
                              aria-label={`${hasRating ? `Match rating ${Number(rating).toFixed(1)}` : ""}${m.stats?.motm ? " Man of the Match" : ""}`}
                            >
                              {hasRating ? Number(rating).toFixed(1) : "M"}
                              {hasRating && m.stats?.motm && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-pitch bg-gold text-[10px] font-black leading-none text-pitch" aria-hidden="true">
                                  ★
                                </span>
                              )}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-paper-dim">
                            {isOpen ? "Hide details" : "Details"}
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                {isOpen && <MatchDetail match={m} />}
              </article>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-line bg-pitch-raised px-4 py-10 text-center text-sm text-paper-dim">
              No matches fit these filters. Try resetting them.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}