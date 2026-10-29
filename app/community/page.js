import Link from "next/link";
import { ArrowRight, Brain, ChartNoAxesColumn, Trophy } from "lucide-react";
import quizzes from "@/data/quizzes.json";

export const metadata = {
  title: "Community Quizzes | The Ronaldo Archive",
  description: "Test your knowledge of Cristiano Ronaldo's career with interactive quizzes on his clubs, achievements, and iconic matches.",
};

const difficultyStyles = {
  Easy: "text-turf-bright",
  Medium: "text-gold",
  Hard: "text-goal-red",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-line bg-pitch-raised/40 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">The Ronaldo Archive · Community</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-paper sm:text-6xl">
            How well do you really know Ronaldo?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-paper-dim sm:text-lg">
            Put your knowledge to the test with challenges covering Ronaldo's career, iconic matches, and statistical milestones. No account needed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-mono uppercase tracking-widest text-paper-dim">
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2"><Brain size={14} /> Quick quizzes</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2"><ChartNoAxesColumn size={14} /> Track your score</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2"><Trophy size={14} /> Replay anytime</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">Choose your challenge</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">Available quizzes</h2>
          </div>
          <p className="text-sm text-paper-dim">{quizzes.length} quizzes · {quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)} questions</p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <article key={quiz.id} className="group flex flex-col rounded-2xl border border-line bg-pitch-raised p-6 transition hover:border-gold/60">
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
      </section>
    </div>
  );
}
