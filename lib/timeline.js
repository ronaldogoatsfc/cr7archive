import fs from "node:fs";
import path from "node:path";
import allMatches from "@/data/all-matches";
import unofficialMatches from "@/data/unofficial-matches.json";
import trophies from "@/data/trophies.json";

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"' && line[i + 1] === '"' && quoted) {
      value += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values;
}

export function getTimelineEvents() {
  const filePath = path.join(process.cwd(), "data", "timeline", "events.csv");
  const csv = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");

  return csv
    .split(/\r?\n/)
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const [rawDate, description, details] = parseCsvLine(line);
      const [month, day, year] = rawDate.split("/").map(Number);

      if (!month || !day || !year || !description) return null;

      const date = new Date(Date.UTC(year, month - 1, day));
      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
      ) {
        return null;
      }

      return {
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        anchorId: `timeline-${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}-${description.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)}`,
        year,
        month,
        day,
        description: description.trim(),
        details: details?.trim() || null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTimelineMatch(event) {
  const normalize = (value) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const description = normalize(event.description);
  const official = allMatches.filter((match) => match.date === event.date);
  const unofficial = unofficialMatches.filter((match) => match.date === event.date);
  const findMatch = (matches) => {
    const opponentMatch = matches.find((match) => {
      const opponent = normalize(match.opponent || "");
      return opponent && description.includes(opponent);
    });
    return opponentMatch || (matches.length === 1 ? matches[0] : null);
  };

  const officialMatch = findMatch(official);
  if (officialMatch) return officialMatch;
  const unofficialMatch = findMatch(unofficial);
  return unofficialMatch ? { ...unofficialMatch, dataSource: "unofficial" } : null;
}

function summarizeTimelineMatches(matches) {
  const fields = [
    ["shots", "Shots"],
    ["shotsOnTarget", "Shots on target"],
    ["keyPasses", "Key passes"],
    ["bigChancesCreated", "Big chances created"],
    ["successfulDribbles", "Successful dribbles"],
    ["aerialDuelsWon", "Aerial duels won"],
    ["freeKickAttempts", "Free-kick attempts"],
    ["accurateThroughballs", "Accurate throughballs"],
    ["xG", "Expected goals (xG)"],
    ["xA", "Expected assists (xA)"],
    ["rating", "Average rating"],
    ["motm", "Man of the Match awards"],
  ];
  const advanced = fields.map(([key, label]) => {
    const recorded = matches
      .map((match) => match.stats?.[key])
      .filter((value) => value !== undefined && value !== null);
    if (!recorded.length) return null;
    const total = key === "rating"
      ? recorded.reduce((sum, value) => sum + Number(value), 0) / recorded.length
      : key === "motm"
        ? recorded.filter(Boolean).length
        : recorded.reduce((sum, value) => sum + Number(value), 0);
    return {
      key,
      label,
      value: key === "rating" ? Number(total.toFixed(2)) : key === "xG" || key === "xA" ? Number(total.toFixed(2)) : total,
      coverage: recorded.length,
    };
  }).filter(Boolean);

  return {
    appearances: matches.length,
    goals: matches.reduce((sum, match) => sum + (match.goals || 0), 0),
    assists: matches.reduce((sum, match) => sum + (match.assists || 0), 0),
    minutes: matches.reduce((sum, match) => sum + (match.minutesPlayed || 0), 0),
    wins: matches.filter((match) => match.result === "W").length,
    draws: matches.filter((match) => match.result === "D").length,
    losses: matches.filter((match) => match.result === "L").length,
    advanced,
  };
}

function getStatsSnapshot(title, period, predicate) {
  const matches = allMatches.filter(predicate);
  return { title, period, stats: summarizeTimelineMatches(matches) };
}

export function getTimelineDetails(event) {
  const date = event.date;
  const snapshotConfigs = {
    "2007-04-22": [
      { title: "2006/07 Premier League", period: "Manchester United · league only", predicate: (m) =>
        m.date >= "2006-07-01" && m.date <= "2007-06-30" &&
        m.team === "Manchester United" && m.competition === "Premier League" },
    ],
    "2008-10-27": [
      { title: "2007/08 season", period: "All competitions · club and Portugal", predicate: (m) => m.season === "2007/08" },
    ],
    "2008-12-02": [
      { title: "2008 through November", period: "January 1 – November 30, 2008 · club and Portugal", predicate: (m) =>
        m.date >= "2008-01-01" && m.date <= "2008-11-30" },
    ],
    "2008-01-12": [
      { title: "2007/08 season", period: "All competitions · club and Portugal", predicate: (m) => m.season === "2007/08" },
      { title: "2008 calendar year", period: "January 1 – December 31, 2008 · club and Portugal", predicate: (m) =>
        m.date >= "2008-01-01" && m.date <= "2008-12-31" },
    ],
    "2014-10-27": [
      { title: "2013/14 La Liga", period: "Real Madrid · league only", predicate: (m) =>
        m.season === "2013/14" && m.competition === "La Liga" },
    ],
    "2017-01-09": [
      { title: "The Best FIFA award period", period: "November 20, 2015 – November 22, 2016 · club and Portugal", predicate: (m) =>
        m.date >= "2015-11-20" && m.date <= "2016-11-22" },
    ],
    "2017-10-23": [
      { title: "The Best FIFA award period", period: "November 20, 2016 – July 2, 2017 · club and Portugal", predicate: (m) =>
        m.date >= "2016-11-20" && m.date <= "2017-07-02" },
    ],
    "2017-12-07": [
      { title: "2017 through November", period: "January 1 – November 30, 2017 · club and Portugal", predicate: (m) =>
        m.date >= "2017-01-01" && m.date <= "2017-11-30" },
    ],
  };
  if (snapshotConfigs[date]) {
    return {
      stats: snapshotConfigs[date].map(({ title, period, predicate }) =>
        getStatsSnapshot(title, period, predicate)
      ),
    };
  }

  if (date === "2021-05-22") {
    const clubs = ["Manchester United", "Real Madrid", "Juventus"];
    return {
      trophies: clubs.map((club) => ({
        club,
        items: trophies.filter((trophy) =>
          trophy.club === club && trophy.domestic && !trophy.isFriendly
        ).sort((a, b) => a.year - b.year || a.name.localeCompare(b.name)),
      })),
    };
  }

  const transfers = {
    "2009-07-06": {
      title: "Real Madrid presentation",
      description: "Ronaldo joined Real Madrid from Manchester United on a six-year contract. The transfer fee was reported as €94 million, then a world record, and approximately 80,000 supporters attended his presentation at the Santiago Bernabéu.",
      facts: [
        { label: "Transfer fee", value: "€94 million" },
        { label: "Contract", value: "Six years · through 2015" },
        { label: "Presentation attendance", value: "Approximately 80,000" },
      ],
      note: "The fee and attendance are widely reported figures from the 2009 presentation.",
    },
    "2018-07-10": {
      title: "Juventus signing",
      description: "Juventus signed Ronaldo from Real Madrid on a four-year contract. The club announced a €100 million transfer fee, plus up to €12 million in additional costs.",
      facts: [
        { label: "Transfer fee", value: "€100 million" },
        { label: "Additional costs", value: "Up to €12 million" },
        { label: "Contract", value: "Four years · through June 2022" },
      ],
    },
    "2022-12-30": {
      title: "Al-Nassr signing",
      description: "Ronaldo joined Al-Nassr as a free agent after his Manchester United contract was terminated. He signed through June 2025.",
      facts: [
        { label: "Contract", value: "Through June 2025" },
        { label: "Transfer status", value: "Free agent" },
      ],
      note: "The widely reported €200 million annual compensation package was not disclosed as an official transfer fee, so it is intentionally not presented as one.",
    },
    "2023-01-03": {
      title: "Al-Nassr unveiling",
      description: "Ronaldo was presented to supporters at Mrsool Park in Riyadh, beginning his Saudi Pro League chapter.",
      facts: [
        { label: "Club", value: "Al-Nassr" },
        { label: "Shirt number", value: "7" },
        { label: "Stadium", value: "Mrsool Park (now Alawwal Park)" },
      ],
    },
  };
  if (transfers[date]) return { transfer: transfers[date] };

  if (date === "2024-08-29") {
    const uclMatches = allMatches.filter((m) => m.competition === "UEFA Champions League");
    return {
      record: {
        title: "UEFA Champions League career record",
        facts: [
          { label: "Goals", value: uclMatches.reduce((sum, m) => sum + (m.goals || 0), 0) },
          { label: "Appearances", value: uclMatches.length },
          { label: "Titles", value: 5 },
          { label: "Top-scorer awards", value: 7 },
        ],
        note: "Career totals are calculated from the archive's Champions League match logs.",
      },
    };
  }

  if (date === "2026-11-05") {
    const portugalMatches = allMatches.filter((m) => m.team === "Portugal");
    const stats = summarizeTimelineMatches(portugalMatches);
    return {
      record: {
        title: "Portugal senior career",
        facts: [
          { label: "Appearances in archive", value: stats.appearances },
          { label: "Goals in archive", value: stats.goals },
          { label: "Assists in archive", value: stats.assists },
          { label: "Minutes recorded", value: stats.minutes.toLocaleString("en-US") },
        ],
        note: "Figures are calculated from Portugal senior-team match logs in The Ronaldo Archive.",
      },
    };
  }

  return null;
}

export function getOnThisDayEvent(now = new Date()) {
  const today = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    timeZone: "America/New_York",
  }).formatToParts(now);
  const month = Number(today.find((part) => part.type === "month").value);
  const day = Number(today.find((part) => part.type === "day").value);

  const matches = getTimelineEvents().filter(
    (event) => event.month === month && event.day === day
  );

  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}


