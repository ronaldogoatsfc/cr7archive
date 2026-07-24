// Shared helpers for deriving filter options and aggregate stats from matches.json.
// Pure functions only — safe to import in both server and client components.

export function getUniqueValues(matches, key) {
  return Array.from(new Set(matches.map((m) => m[key]))).sort();
}

export function getSeasonsSorted(matches) {
  // Seasons like "2024/25" or single years like "2016" — sort descending (most recent first).
  return Array.from(new Set(matches.map((m) => m.season))).sort((a, b) =>
    b.localeCompare(a)
  );
}

export function filterMatches(matches, filters) {
  const { season, competition, team, result, venue, search } = filters;
  return matches.filter((m) => {
    if (season && season !== "All" && m.season !== season) return false;
    if (competition && competition !== "All" && m.competition !== competition)
      return false;
    if (team && team !== "All" && m.team !== team) return false;
    if (result && result !== "All" && m.result !== result) return false;
    if (venue && venue !== "All" && m.venue !== venue) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = `${m.opponent} ${m.competition} ${m.stage}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function careerTotals(matches) {
  return matches.reduce(
    (acc, m) => {
      acc.matches += 1;
      acc.goals += m.goals;
      acc.assists += m.assists;
      acc.minutes += m.minutesPlayed;
      acc.wins += m.result === "W" ? 1 : 0;
      acc.draws += m.result === "D" ? 1 : 0;
      acc.losses += m.result === "L" ? 1 : 0;
      acc.yellowCards += m.yellowCard ? 1 : 0;
      acc.redCards += m.redCard ? 1 : 0;
      return acc;
    },
    {
      matches: 0,
      goals: 0,
      assists: 0,
      minutes: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      yellowCards: 0,
      redCards: 0,
    }
  );
}

export function goalsAndAssistsBySeason(matches) {
  const bySeason = {};
  for (const m of matches) {
    if (!bySeason[m.season]) {
      bySeason[m.season] = { season: m.season, goals: 0, assists: 0, matches: 0 };
    }
    bySeason[m.season].goals += m.goals;
    bySeason[m.season].assists += m.assists;
    bySeason[m.season].matches += 1;
  }
  return Object.values(bySeason).sort((a, b) => a.season.localeCompare(b.season));
}

export function goalsByCompetition(matches) {
  const byComp = {};
  for (const m of matches) {
    if (!byComp[m.competition]) {
      byComp[m.competition] = { name: m.competition, goals: 0 };
    }
    byComp[m.competition].goals += m.goals;
  }
  return Object.values(byComp)
    .filter((c) => c.goals > 0)
    .sort((a, b) => b.goals - a.goals);
}

export function goalsByClub(matches) {
  const byClub = {};
  for (const m of matches) {
    if (!byClub[m.team]) {
      byClub[m.team] = { name: m.team, goals: 0, matches: 0 };
    }
    byClub[m.team].goals += m.goals;
    byClub[m.team].matches += 1;
  }
  return Object.values(byClub).sort((a, b) => b.goals - a.goals);
}

export function getYearsSorted(trophies) {
  return Array.from(new Set(trophies.map((t) => t.year))).sort((a, b) => b - a);
}

export function filterTrophies(trophies, filters) {
  const { year, season, club, competition, domestic, includeFriendlies } = filters;
  return trophies.filter((t) => {
    if (!includeFriendlies && t.isFriendly) return false;
    if (year && year !== "All" && String(t.year) !== String(year)) return false;
    if (season && season !== "All" && t.season !== season) return false;
    if (club && club !== "All" && t.club !== club) return false;
    if (competition && competition !== "All" && t.name !== competition) return false;
    if (domestic && domestic !== "All") {
      const wantDomestic = domestic === "Domestic";
      if (t.domestic !== wantDomestic) return false;
    }
    return true;
  });
}

export function filterHonors(honors, filters) {
  const { year, season, club, award, domestic } = filters;
  return honors.filter((h) => {
    if (year && year !== "All" && String(h.year) !== String(year)) return false;
    if (season && season !== "All" && h.season !== season) return false;
    if (club && club !== "All" && h.club !== club) return false;
    if (award && award !== "All" && h.name !== award) return false;
    if (domestic && domestic !== "All") {
      const wantDomestic = domestic === "Domestic";
      if (h.domestic !== wantDomestic) return false;
    }
    return true;
  });
}

export function trophyTotal(trophies) {
  return trophies.filter((t) => !t.isFriendly).length;
}

export function minutesPerGoalTrend(matches) {
  // Minutes played per goal scored, grouped by season — lower is more efficient.
  return goalsAndAssistsBySeason(matches).map((s) => {
    const seasonMatches = matches.filter((m) => m.season === s.season);
    const minutes = seasonMatches.reduce((sum, m) => sum + m.minutesPlayed, 0);
    return {
      season: s.season,
      minutesPerGoal: s.goals > 0 ? Math.round(minutes / s.goals) : 0,
    };
  });
}

export function ratingDistribution(matches) {
  const buckets = {
    "< 6.0": 0,
    "6.0–6.9": 0,
    "7.0–7.9": 0,
    "8.0–8.9": 0,
    "9.0–9.9": 0,
    "10.0": 0,
  };
  for (const m of matches) {
    const rating = m.stats?.rating;
    if (rating === undefined || rating === null) continue;
    if (rating >= 10) buckets["10.0"] += 1;
    else if (rating >= 9) buckets["9.0–9.9"] += 1;
    else if (rating >= 8) buckets["8.0–8.9"] += 1;
    else if (rating >= 7) buckets["7.0–7.9"] += 1;
    else if (rating >= 6) buckets["6.0–6.9"] += 1;
    else buckets["< 6.0"] += 1;
  }
  return Object.entries(buckets).map(([label, count]) => ({ label, count }));
}

export function resultsBreakdown(matches) {
  const totals = careerTotals(matches);
  return [
    { name: "Wins", value: totals.wins },
    { name: "Draws", value: totals.draws },
    { name: "Losses", value: totals.losses },
  ];
}

const KNOCKOUT_PHASE_ORDER = [
  "Play-off",
  "Round of 64",
  "Round of 32",
  "Round of 16",
  "Quarterfinal",
  "Semifinal",
  "Final",
];

function normalizePhase(stage) {
  if (!stage) return null;
  const s = stage.toLowerCase();
  if (s.includes("play-off") || s.includes("playoff")) return "Play-off";
  if (s.includes("64")) return "Round of 64";
  if (s.includes("32")) return "Round of 32";
  if (s.includes("16")) return "Round of 16";
  if (s.includes("quarter")) return "Quarterfinal";
  if (s.includes("semi")) return "Semifinal";
  if (s.includes("final")) return "Final";
  return null;
}

export function goalsByKnockoutPhase(matches) {
  const byPhase = {};
  for (const m of matches) {
    const phase = normalizePhase(m.stage);
    if (!phase) continue;
    if (!byPhase[phase]) byPhase[phase] = { name: phase, goals: 0, matches: 0 };
    byPhase[phase].goals += m.goals;
    byPhase[phase].matches += 1;
  }
  return KNOCKOUT_PHASE_ORDER.map((p) => byPhase[p]).filter(Boolean);
}