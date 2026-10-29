import Link from "next/link";
import { notFound } from "next/navigation";
import quizzes from "@/data/quizzes.json";
import QuizPlayer from "@/components/QuizPlayer";

export function generateStaticParams() {
  return quizzes.map((quiz) => ({ slug: quiz.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const quiz = quizzes.find((item) => item.id === slug);
  return {
    title: quiz ? `${quiz.title} | The Ronaldo Archive` : "Quiz | The Ronaldo Archive",
    description: quiz?.description || "Test your knowledge of Cristiano Ronaldo.",
  };
}

export default async function QuizPage({ params }) {
  const { slug } = await params;
  const quiz = quizzes.find((item) => item.id === slug);
  if (!quiz) notFound();

  return (
    <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <Link href="/community" className="text-sm font-semibold text-gold transition hover:text-gold-bright">← All quizzes</Link>
      <div className="mt-8">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{quiz.category} · {quiz.difficulty}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-paper sm:text-5xl">{quiz.title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-paper-dim">{quiz.description}</p>
      </div>
      <QuizPlayer key={quiz.id} quiz={quiz} />
    </section>
  );
}
