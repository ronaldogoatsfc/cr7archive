export function estimateReadingTime(article) {
  const words = article.content
    .map((block) => block.text)
    .join(" ")
    .trim()
    .split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function sortByDateDesc(articles) {
  return [...articles].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );
}

export function getArticleBySlug(articles, slug) {
  return articles.find((a) => a.slug === slug) ?? null;
}