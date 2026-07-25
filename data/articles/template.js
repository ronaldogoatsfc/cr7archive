// ─────────────────────────────────────────────────────────────────────────
// ARTICLE TEMPLATE — copy this whole file to write a new article.
//
// HOW TO USE:
// 1. Duplicate this file. Rename it to something like:
//      data/articles/his-tactical-adaptation.js
// 2. Fill in the fields below.
// 3. Open data/articles/index.js, import your new file, and add it to
//    the `articles` array.
// That's it — it'll show up on the /articles grid automatically.
// ─────────────────────────────────────────────────────────────────────────

const article = {
  // Used in the URL: /articles/your-slug-here
  // Lowercase, words separated by hyphens, no spaces or punctuation.
  slug: "template-slug-goes-here",

  title: "Your Article Title Goes Here",

  author: "Your Name",

  // Format: "YYYY-MM-DD" — keep this format so articles sort correctly.
  datePublished: "2026-01-01",

  // 1-2 sentences. This is what shows on the grid card before someone clicks.
  description:
    "A short, punchy summary of what this article covers — this is the preview text shown on the articles grid.",

  // Optional. Shows as a small badge on the card. Leave as an empty array
  // if you don't want tags yet.
  tags: ["Tactics"],

  // The article body. Each entry is one block, rendered in order.
  // Available block types:
  //   { type: "paragraph", text: "..." }   -> a normal paragraph
  //   { type: "heading", text: "..." }      -> a section heading (like an H2)
  //   { type: "quote", text: "..." }        -> a pulled-out blockquote
  // Add as many blocks as you want, in whatever order tells the story.
  content: [
    {
      type: "paragraph",
      text: "Start with your opening paragraph here. This is what pulls the reader in — set up what the article is actually about.",
    },
    {
      type: "heading",
      text: "A Section Heading",
    },
    {
      type: "paragraph",
      text: "Write your analysis here. You can add as many paragraph blocks as you need.",
    },
    {
      type: "quote",
      text: "A pulled-out quote or key stat can go here for emphasis.",
    },
    {
      type: "paragraph",
      text: "Wrap up with a closing paragraph that ties the analysis together.",
    },
  ],
};

export default article;