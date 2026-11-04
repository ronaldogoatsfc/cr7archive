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


export function getEventPresentation(event) {
  const description = event.description.toLowerCase();

  // Awards take priority over match statistics: the achievement itself is
  // the defining feature of these events.
  const award = description.match(/ballon d['’]?or|the best fifa|fifa best|european golden shoe|golden shoe|puskas|player of the year/);
  if (award) {
    const awardName = award[0]
      .replace(/d['’]?or/, "d'Or")
      .replace(/\bthe best fifa\b|\bfifa best\b/, "The Best FIFA")
      .replace(/\beuropean golden shoe\b|\bgolden shoe\b/, "Golden Shoe")
      .replace(/\bpuskas\b/, "Puskas Award")
      .replace(/\bplayer of the year\b/, "Player of the Year")
      .toUpperCase();
    return {
      category: "Achievement",
      headline: "An individual award triumph",
      highlight: { label: awardName, value: "WINNER" },
    };
  }

  if (/\b(poker|repoker|four goals)\b/.test(description)) {
    return {
      category: "Performance",
      headline: "A remarkable goalscoring performance",
      highlight: {
        label: "GOALS",
        value: /repoker/.test(description) ? "5" : "4",
      },
    };
  }

  if (/\bhat[- ]trick\b/.test(description)) {
    return {
      category: "Performance",
      headline: "A hat-trick performance",
      highlight: { label: "GOALS", value: "3" },
    };
  }

  if (/\bbrace\b|scored twice|two goals/.test(description)) {
    return {
      category: "Performance",
      headline: "A two-goal performance",
      highlight: { label: "GOALS", value: "2" },
    };
  }

  const dribbles = description.match(/(\d+)\s+(?:successful\s+)?dribbles?/);
  if (dribbles) {
    return {
      category: "Performance",
      headline: "A standout dribbling performance",
      highlight: { label: "DRIBBLES", value: dribbles[1] },
    };
  }

  if (/\b10\s*\/\s*10\b|perfect 10|perfect rating/.test(description)) {
    return {
      category: "Performance",
      headline: "A perfect-rated performance",
      highlight: { label: "MATCH RATING", value: "10/10" },
    };
  }

  const milestone = description.match(/\b(\d{2,4})(?:st|nd|rd|th)?\s+(?:career\s+)?(goals?|appearances?|caps?)\b/);
  if (milestone) {
    return {
      category: "Milestone",
      headline: "A career milestone",
      highlight: {
        label: milestone[2].toUpperCase().replace(/S$/, ""),
        value: milestone[1],
      },
    };
  }

  if (/record|all-time top scorer|all time top scorer/.test(description)) {
    return {
      category: "Milestone",
      headline: "A record-breaking moment",
      highlight: { label: "CAREER RECORD", value: "SET" },
    };
  }

  if (/debut/.test(description)) {
    return {
      category: "Milestone",
      headline: "A career debut",
      highlight: { label: "MILESTONE", value: "DEBUT" },
    };
  }

  if (
    /won (?:his|her|the|a|another) [^.!?]*(?:trophy|title|cup|league|championship)|won (?:la liga|serie a|the premier league|the champions league|the world cup|the european championship|the euros|the nations league)|clinched (?:the|a) [^.!?]*title|became champions?/.test(description)
  ) {
    return {
      category: "Achievement",
      headline: "A trophy-winning moment",
      highlight: { label: "ACHIEVEMENT", value: "CHAMPION" },
    };
  }

  return {
    category: "Career moment",
    headline: "A moment in Ronaldo's career",
    highlight: null,
  };
}
