"use client";

import { useMemo, useState } from "react";
import articles from "@/data/articles";
import { sortByDateDesc } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [year, setYear] = useState("All");

  const topics = useMemo(
    () => [...new Set(articles.flatMap((article) => article.tags || []))].sort((a, b) => a.localeCompare(b)),
    []
  );
  const years = useMemo(
    () => [...new Set(articles.map((article) => article.datePublished?.slice(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a)),
    []
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortByDateDesc(articles).filter((article) => {
      const searchable = [article.title, article.description, ...(article.tags || [])].join(" ").toLowerCase();
      if (query && !searchable.includes(query)) return false;
      if (topic !== "All" && !(article.tags || []).includes(topic)) return false;
      if (year !== "All" && article.datePublished?.slice(0, 4) !== year) return false;
      return true;
    });
  }, [search, topic, year]);

  function resetFilters() {
    setSearch("");
    setTopic("All");
    setYear("All");
  }

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

      <div className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-line bg-pitch-raised p-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_auto] lg:items-end">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">Search articles</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles, descriptions, or tags"
            className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper placeholder:text-paper-dim/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">Topic</span>
          <select value={topic} onChange={(event) => setTopic(event.target.value)} className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
            <option value="All">All topics</option>
            {topics.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">Year</span>
          <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
            <option value="All">All years</option>
            {years.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <button type="button" onClick={resetFilters} className="rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper">Reset filters</button>
      </div>
      <p className="mt-4 font-mono text-xs text-paper-dim">{filtered.length} {filtered.length === 1 ? "article" : "articles"} found</p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-10 rounded-2xl border border-line bg-pitch-raised px-5 py-10 text-center text-paper-dim">
          No articles match these filters. Try a different search or reset the filters.
        </p>
      )}
    </div>
  );
}
