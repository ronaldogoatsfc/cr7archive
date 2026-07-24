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
} from "@/lib/stats";

const GOLD = "#c9a227";
const GOLD_BRIGHT = "#e2bd45";
const TURF = "#4a7a5f";
const LINE = "rgba(242, 240, 234, 0.12)";
const PAPER_DIM = "#b9b6ad";
const PIE_COLORS = [GOLD, TURF, "#8b3a3a", "#6b7a8f", "#e2bd45", "#3d5a4c"];

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
  const otherGoals = rest.reduce((sum, c) => sum + c.goals, 0);
  return [...top, { name: "Other", goals: otherGoals }];
}

function ChartCard({ title, description, children, height = "h-72" }) {
  return (
    <div className="rounded-2xl border border-line bg-pitch-raised p-6">
      <h3 className="font-display text-lg font-semibold text-paper">{title}</h3>
      {description && <p className="mt-1 text-sm text-paper-dim">{description}</p>}
      <div className={`mt-6 ${height}`}>{children}</div>
    </div>
  );
}

export default function VisualizationsPage() {
  const bySeason = goalsAndAssistsBySeason(matches);
  const byCompetition = topCompetitions(goalsByCompetition(matches));
  const byClub = goalsByClub(matches);
  const efficiency = minutesPerGoalTrend(matches);
  const ratings = ratingDistribution(matches);
  const results = resultsBreakdown(matches);
  const knockoutGoals = goalsByKnockoutPhase(matches);
  const RESULT_COLORS = { Wins: TURF, Draws: PAPER_DIM, Losses: "#8b3a3a" };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Visualizations
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        The numbers, charted
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Career output broken down by season, competition, and club — built
        from the same match log as the ledger.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Goals & assists by season"
          description="Season-by-season output across all competitions."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bySeason}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis
                dataKey="season"
                stroke={PAPER_DIM}
                fontSize={11}
                tickLine={false}
              />
              <YAxis stroke={PAPER_DIM} fontSize={11} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: LINE }} />
              <Legend wrapperStyle={{ fontSize: 12, color: PAPER_DIM }} />
              <Bar dataKey="goals" fill={GOLD} name="Goals" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="assists"
                fill={TURF}
                name="Assists"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Goals by competition"
          description="Where the goals in this log were scored."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byCompetition}
                dataKey="goals"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {byCompetition.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: 11, color: PAPER_DIM }}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Goals by club"
          description="Total goals logged per club represented in this data."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byClub} layout="vertical">
              <CartesianGrid stroke={LINE} horizontal={false} />
              <XAxis type="number" stroke={PAPER_DIM} fontSize={11} />
              <YAxis
                type="category"
                dataKey="name"
                stroke={PAPER_DIM}
                fontSize={11}
                width={110}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: LINE }} />
              <Bar dataKey="goals" fill={GOLD_BRIGHT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Match rating distribution"
          description="How often each performance level shows up across logged matches."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratings}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis
                dataKey="label"
                stroke={PAPER_DIM}
                fontSize={11}
                tickLine={false}
              />
              <YAxis stroke={PAPER_DIM} fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: LINE }} />
              <Bar dataKey="count" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Results breakdown"
          description="Every logged match, by result."
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={results}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {results.map((entry) => (
                  <Cell key={entry.name} fill={RESULT_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12, color: PAPER_DIM }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Goals by knockout phase"
          description="Cup and tournament knockout rounds only — league and group matches excluded."
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={knockoutGoals}>
              <CartesianGrid stroke={LINE} vertical={false} />
              <XAxis
                dataKey="name"
                stroke={PAPER_DIM}
                fontSize={11}
                tickLine={false}
              />
              <YAxis stroke={PAPER_DIM} fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: LINE }} />
              <Bar dataKey="goals" fill={GOLD_BRIGHT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
