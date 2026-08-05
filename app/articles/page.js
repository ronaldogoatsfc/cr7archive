import articles from "@/data/articles";
import { sortByDateDesc } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export const metadata = {
  title: "Articles — The Ronaldo Archive",
};

export default function ArticlesPage() {
  const sorted = sortByDateDesc(articles);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Articles
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        In-Depth Analyses
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Original writing on Ronaldo&apos;s game — tactics, technique, and how
        his career has evolved over time.
      </p>

      {sorted.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sorted.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-paper-dim">
          No articles published yet — check back soon.
        </p>
      )}
    </div>
  );
}