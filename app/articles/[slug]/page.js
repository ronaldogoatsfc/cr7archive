import Link from "next/link";
import { notFound } from "next/navigation";
import articles from "@/data/articles";
import { getArticleBySlug, estimateReadingTime } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(articles, slug);
  if (!article) return { title: "Article not found — The Ronaldo Archive" };
  return { title: `${article.title} — The Ronaldo Archive` };
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

  if (block.type === "stats") {
    return (
      <div className="my-8 rounded-2xl border border-line bg-pitch-raised p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="rounded-xl border border-line bg-pitch p-3">
              <p className="font-display text-2xl font-semibold tabular-nums text-paper">
                {item.value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <figure className="my-8">
        <img
          src={block.src}
          alt={block.alt || ""}
          className="h-auto w-full rounded-xl border border-line"
          loading="lazy"
        />
        {block.caption && (
          <figcaption className="mt-3 text-center text-sm text-paper-dim">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <p className="mt-4 leading-relaxed text-paper-dim">
      {block.text}
    </p>
  );
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(articles, slug);
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
          <div key={i} id={`article-section-${i}`} className="scroll-mt-28 target:rounded-lg target:bg-gold/5">
            <ArticleBlock block={block} />
          </div>
        ))}
      </div>
    </div>
  );
}