function buildPresentation(category, headline, primaryHighlight, description) {
  const highlights = primaryHighlight ? [primaryHighlight] : [];
  const addHighlight = (label, value) => {
    if (!highlights.some((item) => item.label === label)) {
      highlights.push({ label, value });
    }
  };

  // Add other statistics only when the event description actually mentions them.
  const assists = description.match(/(?:assisted|assisting) (?:once|one goal|one|twice|two goals|two|three times|three goals|three)|one assist|two assists|three assists|hat-trick of assists/);
  if (assists) {
    const value = /twice|two/.test(assists[0])
      ? "2"
      : /three|hat-trick/.test(assists[0])
        ? "3"
        : "1";
    addHighlight("ASSISTS", value);
  }

  const dribbles = description.match(/(\d+)\s+(?:successful\s+)?dribbles?/);
  if (dribbles) addHighlight("DRIBBLES", dribbles[1]);

  if (/\b10\s*\/\s*10\b|perfect 10|perfect rating/.test(description)) {
    addHighlight("MATCH RATING", "10/10");
  }

  const keyPasses = description.match(/(\d+)\s+key passes?/);
  if (keyPasses) addHighlight("KEY PASSES", keyPasses[1]);

  const shotsOnTarget = description.match(/(\d+)\s+shots? on target/);
  if (shotsOnTarget) addHighlight("SHOTS ON TARGET", shotsOnTarget[1]);

  const chances = description.match(/(\d+)\s+(?:big )?chances? created/);
  if (chances) addHighlight("CHANCES CREATED", chances[1]);

  return { category, headline, highlights };
}

