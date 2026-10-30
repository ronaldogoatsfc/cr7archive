"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react";

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function getEligibleSeasons(seasons) {
  const usable = seasons.filter((season) => season.appearances >= 3);
  const combinations = new Map();

  usable.forEach((season) => {
    const key = `${season.appearances}-${season.goals}-${season.assists}`;
    combinations.set(key, (combinations.get(key) || 0) + 1);
  });

  return usable.filter((season) => {
    const key = `${season.appearances}-${season.goals}-${season.assists}`;
    return combinations.get(key) === 1;
  });
}

function createChallenge(seasons, usedSeasons = []) {
  const eligible = getEligibleSeasons(seasons);
  const remaining = eligible.filter((season) => !usedSeasons.includes(season.season));
  const available = remaining.length > 0 ? remaining : eligible;

  if (available.length < 4) return null;

  const target = available[Math.floor(Math.random() * available.length)];
  const distractors = shuffle(
    eligible.filter((season) => season.season !== target.season)
  ).slice(0, 3);

  return {
    target,
    options: shuffle([target.season, ...distractors.map((season) => season.season)]),
  };
}

export default function GuessSeasonGame({ seasonData }) {
  const [filterId, setFilterId] = useState("all");
  const [challenge, setChallenge] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [usedSeasons, setUsedSeasons] = useState([]);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [cycleNotice, setCycleNotice] = useState("");

  const selectedFilter = useMemo(
    () => seasonData.find((filter) => filter.id === filterId) || seasonData[0],
    [filterId, seasonData]
  );

  function startGame() {
    setChallenge(createChallenge(selectedFilter.seasons));
    setSelectedAnswer(null);
    setUsedSeasons([]);
    setScore(0);
    setRounds(0);
    setCycleNotice("");
  }

  function changeFilter(event) {
    setFilterId(event.target.value);
    setChallenge(null);
    setSelectedAnswer(null);
    setUsedSeasons([]);
    setScore(0);
    setRounds(0);
    setCycleNotice("");
  }

  function chooseAnswer(answer) {
    if (selectedAnswer !== null || !challenge) return;
    setSelectedAnswer(answer);
    setRounds((current) => current + 1);
    if (answer === challenge.target.season) {
      setScore((current) => current + 1);
    }
  }

  function nextChallenge() {
    if (!challenge) return;

    const nextUsed = [...usedSeasons, challenge.target.season];
    const eligible = getEligibleSeasons(selectedFilter.seasons);
    const hasMore = eligible.some((season) => !nextUsed.includes(season.season));
    const next = createChallenge(
      selectedFilter.seasons,
      hasMore ? nextUsed : []
    );

    setUsedSeasons(hasMore ? nextUsed : []);
    setCycleNotice(
      hasMore
        ? ""
        : "You've worked through every available season in this category. A new round of seasons is starting."
    );
    setChallenge(next);
    setSelectedAnswer(null);
  }

  const answeredCorrectly = selectedAnswer === challenge?.target.season;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-pitch-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
          <Sparkles size={14} /> Mini-game 01
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-pitch px-3 py-1.5 font-mono text-xs text-paper-dim">
          <Trophy size={13} className="text-gold" />
          {score} / {rounds} correct
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
              Guess the Season
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-paper-dim">
              Use Ronaldo's appearances, goals, and assists to identify the season.
              Choose a competition or take on the full career.
            </p>
          </div>
          <div className="w-full sm:w-64">
            <label htmlFor="guess-season-filter" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim">
              Competition
            </label>
            <select
              id="guess-season-filter"
              value={filterId}
              onChange={changeFilter}
              className="w-full rounded-xl border border-line bg-pitch px-3 py-3 text-sm text-paper outline-none transition focus:border-gold"
            >
              {seasonData.map((filter) => (
                <option key={filter.id} value={filter.id}>{filter.label}</option>
              ))}
            </select>
          </div>
        </div>

        {!challenge ? (
          <div className="mt-6 rounded-xl border border-dashed border-line bg-pitch/70 px-5 py-8 text-center">
            <p className="font-display text-lg font-semibold text-paper">Ready for a challenge?</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-paper-dim">
              Each round gives you three season totals and four possible answers.
              Correct answers are revealed with a short breakdown.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-pitch transition hover:bg-gold-bright"
            >
              Start guessing
            </button>
          </div>
        ) : (
          <>
            <div className="mt-7 flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
                {selectedFilter.label}
              </p>
              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center gap-1.5 text-xs text-paper-dim transition hover:text-gold"
              >
                <RotateCcw size={13} /> Restart game
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="rounded-xl border border-line bg-pitch p-3 text-center sm:p-5">
                <p className="font-display text-3xl font-semibold tabular-nums text-paper sm:text-4xl">
                  {challenge.target.appearances}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper-dim sm:text-[10px]">
                  Appearances
                </p>
              </div>
              <div className="rounded-xl border border-line bg-pitch p-3 text-center sm:p-5">
                <p className="font-display text-3xl font-semibold tabular-nums text-paper sm:text-4xl">
                  {challenge.target.goals}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper-dim sm:text-[10px]">
                  Goals
                </p>
              </div>
              <div className="rounded-xl border border-line bg-pitch p-3 text-center sm:p-5">
                <p className="font-display text-3xl font-semibold tabular-nums text-paper sm:text-4xl">
                  {challenge.target.assists}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper-dim sm:text-[10px]">
                  Assists
                </p>
              </div>
            </div>

            <p className="mt-6 font-display text-lg font-semibold text-paper">
              Which season do these numbers belong to?
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {challenge.options.map((option, index) => {
                const isCorrect = option === challenge.target.season;
                const isSelected = selectedAnswer === option;
                let style = "border-line bg-pitch text-paper hover:border-gold/70";
                if (selectedAnswer !== null && isCorrect) {
                  style = "border-turf-bright/70 bg-turf-bright/10 text-paper";
                } else if (isSelected && !isCorrect) {
                  style = "border-goal-red/70 bg-goal-red/10 text-paper";
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={selectedAnswer !== null}
                    onClick={() => chooseAnswer(option)}
                    className={`flex min-h-14 items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default ${style}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-paper-dim">{String.fromCharCode(65 + index)}</span>
                      {option}
                    </span>
                    {selectedAnswer !== null && isCorrect && <CheckCircle2 size={18} className="shrink-0 text-turf-bright" />}
                    {isSelected && !isCorrect && <XCircle size={18} className="shrink-0 text-goal-red" />}
                  </button>
                );
              })}
            </div>

            {selectedAnswer !== null && (
              <div className="mt-5 rounded-xl border border-line bg-pitch p-4 sm:p-5">
                <p className={`flex items-center gap-2 text-sm font-semibold ${answeredCorrectly ? "text-turf-bright" : "text-goal-red"}`}>
                  {answeredCorrectly ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                  {answeredCorrectly ? "Correct answer" : `The correct season was ${challenge.target.season}`}
                </p>
                <p className="mt-2 text-sm leading-6 text-paper-dim">
                  Ronaldo made {challenge.target.appearances} appearances, scored {challenge.target.goals} goals, and recorded {challenge.target.assists} assists in {challenge.target.season} in {selectedFilter.label.toLowerCase()}.
                </p>
              </div>
            )}

            {cycleNotice && (
              <p className="mt-4 text-xs leading-5 text-gold">{cycleNotice}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <p className="font-mono text-xs text-paper-dim">
                {rounds} {rounds === 1 ? "round" : "rounds"} played
              </p>
              <button
                type="button"
                onClick={nextChallenge}
                disabled={selectedAnswer === null}
                className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-pitch transition hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next season →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
