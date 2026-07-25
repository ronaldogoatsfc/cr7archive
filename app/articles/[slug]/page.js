import Link from "next/link";
import { notFound } from "next/navigation";
import articles from "@/data/articles";
import { getArticleBySlug, estimateReadingTime } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }) {
  const article = getArticleBySlug(articles, params.slug);
  if (!article) return { title: "Article not found — The CR7 Archive" };
  return { title: `${article.title} — The CR7 Archive` };
}

function ArticleBlock({ block }) {
  if (block.type === "heading") {
    return (
      <h2 className="mt-8 font-display text-2xl font-semibold text-paper">
        {block.text}
      </h2>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="my-6 border-l-2 border-gold pl-4 font-display text-xl text-gold">
        {block.text}
      </blockquote>
    );
  }
  return (
    <p className="mt-4 leading-relaxed text-paper-dim">{block.text}</p>
  );
}

export default function ArticlePage({ params }) {
  const article = getArticleBySlug(articles, params.slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/articles"
        className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-gold"
      >
        ← Back to articles
      </Link>

      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-pitch-raised px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="mt-4 font-display text-4xl font-semibold text-paper">
        {article.title}
      </h1>

      <div className="mt-3 font-mono text-xs text-paper-dim">
        {article.author} · {article.datePublished} ·{" "}
        {estimateReadingTime(article)}
      </div>

      <div className="mt-8">
        {article.content.map((block, i) => (
          <ArticleBlock key={i} block={block} />
        ))}
      </div>
    </div>
  );
}