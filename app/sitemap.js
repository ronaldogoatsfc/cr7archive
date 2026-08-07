import articles from "@/data/articles";

const BASE_URL = "https://ronaldoarchive.com";

export default function sitemap() {
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/match-logs", priority: 0.9, changeFrequency: "weekly" },
    { path: "/match-logs/footage", priority: 0.6, changeFrequency: "weekly" },
    { path: "/match-logs/unofficial", priority: 0.5, changeFrequency: "monthly" },
    { path: "/visualizations", priority: 0.8, changeFrequency: "weekly" },
    { path: "/trophies", priority: 0.7, changeFrequency: "monthly" },
    { path: "/honors", priority: 0.7, changeFrequency: "monthly" },
    { path: "/records", priority: 0.7, changeFrequency: "monthly" },
    { path: "/articles", priority: 0.8, changeFrequency: "weekly" },
    { path: "/about", priority: 0.4, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  ].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.datePublished),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}