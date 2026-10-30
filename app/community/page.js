import Link from "next/link";
import { ArrowRight, Brain, ChartNoAxesColumn, Trophy } from "lucide-react";
import quizzes from "@/data/quizzes.json";
import allMatches from "@/data/all-matches";
import GuessSeasonGame from "@/components/GuessSeasonGame";

export const metadata = {
  title: "Community Quizzes & Games | The Ronaldo Archive",
  description: "Test your knowledge of Cristiano Ronaldo with career quizzes and interactive season-guessing challenges.",
};

const difficultyStyles = {
  Easy: "text-turf-bright",
  Medium: "text-gold",
  Hard: "text-goal-red",
};

function buildSeasonStats(matches) {
  const seasons = new Map();

  matches.forEach((match) => {
    if (!match.season) return;

    if (!seasons.has(match.season)) {
      seasons.set(match.season, {
        season: match.season,
        appearances: 0,
        goals: 0,
        assists: 0,
      });
    }

    const totals = seasons.get(match.season);
    totals.appearances += 1;
    totals.goals += Number(match.goals) || 0;
    totals.assists += Number(match.assists) || 0;
  });

  return [...seasons.values()].sort((a, b) => b.season.localeCompare(a.season));
}

function hasEnoughUniqueSeasons(seasons) {
  const usable = seasons.filter((season) => season.appearances >= 3);
  const combinations = new Set(
    usable.map((season) => `${season.appearances}-${season.goals}-${season.assists}`)
  );
  return combinations.size >= 4;
}

function getGuessSeasonFilters() {
  const competitions = [...new Set(allMatches.map((match) => match.competition).filter(Boolean))].sort();
  const filters = [
    {
      id: "all",
      label: "All Competitions",
      matches: allMatches,
    },
    {
      id: "international",
      label: "Portugal (International)",
      matches: allMatches.filter((match) => match.team === "Portugal"),
    },
    ...competitions.map((competition) => ({
      id: competition,
      label: competition,
      matches: allMatches.filter((match) => match.competition === competition),
    })),
  ];

  return filters
    .map((filter) => ({
      id: filter.id,
      label: filter.label,
      seasons: buildSeasonStats(filter.matches),
    }))
    .filter((filter) => hasEnoughUniqueSeasons(filter.seasons));
}

export default function CommunityPage() {
  const seasonData = getGuessSeasonFilters();

  return (
    <div className="min-h-screen">
      <section className="border-b border-line bg-pitch-raised/40 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">The Ronaldo Archive · Community</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-paper sm:text-6xl">
            How well do you really know Ronaldo?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-paper-dim sm:text-lg">
            Put your knowledge to the test with quizzes and interactive games covering Ronaldo's career, iconic matches, and statistical milestones. No account needed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-mono uppercase tracking-widest text-paper-dim">
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2"><Brain size={14} /> Quick quizzes</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2"><ChartNoAxesColumn size={14} /> Track your score</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2"><Trophy size={14} /> Replay anytime</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">Choose your challenge</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Quizzes</h2>
          </div>
          <p className="text-sm text-paper-dim">{quizzes.length} quizzes · {quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)} questions</p>
        </div>

        <div className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5" aria-label="Available quizzes">
          {quizzes.map((quiz, index) => (
            <article key={quiz.id} className="group flex w-[290px] shrink-0 snap-start flex-col rounded-2xl border border-line bg-pitch-raised p-6 transition hover:border-gold/60 sm:w-[330px]">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{quiz.category}</span>
                <span className={`font-mono text-[10px] uppercase tracking-widest ${difficultyStyles[quiz.difficulty] || "text-paper-dim"}`}>{quiz.difficulty}</span>
              </div>
              <div className="mt-7 flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-pitch text-gold">
                <span className="font-display text-xl font-semibold">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-paper">{quiz.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-paper-dim">{quiz.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                <span className="font-mono text-xs text-paper-dim">{quiz.questions.length} questions · ~{Math.max(1, Math.ceil(quiz.questions.length * 0.4))} min</span>
                <Link href={`/community/${quiz.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition group-hover:text-gold-bright">
                  Start quiz <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-1 text-xs text-paper-dim">Swipe or scroll horizontally to explore more quizzes.</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-7">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">Play something different</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Mini-games</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">
            Identify seasons from Ronaldo's statistics. Choose a competition and see how well you know his numbers.
          </p>
        </div>
        <GuessSeasonGame seasonData={seasonData} />
      </section>
    </div>
  );
}
