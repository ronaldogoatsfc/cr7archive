"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Search,
  Trophy,
  XCircle,
} from "lucide-react";

const MAX_GUESSES = 4;
const STORAGE_PREFIX = "ronaldo-vs-who-daily-";

function normalize(value) {
  return value.trim().toLocaleLowerCase();
}

function compareStat(guessValue, targetValue) {
  if (guessValue === targetValue) return "equal";
  return guessValue > targetValue ? "higher" : "lower";
}

function hashTeamName(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getDailyOpponent(opponents, date) {
  const pool = opponents
    .filter((opponent) => opponent.team)
    .slice()
    .sort((a, b) => hashTeamName(a.team) - hashTeamName(b.team));

  if (!pool.length) return null;

  const dayNumber = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
  return pool[((dayNumber % pool.length) + pool.length) % pool.length];
}

function FeedbackMark({ result, label }) {
  const Icon = result === "equal" ? CheckCircle2 : result === "higher" ? ChevronUp : ChevronDown;
  const color = result === "equal" ? "text-turf-bright" : "text-paper-dim";
  const description = result === "equal" ? "Equal" : result === "higher" ? "Higher" : "Lower";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-pitch px-2.5 py-1.5 text-xs ${color}`}>
      <span className="text-paper-dim">{label}</span>
      <Icon size={14} />
      <span>{description}</span>
    </span>
  );
}

export default function RonaldoVsWhoGame({ opponents }) {
  const [target, setTarget] = useState(null);
  const [dailyDate, setDailyDate] = useState(null);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [revealedClues, setRevealedClues] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const dailyOpponent = getDailyOpponent(opponents, today);
    const storageKey = `${STORAGE_PREFIX}${today}`;

    setTarget(dailyOpponent);
    setDailyDate(today);

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const state = JSON.parse(saved);
        if (Array.isArray(state.guesses)) setGuesses(state.guesses);
        if (Number.isInteger(state.revealedClues)) setRevealedClues(Math.min(2, state.revealedClues));
        if (typeof state.gameOver === "boolean") setGameOver(state.gameOver);
        if (typeof state.won === "boolean") setWon(state.won);
      }
    } catch {
      // The challenge still loads if browser storage is unavailable or invalid.
    }

    setReady(true);
  }, [opponents]);

  useEffect(() => {
    if (!ready || !dailyDate || !target) return;

    const state = { guesses, revealedClues, gameOver, won };
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${dailyDate}`, JSON.stringify(state));
    } catch {
      // The game remains playable if browser storage is unavailable.
    }
  }, [ready, dailyDate, target, guesses, revealedClues, gameOver, won]);

  const usedNames = useMemo(() => new Set(guesses.map((guess) => guess.team).filter(Boolean)), [guesses]);
  const guessesUsed = guesses.length;
  const guessesRemaining = MAX_GUESSES - guessesUsed;

  const suggestions = useMemo(() => {
    const search = normalize(query);
    if (!search || !target || gameOver || !ready) return [];

    return opponents
      .filter((opponent) => (
        normalize(opponent.team).includes(search) &&
        !usedNames.has(opponent.team)
      ))
      .slice(0, 7);
  }, [opponents, query, target, gameOver, ready, usedNames]);

  const clues = target
    ? [
        { label: "Most-played competition", value: target.mostPlayedCompetition },
        {
          label: target.firstGoalSeason ? "Season of first goal" : "Season of first appearance",
          value: target.firstGoalSeason || target.firstAppearanceSeason || "Not available",
        },
      ]
    : [];

  function submitGuess(opponent) {
    if (!target || gameOver || guessesUsed >= MAX_GUESSES || usedNames.has(opponent.team)) return;

    const correct = opponent.team === target.team;
    const guess = {
      team: opponent.team,
      games: opponent.games,
      goals: opponent.goals,
      assists: opponent.assists,
      correct,
      feedback: {
        games: compareStat(opponent.games, target.games),
        goals: compareStat(opponent.goals, target.goals),
        assists: compareStat(opponent.assists, target.assists),
      },
    };

    const nextGuesses = [...guesses, guess];
    setGuesses(nextGuesses);
    setQuery("");
    setSuggestionsOpen(false);

    if (correct) {
      setWon(true);
      setGameOver(true);
      return;
    }

    setRevealedClues(Math.min(2, revealedClues + 1));
    if (nextGuesses.length >= MAX_GUESSES) {
      setGameOver(true);
    }
  }

  function useHint() {
    if (!target || gameOver || guessesUsed >= MAX_GUESSES || revealedClues >= 2) return;

    const nextUsed = guessesUsed + 1;
    setGuesses((current) => [
      ...current,
      {
        team: null,
        hint: true,
        hintNumber: revealedClues + 1,
      },
    ]);
    setRevealedClues((current) => Math.min(2, current + 1));
    setQuery("");
    setSuggestionsOpen(false);

    if (nextUsed >= MAX_GUESSES) {
      setGameOver(true);
    }
  }

  const canUseHint = target && !gameOver && guessesUsed < MAX_GUESSES && revealedClues < 2;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-pitch-raised">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
          Daily mini-game
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-pitch px-3 py-1.5 font-mono text-xs text-paper-dim">
          <Trophy size={13} className="text-gold" />
          {ready ? `${guessesRemaining} / ${MAX_GUESSES} guesses left` : "Loading today's game"}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div>
          <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl">Ronaldo vs. Who?</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-paper-dim">
            Identify today's opponent from Ronaldo's career statistics. You get four guesses, and the mystery opponent changes daily.
          </p>
        </div>

        {!ready || !target ? (
          <div className="mt-6 rounded-xl border border-dashed border-line bg-pitch/70 px-5 py-8 text-center">
            <p className="text-sm text-paper-dim">{ready ? "Today's opponent could not be loaded." : "Preparing today's challenge..."}</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { label: "Games", value: target.games },
                { label: "Goals", value: target.goals },
                { label: "Assists", value: target.assists },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-line bg-pitch p-3 text-center sm:p-5">
                  <p className="font-display text-3xl font-semibold tabular-nums text-paper sm:text-4xl">
                    {stat.value.toLocaleString("en-US")}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-paper-dim sm:text-[10px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-line bg-pitch p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">Clues</p>
                <span className="text-xs text-paper-dim">{revealedClues} / 2 revealed</span>
              </div>
              {revealedClues === 0 ? (
                <p className="mt-3 text-sm text-paper-dim">No clues revealed yet. Make a guess or spend a guess to reveal a hint.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {clues.slice(0, revealedClues).map((clue, index) => (
                    <div key={clue.label} className="flex flex-col gap-1 rounded-lg border border-line bg-pitch-raised px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-paper-dim">Clue {index + 1} · {clue.label}</span>
                      <span className="text-sm font-medium text-paper">{clue.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!gameOver && (
              <div className="mt-5">
                <label htmlFor="opponent-guess" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim">
                  Guess the opponent
                </label>
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-paper-dim" />
                      <input
                        id="opponent-guess"
                        type="text"
                        autoComplete="off"
                        value={query}
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setSuggestionsOpen(true);
                        }}
                        onFocus={() => setSuggestionsOpen(true)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && suggestions.length > 0) {
                            event.preventDefault();
                            submitGuess(suggestions[0]);
                          }
                        }}
                        placeholder="Type a club or national team..."
                        className="w-full rounded-xl border border-line bg-pitch py-3 pl-10 pr-3 text-sm text-paper outline-none transition placeholder:text-paper-dim/60 focus:border-gold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => suggestions.length > 0 && submitGuess(suggestions[0])}
                      disabled={suggestions.length === 0}
                      className="rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-pitch transition hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Guess
                    </button>
                  </div>
                  {suggestionsOpen && query.trim() && suggestions.length > 0 && (
                    <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-line bg-pitch-raised p-1 shadow-2xl">
                      {suggestions.map((opponent) => (
                        <button
                          key={opponent.team}
                          type="button"
                          onClick={() => submitGuess(opponent)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-paper transition hover:bg-pitch hover:text-gold"
                        >
                          <span>{opponent.team}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {suggestionsOpen && query.trim() && suggestions.length === 0 && (
                    <p className="mt-2 text-xs text-paper-dim">No matching opponents found. Try another spelling.</p>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={useHint}
                    disabled={!canUseHint}
                    className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-xs font-semibold text-gold transition hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Lightbulb size={14} /> Get a hint · costs 1 guess
                  </button>
                  <span className="font-mono text-xs text-paper-dim">{guessesUsed} / {MAX_GUESSES} used</span>
                </div>
              </div>
            )}

            {guesses.length > 0 && (
              <div className="mt-6 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-dim">Your guesses</p>
                {guesses.map((guess, index) => (
                  <div key={`guess-${index}`} className="rounded-xl border border-line bg-pitch p-3 sm:p-4">
                    {guess.hint ? (
                      <div className="flex items-center gap-2 text-sm text-gold">
                        <Lightbulb size={15} />
                        Hint used — clue {guess.hintNumber} revealed
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-paper">{guess.team}</span>
                          <span className={`font-mono text-[10px] uppercase tracking-wider ${guess.correct ? "text-turf-bright" : "text-goal-red"}`}>{guess.correct ? "Correct" : "Incorrect"}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <FeedbackMark label="Games" result={guess.feedback.games} />
                          <FeedbackMark label="Goals" result={guess.feedback.goals} />
                          <FeedbackMark label="Assists" result={guess.feedback.assists} />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {gameOver && (
              <div className="mt-6 rounded-xl border border-line bg-pitch p-4 sm:p-5">
                <p className={`flex items-center gap-2 text-sm font-semibold ${won ? "text-turf-bright" : "text-goal-red"}`}>
                  {won ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                  {won ? "You found the opponent!" : "Game over"}
                </p>
                <p className="mt-2 text-sm leading-6 text-paper-dim">
                  The mystery opponent was <strong className="text-paper">{target.team}</strong>. Ronaldo faced them {target.games} times, scoring {target.goals} goals and recording {target.assists} assists.
                </p>
                <p className="mt-3 text-xs text-paper-dim">Come back tomorrow for a new opponent.</p>
              </div>
            )}
            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim">
              Daily challenge · {dailyDate}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
