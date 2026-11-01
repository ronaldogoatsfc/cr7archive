"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";

const STAT_OPTIONS = [
  { key: "minutesPlayed", label: "Minutes Played", shortLabel: "Minutes", unit: "min" },
  { key: "goals", label: "Goals", shortLabel: "Goals", unit: "" },
  { key: "assists", label: "Assists", shortLabel: "Assists", unit: "" },
];

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function pairKey(first, second) {
  return [first.season, second.season].sort().join("::");
}

function createChallenge(seasons, usedPairs = []) {
  const comparisons = [];

  for (let firstIndex = 0; firstIndex < seasons.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < seasons.length; secondIndex += 1) {
      const first = seasons[firstIndex];
      const second = seasons[secondIndex];
      const availableStats = STAT_OPTIONS.filter(
        (stat) => Number(first[stat.key]) !== Number(second[stat.key])
      );

      if (availableStats.length === 0 || usedPairs.includes(pairKey(first, second))) {
        continue;
      }

      comparisons.push({ first, second, availableStats });
    }
  }

  if (comparisons.length === 0) return null;

  const comparison = comparisons[Math.floor(Math.random() * comparisons.length)];
  const stat = comparison.availableStats[
    Math.floor(Math.random() * comparison.availableStats.length)
  ];
  const [first, second] = Math.random() < 0.5
    ? [comparison.first, comparison.second]
    : [comparison.second, comparison.first];

  return {
    first,
    second,
    stat,
    pairId: pairKey(first, second),
    firstValue: Number(first[stat.key]),
    secondValue: Number(second[stat.key]),
  };
}

function formatValue(value, stat) {
  const formatted = value.toLocaleString("en-US");
  return stat.unit ? `${formatted} ${stat.unit}` : formatted;
}