export function getEventPresentation(event) {
  const description = event.description.toLowerCase();

  // Individual awards take priority over match statistics.
  const award = description.match(/ballon d['’]?or|the best fifa|fifa best|european golden shoe|golden shoe|puskas|player of the year/);
  if (award) {
    const awardName = award[0]
      .replace(/d['’]?or/, "d'Or")
      .replace(/\bthe best fifa\b|\bfifa best\b/, "The Best FIFA")
      .replace(/\beuropean golden shoe\b|\bgolden shoe\b/, "Golden Shoe")
      .replace(/\bpuskas\b/, "Puskas Award")
      .replace(/\bplayer of the year\b/, "Player of the Year")
      .toUpperCase();
    const ordinal = description.match(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(?:st|nd|rd|th))\b/);
    const ordinalValues = {
      first: "1ST",
      second: "2ND",
      third: "3RD",
      fourth: "4TH",
      fifth: "5TH",
      sixth: "6TH",
      seventh: "7TH",
      eighth: "8TH",
      ninth: "9TH",
      tenth: "10TH",
    };
    const awardValue = ordinal
      ? ordinalValues[ordinal[1]] || ordinal[1].toUpperCase()
      : /presented|received/.test(description)
        ? "HONOREE"
        : "WINNER";
    return buildPresentation("Achievement", "An individual award moment", {
      label: awardName,
      value: awardValue,
    }, description);
  }


  const milestone = description.match(/\b(\d{2,4})(?:st|nd|rd|th)?\s+(?:career\s+)?(goals?|appearances?|caps?)\b/);
  if (milestone) {
    return buildPresentation("Milestone", "A career milestone", {
      label: milestone[2].toUpperCase().replace(/S$/, ""),
      value: milestone[1],
    }, description);
  }

  if (/record|all-time top scorer|all time top scorer/.test(description)) {
    return buildPresentation("Milestone", "A record-breaking moment", {
      label: "CAREER RECORD",
      value: "SET",
    }, description);
  }

  if (/debut/.test(description)) {
    return buildPresentation("Milestone", "A career debut", {
      label: "MILESTONE",
      value: "DEBUT",
    }, description);
  }

  if (
    /won [^.!?]*(?:trophy|title|cup|league|championship)|clinched (?:the|a) [^.!?]*(?:title|league|championship)|became champions?/.test(description)
  ) {
    return buildPresentation("Achievement", "A trophy-winning moment", {
      label: "ACHIEVEMENT",
      value: "CHAMPION",
    }, description);
  }

  if (/\b(repoker|five goals)\b/.test(description)) {
    return buildPresentation("Performance", "A remarkable goalscoring performance", {
      label: "GOALS",
      value: "5",
    }, description);
  }

  if (/\b(poker|four goals)\b/.test(description)) {
    return buildPresentation("Performance", "A remarkable goalscoring performance", {
      label: "GOALS",
      value: "4",
    }, description);
  }

  if (/\bhat[- ]trick\b/.test(description)) {
    return buildPresentation("Performance", "A hat-trick performance", {
      label: "GOALS",
      value: "3",
    }, description);
  }

  if (/\bbrace\b|scored twice|two goals/.test(description)) {
    return buildPresentation("Performance", "A two-goal performance", {
      label: "GOALS",
      value: "2",
    }, description);
  }

  const dribbles = description.match(/(\d+)\s+(?:successful\s+)?dribbles?/);
  if (dribbles) {
    return buildPresentation("Performance", "A standout dribbling performance", {
      label: "DRIBBLES",
      value: dribbles[1],
    }, description);
  }

  if (/\b10\s*\/\s*10\b|perfect 10|perfect rating/.test(description)) {
    return buildPresentation("Performance", "A perfect-rated performance", {
      label: "MATCH RATING",
      value: "10/10",
    }, description);
  }

  if (
    /\b(scored|assisted|dribbled|performance|masterclass|header|bicycle kick|overhead kick|free kick|solo run|solo goal)\b/.test(description)
  ) {
    return buildPresentation("Performance", "A notable match performance", null, description);
  }

  return buildPresentation("Career moment", "A moment in Ronaldo's career", null, description);
}
