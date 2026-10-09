"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import matches from "@/data/all-matches";
import {
  goalsAndAssistsBySeason,
  goalsByCompetition,
  goalsByClub,
  minutesPerGoalTrend,
  ratingDistribution,
  resultsBreakdown,
  goalsByKnockoutPhase,
  goalsByOpponent,
  goalsByVenue,
  goalsByMonth,
  goalsByAge,
  goalsPer90BySeason,
  winPercentageByCompetition,
  appearancesByClub,
  goalsAndAssistsByClub,
} from "@/lib/stats";

const GOLD = "#c9a227";
const GOLD_BRIGHT = "#e2bd45";
const TURF = "#4a7a5f";
const LINE = "rgba(242, 240, 234, 0.12)";
const PAPER_DIM = "#b9b6ad";
const PIE_COLORS = [
  GOLD,
  TURF,
  "#8b3a3a",
  "#6b7a8f",
  "#e2bd45",
  "#3d5a4c",
];

const tooltipStyle = {
  backgroundColor: "#12171a",
  border: `1px solid ${LINE}`,
  borderRadius: 8,
  color: "#f2f0ea",
  fontFamily: "var(--font-jetbrains)",
  fontSize: 12,
};

function topCompetitions(data, limit = 6) {
  if (data.length <= limit) return data;

  const top = data.slice(0, limit);
  const rest = data.slice(limit);
  const otherGoals = rest.reduce((sum, item) => sum + item.goals, 0);

  return [...top, { name: "Other", goals: otherGoals }];
}

function downloadCSV(title, data) {
  if (!data?.length) return;

  const headers = [...new Set(data.flatMap((row) => Object.keys(row)))];

  const escapeCSV = (value) => {
    const text = value == null ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [
    headers.map(escapeCSV).join(","),
    ...data.map((row) =>
      headers.map((header) => escapeCSV(row[header])).join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ChartCard({ chart }) {
  const {
    title,
    description,
    data,
    type = "bar",
    xKey = "name",
    horizontal = false,
    stacked = false,
    keys = [{ key: "goals", name: "Goals", color: GOLD }],
    explanation,
    valueKey = "value",
    pieColors,
    height = "h-72",
    angleLabels = false,
  } = chart;

  const isPie = type === "pie";
  const isLine = type === "line";

  return (
    <article className="rounded-2xl border border-line bg-pitch-raised p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-paper">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-paper-dim">
        {description}
      </p>

      <div
        className={`mt-5 ${height}`}
        data-chart-container
        aria-label={title}
      >
        <ResponsiveContainer width="100%" height="100%">
          {isPie ? (
            <PieChart>
              <Pie
                data={data}
                dataKey={valueKey}
                nameKey={xKey}
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`${entry[xKey]}-${index}`}
                    fill={
                      pieColors?.[entry[xKey]] ??
                      PIE_COLORS[index % PIE_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: PAPER_DIM }}
              />
            </PieChart>
          ) : isLine ? (
            <LineChart
              data={data}
              margin={{ top: 5, right: 12, bottom: angleLabels ? 18 : 5, left: 0 }}
            >
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis
                dataKey={xKey}
                stroke={PAPER_DIM}
                fontSize={10}
                tickLine={false}
                interval={angleLabels ? 0 : "preserveStartEnd"}
                angle={angleLabels ? -35 : 0}
                textAnchor={angleLabels ? "end" : "middle"}
                height={angleLabels ? 65 : 30}
              />
              <YAxis
                stroke={PAPER_DIM}
                fontSize={11}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: PAPER_DIM }}
              />
              {keys.map((item) => (
                <Line
                  key={item.key}
                  type="monotone"
                  dataKey={item.key}
                  name={item.name}
                  stroke={item.color}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              ))}
            </LineChart>
          ) : (
            <BarChart
              data={data}
              layout={horizontal ? "vertical" : "horizontal"}
              margin={{
                top: 5,
                right: 12,
                bottom: angleLabels ? 18 : 5,
                left: horizontal ? 10 : 0,
              }}
            >
              <CartesianGrid
                stroke={LINE}
                vertical={!horizontal}
                horizontal={horizontal}
              />
              <XAxis
                type={horizontal ? "number" : "category"}
                dataKey={horizontal ? undefined : xKey}
                stroke={PAPER_DIM}
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: LINE }}
                allowDecimals={false}
                tick={
                  angleLabels
                    ? { fill: PAPER_DIM, fontSize: 10 }
                    : undefined
                }
                interval={angleLabels ? 0 : "preserveStartEnd"}
                angle={angleLabels && !horizontal ? -30 : 0}
                textAnchor={
                  angleLabels && !horizontal ? "end" : "middle"
                }
                height={angleLabels && !horizontal ? 65 : 30}
              />
              <YAxis
                type={horizontal ? "category" : "number"}
                dataKey={horizontal ? xKey : undefined}
                stroke={PAPER_DIM}
                fontSize={10}
                tickLine={false}
                width={horizontal ? 115 : 40}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: LINE }}
              />
              {keys.length > 1 && (
                <Legend
                  wrapperStyle={{ fontSize: 12, color: PAPER_DIM }}
                />
              )}
              {keys.map((item) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  name={item.name}
                  fill={item.color}
                  stackId={stacked ? "total" : undefined}
                  radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => downloadCSV(title, data)}
          className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-paper transition hover:border-gold hover:text-gold"
        >
          <span aria-hidden="true">↓</span> Download CSV
        </button>
      </div>

      <details className="mt-5 border-t border-line pt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-paper transition hover:text-gold [&::-webkit-details-marker]:hidden">
          <span>About this chart</span>
          <span
            aria-hidden="true"
            className="text-lg text-gold transition-transform"
          >
            +
          </span>
        </summary>

        <div className="mt-4 space-y-4 text-sm leading-6 text-paper-dim">
          <div>
            <h3 className="font-semibold text-paper">What it shows</h3>
            <p>{explanation.shows}</p>
          </div>
          <div>
            <h3 className="font-semibold text-paper">How it is calculated</h3>
            <p>{explanation.calculation}</p>
          </div>
          <div>
            <h3 className="font-semibold text-paper">How to interpret it</h3>
            <p>{explanation.interpretation}</p>
          </div>
          <div>
            <h3 className="font-semibold text-paper">Limitations</h3>
            <p>{explanation.limitation}</p>
          </div>
        </div>
      </details>
    </article>
  );
}

