import Link from "next/link";
import { estimateReadingTime } from "@/lib/articles";

export default function ArticleCard({ article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-pitch-raised p-6 transition hover:border-gold"
    >
      {article.tags && article.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-pitch px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="font-display text-xl font-semibold text-paper transition group-hover:text-gold">
        {article.title}
      </h3>

      <p className="mt-2 flex-1 text-sm text-paper-dim">
        {article.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-xs text-paper-dim">
        <span>
          {article.author} · {article.datePublished}
        </span>
        <span>{estimateReadingTime(article)}</span>
      </div>
    </Link>
  );
}