export default function HigherLowerGame({ seasonData }) {
  const [challenge, setChallenge] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [usedPairs, setUsedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [cycleNotice, setCycleNotice] = useState("");

  function startGame() {
    setChallenge(createChallenge(seasonData));
    setSelectedAnswer(null);
    setUsedPairs([]);
    setScore(0);
    setGameOver(false);
    setCycleNotice("");
  }

  function chooseAnswer(answer) {
    if (!challenge || selectedAnswer !== null || gameOver) return;

    const isHigher = challenge.secondValue > challenge.firstValue;
    const correct = (answer === "higher" && isHigher) || (answer === "lower" && !isHigher);

    setSelectedAnswer(answer);

    if (correct) {
      const nextScore = score + 1;
      setScore(nextScore);
      setBestScore((best) => Math.max(best, nextScore));
    } else {
      setGameOver(true);
    }
  }

  function nextRound() {
    if (!challenge || selectedAnswer === null || gameOver) return;

    const nextUsedPairs = [...usedPairs, challenge.pairId];
    let nextChallenge = createChallenge(seasonData, nextUsedPairs);
    let nextPairs = nextUsedPairs;
    let notice = "";

    if (!nextChallenge) {
      nextPairs = [];
      nextChallenge = createChallenge(seasonData);
      notice = "You've compared every available season pairing. The comparisons have been shuffled for a new run.";
    }

    setUsedPairs(nextPairs);
    setChallenge(nextChallenge);
    setSelectedAnswer(null);
    setCycleNotice(notice);
  }

  const answeredCorrectly = selectedAnswer !== null && !gameOver;
  const secondIsHigher = challenge && challenge.secondValue > challenge.firstValue;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-pitch-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
          <Sparkles size={14} /> Mini-game 02
        </div>
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-pitch px-3 py-1.5 font-mono text-xs text-paper-dim">
            <Trophy size={13} className="text-gold" />
            Streak: {score}
          </div>
          <span className="font-mono text-xs text-paper-dim">Best: {bestScore}</span>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div>
          <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
            Higher or Lower
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">
            Compare Ronaldo's seasonal minutes, goals, and assists. Make the right call to keep your streak alive.
          </p>
        </div>

        {!challenge ? (
          <div className="mt-6 rounded-xl border border-dashed border-line bg-pitch/70 px-5 py-8 text-center">
            <p className="font-display text-lg font-semibold text-paper">Ready to test your knowledge?</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-paper-dim">
              Each round compares one statistic across two different seasons. One wrong guess ends your run.
            </p>
            <button
              type="button"
              onClick={startGame}
              disabled={seasonData.length < 2}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-pitch transition hover:bg-gold-bright disabled:opacity-40"
            >
              Start game
            </button>
          </div>
        ) : (
          <>
            <div className="mt-7 flex items-center justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">
                {challenge.stat.label}
              </p>
              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center gap-1.5 text-xs text-paper-dim transition hover:text-gold"
              >
                <RotateCcw size={13} /> Restart
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5">
              <div className="rounded-xl border border-line bg-pitch p-4 text-center sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim">Season A</p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">{challenge.first.season}</h4>
                <p className="mt-5 font-display text-3xl font-semibold tabular-nums text-paper sm:text-4xl">
                  {formatValue(challenge.firstValue, challenge.stat)}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">{challenge.stat.shortLabel}</p>
              </div>

              <div className="rounded-xl border border-gold/40 bg-pitch p-4 text-center sm:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim">Season B</p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">{challenge.second.season}</h4>
                <p className="mt-5 font-display text-3xl font-semibold tabular-nums text-gold sm:text-4xl">
                  {selectedAnswer === null ? "?" : formatValue(challenge.secondValue, challenge.stat)}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">{challenge.stat.shortLabel}</p>
              </div>
            </div>

            <p className="mt-6 text-center font-display text-lg font-semibold text-paper">
              Did {challenge.second.season} have higher or lower {challenge.stat.label.toLowerCase()} than {challenge.first.season}?
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => chooseAnswer("higher")}
                disabled={selectedAnswer !== null}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-line bg-pitch px-4 py-3 text-sm font-semibold text-paper transition hover:border-turf-bright/70 hover:text-turf-bright disabled:cursor-default disabled:opacity-60"
              >
                <ArrowUp size={18} /> Higher
              </button>
              <button
                type="button"
                onClick={() => chooseAnswer("lower")}
                disabled={selectedAnswer !== null}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-line bg-pitch px-4 py-3 text-sm font-semibold text-paper transition hover:border-goal-red/70 hover:text-goal-red disabled:cursor-default disabled:opacity-60"
              >
                <ArrowDown size={18} /> Lower
              </button>
            </div>

            {selectedAnswer !== null && (
              <div className="mt-5 rounded-xl border border-line bg-pitch p-4 sm:p-5">
                <p className={`flex items-center gap-2 text-sm font-semibold ${answeredCorrectly ? "text-turf-bright" : "text-goal-red"}`}>
                  {answeredCorrectly ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                  {answeredCorrectly ? "Correct — your streak continues!" : "Game over"}
                </p>
                <p className="mt-2 text-sm leading-6 text-paper-dim">
                  {challenge.second.season} recorded {formatValue(challenge.secondValue, challenge.stat)} in {challenge.stat.label.toLowerCase()}, which was {secondIsHigher ? "higher" : "lower"} than {challenge.first.season}'s {formatValue(challenge.firstValue, challenge.stat)}.
                </p>
                {!answeredCorrectly && (
                  <p className="mt-2 font-mono text-xs uppercase tracking-wider text-paper">
                    Final streak: {score} {score === 1 ? "correct guess" : "correct guesses"} · Best: {bestScore}
                  </p>
                )}
              </div>
            )}

            {cycleNotice && (
              <p className="mt-4 text-xs leading-5 text-gold">{cycleNotice}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <p className="font-mono text-xs text-paper-dim">
                {score} consecutive {score === 1 ? "correct answer" : "correct answers"}
              </p>
              {gameOver ? (
                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-pitch transition hover:bg-gold-bright"
                >
                  <RotateCcw size={15} /> Play again
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextRound}
                  disabled={!answeredCorrectly}
                  className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-pitch transition hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next round →
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
