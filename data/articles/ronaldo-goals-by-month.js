
const ronaldo_goals_by_month = {
  slug: "ronaldo-goals-by-month",
  title: "Cristiano Ronaldo's Goals by Month",
  author: "Soham Ranade",
  datePublished: "2026-10-20",
  description:
    "An analysis of Cristiano Ronaldo's monthly scoring rates, competition breakdowns, and consistency across the calendar year.",
  tags: ["Data Analysis", "Statistics", "Career Analysis"],

  content: [
    {
      type: "paragraph",
      text: "Cristiano Ronaldo's scoring record is legendary, but how does his goal-scoring vary across the calendar year? This article explores Ronaldo's goals by month, examining his scoring rates overall, by competition, and variations.",
    },

    {
      type: "heading",
      text: "The Monthly Scoring Rate",
    },
    {
      type: "paragraph",
      text: "Displays goals per 90 minutes mapped across every calendar month.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-goals-by-month.png",
      alt: "Cristiano Ronaldo's goals per 90 minutes by calendar month",
      caption: "Goals per 90 minutes, grouped by the calendar month of each match.",
    },
    {
      type: "paragraph",
      text: "A typical season spans from August to May, with June and July often being off-season. This chart shows his scoring rate across all months, with peaks in May and December. It is important to note that the scoring rate per 90 was chosen rather than a sum of goals by month to highlight the relative scoring efficiency, as the number of matches played can vary by month. In terms of raw goal totals by month, his best are September (111 goals) and October (110 goals).",
    },

    {
      type: "heading",
      text: "The Role of Competition",
    },
    {
      type: "paragraph",
      text: "Outlines monthly goal metrics categorized by tournament and league.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-goals-by-month-competition.png",
      alt: "Cristiano Ronaldo's monthly goal totals split by competition",
      caption: "Recorded goals by calendar month, broken down by competition.",
    },
    {
      type: "paragraph",
      text: "While the previous chart showed his scoring rate, this one shows raw goal totals by month, broken down by competition. The key shows the competitions he has scored the most goals in, with the other goals grouped into the 'Other' category. He scored 44 goals in March and May in La Liga, which is usually considered 'crunch time'; the most pivotal part of the season. Astonishingly, his UCL goal tally in April is 31 goals, which is around the time of the quarter-finals. Also, June is primarily green because of his international goals for Portugal, which is usually when the Euros or World Cup take place.",
    },

    {
      type: "heading",
      text: "Does the Pattern Repeat Across Years?",
    },
    {
      type: "paragraph",
      text: "Tracks yearly consistency using a month-by-month scoring rate matrix.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-goals-by-month-heatmap.png",
      alt: "Heatmap of Cristiano Ronaldo's goals per 90 by year and calendar month",
      caption: "Each cell represents the recorded goals-per-90 rate for a given year and calendar month.",
    },
    {
      type: "paragraph",
      text: "This heatmap shows his scoring rate for each year and month. The better his scoring rate, the lighter the color gets. It is important to note that the number of matches played in each month can vary, which is why June 2015 and August 2017 are yellow. White spaces are for months where he did not play. From the data, it is clear that June is the darkest month, and the first few years of his career are also dark. Of course, this can be attributed to international competitions and his developmental phase. May 2011 has an impressive scoring rate of 2.2 goals per game.",
    },

    {
      type: "heading",
      text: "Consistency and Variation",
    },
    {
      type: "paragraph",
      text: "Evaluates annual stability through standard deviation figures for each distinct month.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-goals-by-month-variation.png",
      alt: "Standard deviation of Cristiano Ronaldo's yearly goals-per-90 rates by month",
      caption: "Standard deviation across observed yearly scoring rates for each calendar month.",
    },
    {
      type: "paragraph",
      text: "August exhibits the highest standard deviation (0.76), indicating the greatest year-over-year volatility in his scoring rate as seasons begin and pre-season/early form fluctuates. The spring months, particularly April, at 0.401, display relatively low and tightly bounded variance, highlighting consistent scoring performance during the peak of the club season.",
    },

    {
      type: "heading",
      text: "Methodology and Limitations",
    },
    {
      type: "paragraph",
      text:
        "The analysis is based on the matches and statistics recorded in The Ronaldo Archive. Results depend on the completeness of the match logs, the consistency of season and competition labels, and the availability of minutes played and absence data. The injury hypothetical is especially dependent on the accuracy of the recorded games missed.",
    }
  ],
};

export default ronaldo_goals_by_month;
