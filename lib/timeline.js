import fs from "node:fs";
import path from "node:path";

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
      const [rawDate, description] = parseCsvLine(line);
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
        year,
        month,
        day,
        description: description.trim(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date));
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

  return buildPresentation("Career moment", "A moment in Ronaldo's career", null, description);
}
