"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createRun(quiz) {
  return shuffle(quiz.questions).map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

export default function QuizPlayer({ quiz }) {
  const initialQuestions = useMemo(() => createRun(quiz), [quiz]);
  const [questions, setQuestions] = useState(initialQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[questionIndex];
  const selectedAnswer = answers[questionIndex];
  const answered = selectedAnswer !== undefined;
  const correctCount = questions.reduce(
    (total, question, index) => total + (answers[index] === question.answer ? 1 : 0),
    0
  );

  function chooseAnswer(option) {
    if (answered) return;
    setAnswers((previous) => ({ ...previous, [questionIndex]: option }));
  }

  function nextQuestion() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex((index) => index + 1);
    }
  }

  function restart() {
    setQuestions(createRun(quiz));
    setQuestionIndex(0);
    setAnswers({});
    setFinished(false);
  }

  if (finished) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const message = percentage === 100
      ? "Perfect score. You know your Ronaldo history."
      : percentage >= 80
        ? "Excellent work. You're a serious Ronaldo fan."
        : percentage >= 60
          ? "Good effort. A few more archive deep-dives could help."
          : "Keep exploring the archive and give it another go.";

    return (
      <div className="mt-8 rounded-2xl border border-line bg-pitch-raised p-6 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"><Trophy size={30} /></div>
        <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-gold">Quiz complete</p>
        <p className="mt-2 text-center font-display text-5xl font-semibold text-paper sm:text-7xl">{correctCount}<span className="text-2xl text-paper-dim sm:text-3xl"> / {questions.length}</span></p>
        <p className="mt-3 text-center text-sm text-paper-dim">{percentage}% correct</p>
        <p className="mx-auto mt-5 max-w-lg text-center leading-7 text-paper-dim">{message}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={restart} className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-pitch transition hover:bg-gold-bright"><RotateCcw size={16} /> Play again</button>
          <Link href="/community" className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition hover:border-gold">Choose another quiz <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-pitch-raised">
      <div className="h-1.5 bg-pitch"><div className="h-full bg-gold transition-all" style={{ width: `${((questionIndex + (answered ? 1 : 0)) / questions.length) * 100}%` }} /></div>
      <div className="p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-paper-dim">Question {questionIndex + 1} of {questions.length}</span>
          <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 text-xs text-paper-dim transition hover:text-gold"><RotateCcw size={13} /> Restart</button>
        </div>
        <h2 className="mt-6 font-display text-xl font-semibold leading-snug text-paper sm:text-2xl">{currentQuestion.question}</h2>
        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.answer;
            const isSelected = selectedAnswer === option;
            let style = "border-line bg-pitch text-paper hover:border-gold/70 hover:bg-pitch-raised";
            if (answered && isCorrect) style = "border-turf-bright/70 bg-turf-bright/10 text-paper";
            else if (answered && isSelected && !isCorrect) style = "border-goal-red/70 bg-goal-red/10 text-paper";

            return (
              <button key={option} type="button" disabled={answered} onClick={() => chooseAnswer(option)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition disabled:cursor-default ${style}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-current/20 font-mono text-xs">{String.fromCharCode(65 + index)}</span>
                <span className="flex-1">{option}</span>
                {answered && isCorrect && <CheckCircle2 size={18} className="shrink-0 text-turf-bright" />}
                {answered && isSelected && !isCorrect && <XCircle size={18} className="shrink-0 text-goal-red" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-5 rounded-xl border border-line bg-pitch p-4 sm:p-5">
            <p className={`flex items-center gap-2 text-sm font-semibold ${selectedAnswer === currentQuestion.answer ? "text-turf-bright" : "text-goal-red"}`}>
              {selectedAnswer === currentQuestion.answer ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
              {selectedAnswer === currentQuestion.answer ? "That's correct" : `Correct answer: ${currentQuestion.answer}`}
            </p>
            <p className="mt-2 text-sm leading-6 text-paper-dim">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
          <span className="font-mono text-xs text-paper-dim">{correctCount} correct so far</span>
          <button type="button" onClick={nextQuestion} disabled={!answered} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-pitch transition hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40">
            {questionIndex === questions.length - 1 ? "See results" : "Next question"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