export default function VisualizationsPage() {
  const bySeason = goalsAndAssistsBySeason(matches);
  const competitionGoals = goalsByCompetition(matches);
  const byCompetition = topCompetitions(competitionGoals);
  const byClub = goalsByClub(matches);
  const efficiency = minutesPerGoalTrend(matches);
  const ratings = ratingDistribution(matches);
  const results = resultsBreakdown(matches);
  const knockoutGoals = goalsByKnockoutPhase(matches);
  const byOpponent = goalsByOpponent(matches);
  const byVenue = goalsByVenue(matches);
  const byMonth = goalsByMonth(matches);
  const byAge = goalsByAge(matches);
  const per90 = goalsPer90BySeason(matches);
  const winRates = winPercentageByCompetition(matches);
  const appearancesClub = appearancesByClub(matches);
  const clubContributions = goalsAndAssistsByClub(matches);

  const goalsPerAppearance = byClub
    .map((club) => ({
      name: club.name,
      goalsPerAppearance:
        club.matches > 0
          ? Number((club.goals / club.matches).toFixed(3))
          : 0,
      goals: club.goals,
      appearances: club.matches,
    }))
    .sort((a, b) => b.goalsPerAppearance - a.goalsPerAppearance);

  const assistsByClubTotals = matches.reduce((totals, match) => {
    if (!match.team) return totals;
    totals[match.team] = (totals[match.team] || 0) + (match.assists || 0);
    return totals;
  }, {});

  const assistsClub = Object.entries(assistsByClubTotals)
    .map(([name, assists]) => ({ name, assists }))
    .sort((a, b) => b.assists - a.assists);

  const contributionsPerMatch = bySeason.map((season) => ({
    season: season.season,
    contributionsPerMatch:
      season.matches > 0
        ? Number(
            ((season.goals + season.assists) / season.matches).toFixed(2)
          )
        : 0,
    goals: season.goals,
    assists: season.assists,
    matches: season.matches,
  }));

  const charts = [
    {
      title: "Goals & assists by season",
      description: "Season-by-season output across all competitions.",
      data: bySeason,
      xKey: "season",
      keys: [
        { key: "goals", name: "Goals", color: GOLD },
        { key: "assists", name: "Assists", color: TURF },
      ],
      explanation: {
        shows: "The goals and assists recorded for each season in the archive.",
        calculation: "Goals and assists are summed across the logged matches for each season.",
        interpretation: "Compare the two series to see how Ronaldo's recorded goal-scoring and creative output changed over time.",
        limitation: "Season totals are only as complete as the matches and assists documented in the archive.",
      },
    },
    {
      title: "Goals by competition",
      description: "Where the goals in this log were scored.",
      type: "pie",
      data: byCompetition,
      xKey: "name",
      valueKey: "goals",
      explanation: {
        shows: "The distribution of recorded goals across competitions.",
        calculation: "Goals are grouped by competition. The chart displays the six leading categories where possible, combining the remainder into Other.",
        interpretation: "Larger slices represent competitions with more goals in the archive.",
        limitation: "The chart describes the logged dataset, not necessarily every goal in Ronaldo's career.",
      },
    },
    {
      title: "Goals by club",
      description: "Total goals logged per club represented in this data.",
      data: byClub,
      xKey: "name",
      horizontal: true,
      height: "h-80",
      explanation: {
        shows: "Ronaldo's recorded goals grouped by club.",
        calculation: "Goals from each logged match are summed by the team field.",
        interpretation: "Compare the recorded totals between clubs represented in the archive.",
        limitation: "Incomplete club or match coverage can affect comparisons.",
      },
    },
    {
      title: "Match rating distribution",
      description: "How often each performance level appears across logged matches.",
      data: ratings,
      xKey: "label",
      keys: [{ key: "count", name: "Matches", color: GOLD }],
      explanation: {
        shows: "The number of logged matches falling into each rating band.",
        calculation: "Available match ratings are grouped into score ranges. Matches without a recorded rating are excluded.",
        interpretation: "Higher bars show rating bands that occur more frequently in the available data.",
        limitation: "Only recorded ratings are included, and ratings can vary by source and methodology.",
      },
    },
    {
      title: "Results breakdown",
      description: "Every logged match, by result.",
      type: "pie",
      data: results,
      xKey: "name",
      valueKey: "value",
      pieColors: { Wins: TURF, Draws: PAPER_DIM, Losses: "#8b3a3a" },
      explanation: {
        shows: "The split between wins, draws, and losses in the logged matches.",
        calculation: "Each match is counted once according to its recorded result.",
        interpretation: "The size of each slice indicates how frequently that result appears.",
        limitation: "This reflects the match log's coverage and recorded result classifications.",
      },
    },
    {
      title: "Goals by knockout phase",
      description: "Goals in cup and tournament knockout rounds.",
      data: knockoutGoals,
      xKey: "name",
      angleLabels: true,
      explanation: {
        shows: "Goals grouped by recognized knockout stages, such as the round of 16, semi-finals, and final.",
        calculation: "Recorded goals are summed for matches whose stage is recognized as a knockout phase by the archive's stats helper.",
        interpretation: "Compare the goal totals across the stages shown.",
        limitation: "League and group matches are excluded. Unrecognized or inconsistently labeled stages may not be represented.",
      },
    },
    {
      title: "Most goals against",
      description: "The 15 opponents against whom the most goals were logged.",
      data: byOpponent,
      xKey: "name",
      horizontal: true,
      height: "h-[28rem]",
      explanation: {
        shows: "The opponents against whom Ronaldo has the highest recorded goal totals in this dataset.",
        calculation: "Goals are grouped by opponent, sorted from highest to lowest, and limited to 15 opponents.",
        interpretation: "Longer bars indicate more recorded goals against that opponent.",
        limitation: "Opponent names and totals depend on the completeness and consistency of match records.",
      },
    },
    {
      title: "Goals by venue",
      description: "Goals scored at home, away, and at neutral venues.",
      data: byVenue,
      xKey: "name",
      keys: [{ key: "goals", name: "Goals", color: TURF }],
      explanation: {
        shows: "Goals grouped by the recorded venue classification.",
        calculation: "Goals are summed for matches labeled Home, Away, or Neutral.",
        interpretation: "Compare the total goals recorded in each venue category.",
        limitation: "Matches with missing or different venue labels may not be included in these categories.",
      },
    },
    {
      title: "Goals by month",
      description: "Career goals grouped by calendar month.",
      data: byMonth,
      xKey: "name",
      angleLabels: true,
      explanation: {
        shows: "How the recorded goals are distributed across the months of the calendar year.",
        calculation: "Goals are summed by the month extracted from each match date.",
        interpretation: "Higher bars show months with more recorded goals across the archive's timeline.",
        limitation: "This combines multiple seasons and years; it does not by itself show that a particular month is consistently more productive.",
      },
    },
    {
      title: "Goals by age",
      description: "Scoring output by Ronaldo's age at the time of each match.",
      data: byAge,
      xKey: "age",
      keys: [{ key: "goals", name: "Goals", color: GOLD_BRIGHT }],
      explanation: {
        shows: "Goals grouped by Ronaldo's age when the match took place.",
        calculation: "Age is calculated from the match date and Ronaldo's birth date; goals are summed for each age.",
        interpretation: "Compare recorded scoring totals at different ages.",
        limitation: "Age totals depend on match-log coverage at each stage of his career and do not adjust for appearances or minutes played.",
      },
    },
    {
      title: "Goals per 90 by season",
      description: "Scoring efficiency adjusted for recorded minutes played.",
      type: "line",
      data: per90,
      xKey: "season",
      keys: [{ key: "goalsPer90", name: "Goals per 90", color: GOLD_BRIGHT }],
      angleLabels: true,
      height: "h-80",
      explanation: {
        shows: "The number of recorded goals per 90 minutes in each season.",
        calculation: "Season goals are divided by season minutes played and multiplied by 90.",
        interpretation: "A higher value means a higher scoring rate relative to recorded playing time; it does not necessarily mean more total goals.",
        limitation: "Seasons with missing minutes or incomplete match coverage may not be directly comparable. Very small minute totals can produce unstable rates.",
      },
    },
    {
      title: "Win percentage by competition",
      description: "Win rate in competitions with at least five logged matches.",
      data: winRates,
      xKey: "name",
      horizontal: true,
      height: "h-[28rem]",
      keys: [{ key: "winPercentage", name: "Win rate (%)", color: TURF }],
      explanation: {
        shows: "The percentage of logged matches won in each displayed competition.",
        calculation: "Wins divided by logged matches, multiplied by 100. Only competitions with at least five logged matches are included; the chart shows up to ten.",
        interpretation: "Higher percentages indicate a larger share of logged matches ending in wins.",
        limitation: "This is a team result statistic for matches involving Ronaldo, not a measure of his individual performance. Competition sample sizes differ.",
      },
    },
    {
      title: "Appearances by club",
      description: "Logged competitive appearances for each club.",
      data: appearancesClub,
      xKey: "name",
      horizontal: true,
      keys: [{ key: "appearances", name: "Appearances", color: GOLD }],
      explanation: {
        shows: "The number of match records associated with each club.",
        calculation: "Each record with a team name contributes one appearance to that club.",
        interpretation: "Use this to compare the volume of logged matches across clubs.",
        limitation: "This method counts records as appearances; it relies on the match log containing the intended appearances and excluding duplicates.",
      },
    },
    {
      title: "Goals + assists by club",
      description: "Attacking contributions logged for each club.",
      data: clubContributions,
      xKey: "name",
      horizontal: true,
      height: "h-80",
      keys: [
        { key: "goals", name: "Goals", color: GOLD },
        { key: "assists", name: "Assists", color: TURF },
      ],
      explanation: {
        shows: "Recorded goals and assists grouped by club.",
        calculation: "Goals and assists are summed separately for matches associated with each club.",
        interpretation: "Compare each club's recorded scoring and assisting contributions.",
        limitation: "Assists may be less consistently documented across historical seasons and sources than goals.",
      },
    },
    {
      title: "Goals per appearance by club",
      description: "Recorded goals relative to the number of logged matches for each club.",
      data: goalsPerAppearance,
      xKey: "name",
      horizontal: true,
      height: "h-80",
      keys: [{ key: "goalsPerAppearance", name: "Goals per appearance", color: GOLD_BRIGHT }],
      explanation: {
        shows: "The average number of recorded goals per logged appearance for each club.",
        calculation: "Recorded goals for a club divided by the number of match records associated with that club.",
        interpretation: "A higher value means more recorded goals per appearance in this dataset.",
        limitation: "This is sensitive to incomplete match coverage and does not adjust for substitute appearances or minutes played.",
      },
    },
    {
      title: "Assists by club",
      description: "Recorded assists grouped by club.",
      data: assistsClub,
      xKey: "name",
      horizontal: true,
      keys: [{ key: "assists", name: "Assists", color: TURF }],
      explanation: {
        shows: "The assists recorded for each club represented in the match log.",
        calculation: "The assists field is summed across the logged matches for each club.",
        interpretation: "Compare recorded assist totals between clubs.",
        limitation: "Historical assist data may be incomplete or vary by source, so totals should be interpreted in the context of archive coverage.",
      },
    },
    {
      title: "Goal contributions per match by season",
      description: "Average recorded goals plus assists per logged match in each season.",
      type: "line",
      data: contributionsPerMatch,
      xKey: "season",
      keys: [
        {
          key: "contributionsPerMatch",
          name: "Contributions per match",
          color: GOLD_BRIGHT,
        },
      ],
      angleLabels: true,
      height: "h-80",
      explanation: {
        shows: "The average recorded goals and assists per logged match for each season.",
        calculation: "Season goals plus season assists, divided by the number of logged matches in that season.",
        interpretation: "A higher value indicates more recorded goal contributions per logged match.",
        limitation: "This metric treats each match record equally, regardless of minutes played. Incomplete match or assist coverage affects comparisons.",
      },
    },
    {
      title: "Minutes per goal by season",
      description: "How many recorded minutes it took to score each goal, on average.",
      type: "line",
      data: efficiency,
      xKey: "season",
      keys: [{ key: "minutesPerGoal", name: "Minutes per goal", color: TURF }],
      angleLabels: true,
      height: "h-80",
      explanation: {
        shows: "The average recorded playing time per goal in each season.",
        calculation: "Season minutes played divided by season goals. Seasons without goals are shown as zero by the underlying helper and should not be interpreted as a genuine rate.",
        interpretation: "For seasons with goals, a lower value indicates fewer recorded minutes per goal.",
        limitation: "The metric depends on complete minutes and goal totals. A season with no goals does not have a meaningful minutes-per-goal rate.",
      },
    },
  ];

  const mostProlificSeason = [...bySeason].sort(
    (a, b) => b.goals - a.goals
  )[0];

  const qualifyingPer90 = per90.filter((season) => season.minutes >= 900);
  const bestScoringRate = [...qualifyingPer90].sort(
    (a, b) => b.goalsPer90 - a.goalsPer90
  )[0];

  const leadingCompetition = competitionGoals[0];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Visualizations
      </p>

      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        The numbers, visualized
      </h1>

      <p className="mt-3 max-w-3xl leading-7 text-paper-dim">
        Explore Cristiano Ronaldo's recorded career statistics through
        interactive charts covering goals, assists, clubs, competitions,
        match results, and scoring efficiency. Every chart includes an
        explanation of its calculation and limitations, and its data can
        be downloaded for further analysis.
      </p>

      <section className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          Beyond the numbers
        </p>

        <h2 className="mt-2 font-display text-2xl font-semibold text-paper">
          Key findings
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">
          These highlights are calculated from the matches currently
          recorded in the archive. They should not be treated as
          comprehensive career totals unless the underlying dataset is complete.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-line bg-pitch-raised p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">
              Most prolific season
            </p>
            <p className="mt-3 font-display text-4xl font-semibold text-gold">
              {mostProlificSeason?.goals ?? "—"}
            </p>
            <h3 className="mt-2 font-semibold text-paper">
              {mostProlificSeason?.season ?? "No data"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-paper-dim">
              Recorded goals in the season with the highest goal total in
              the archive.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-pitch-raised p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">
              Best scoring rate
            </p>
            <p className="mt-3 font-display text-4xl font-semibold text-gold">
              {bestScoringRate
                ? bestScoringRate.goalsPer90.toFixed(2)
                : "—"}
            </p>
            <h3 className="mt-2 font-semibold text-paper">
              {bestScoringRate?.season ?? "No qualifying season"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-paper-dim">
              Goals per 90 recorded minutes, among seasons with at least
              900 recorded minutes.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-pitch-raised p-5">
            <p className="font-mono text-xs uppercase tracking-wider text-paper-dim">
              Leading competition
            </p>
            <p className="mt-3 font-display text-4xl font-semibold text-gold">
              {leadingCompetition?.goals ?? "—"}
            </p>
            <h3 className="mt-2 font-semibold text-paper">
              {leadingCompetition?.name ?? "No data"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-paper-dim">
              The competition with the highest recorded goal total in the
              archive.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {charts.map((chart) => (
          <ChartCard key={chart.title} chart={chart} />
        ))}
      </div>

      <p className="mt-8 text-xs leading-5 text-paper-dim">
        Data note: Visualizations are generated from The Ronaldo Archive's
        current match log. Missing matches, playing-time data, assists, ratings,
        or inconsistent source classifications can affect the results.
        Downloads contain the data used by each chart.
      </p>
    </main>
  );
}