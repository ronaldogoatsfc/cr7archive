
const article = {
  slug: "ronaldo-scoring-rate",
  title: "How Cristiano Ronaldo's Scoring Rate Evolved Throughout His Career",
  author: "Soham",
  datePublished: "2026-10-18",
  description:
    "An exploration of Cristiano Ronaldo's scoring efficiency, goal milestones, match output, competition performance, and hypothetical goals lost to absences.",
  tags: ["Data Analysis", "Statistics", "Career Analysis"],

  content: [
    {
      type: "paragraph",
      text:
        "Cristiano Ronaldo's career can be examined through more than his total number of goals. By analyzing his match data, we can explore how his scoring rate changed over time, how he reached major milestones, and how his output varied across matches and competitions.",
    },

    {
      type: "paragraph",
      text:
        "This analysis uses match logs from The Ronaldo Archive. The visualizations below examine six different aspects of his goalscoring career.",
    },

    {
      type: "heading",
      text: "1. Goals per Game and Goals per 90 Minutes",
    },
    {
      type: "paragraph",
      text:
        "This visualization compares Ronaldo's seasonal goals per appearance with his goals per 90 minutes.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-scoring-rate-by-season.png",
      alt: "Line chart comparing Ronaldo's goals per appearance and goals per 90 minutes by season.",
      caption:
        "Seasonal scoring rate, measured by goals per appearance and goals per 90 minutes.",
    },
    {
      type: "paragraph",
      text: "Both lines are relatively similar. The line difference is slightly higher in 2002/03 and 2003/04, when Ronaldo was a young player with limited minutes in some matches. His scoring rate was consistently at its highest from 2010/11 to 2017/18, which constitute eight of his nine seasons at Real Madrid. It is important to note that the goals per appearance counts every match the player features inn, regardless of how many minutes he plays. The goals per 90 minutes metric accounts for the actual time played, which can provide a more accurate measure of scoring efficiency, especially in seasons where Ronaldo had limited playing time in certain matches. Ronaldo playing two matches for a total of 90 minutes would count the same as one appearance in the goals per appearance metric, but the goals per 90 minutes metric would reflect the actual time played and provide a more accurate measure of scoring efficiency.",
    },

    {
      type: "heading",
      text: "2. Games Needed for Each 100-Goal Milestone",
    },
    {
      type: "paragraph",
      text:
        "How quickly did Ronaldo accumulate each successive 100 goals? This chart measures the number of recorded appearances between each milestone, from 0–100 through 800–900.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-games-per-100-goals.png",
      alt: "Bar chart showing the number of appearances needed for each 100-goal milestone up to 900 goals.",
      caption:
        "Appearances required to reach each successive 100-goal milestone.",
    },
    {
      type: "paragraph",
      text: "Cristiano Ronaldo started his career as an outside midfielder, which explains his high number of appearances needed to reach his first 100 goals. Interestingly, goals 300-600 needed as many games as his first 100 goals, with 301 appearances each. As he transitioned into a more attacking role, his scoring rate improved significantly, allowing him to reach subsequent milestones in fewer matches. Ronaldo had three intervals in which he needed 100 games or less to score 100 goals: 200-300, 300-400, and 400-500. Impressively, he needed fewer games to score goals 800-900 than he did for goals 100-200, demonstrating his scoring ability at an older age was better than when he was more dynamic and explosive.",
    },

    {
      type: "heading",
      text: "3. Scoring Output Distribution",
    },
    {
      type: "paragraph",
      text:
        "Total goals do not reveal how many matches ended with no goals, one goal, or multiple goals. This chart breaks down Ronaldo's recorded appearances by goals scored in each match.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-scoring-output-distribution.png",
      alt: "Bar chart categorizing Ronaldo's appearances by the number of goals scored.",
      caption:
        "Distribution of appearances by goals scored, including braces, hat-tricks, and higher-scoring matches.",
    },
    {
      type: "paragraph",
      text: "This distribution shows that Ronaldo scored in a significant portion of his matches, with a notable number of braces and hat-tricks. The data also highlights the frequency of matches where he did not score. While a goal ratio shows the average goals, this distribution shows a more in-depth view of his scoring output.Given that his zero-goal games contribute to half of his career appearances, it is clear that Ronaldo's scoring ability was not just about consistency but also about his capacity to deliver multiple goals in a single match. Many of these games can be attributed to his first Manchester United stint in which his role was more of a winger and he was not the primary goal scorer.",
    },

    {
      type: "heading",
      text: "4. Goal-Scoring Rate by Competition",
    },
    {
      type: "paragraph",
      text:
        "Ronaldo has competed across domestic leagues, cups, continental competitions, and international football. Comparing scoring rates helps explore differences between these environments.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-scoring-rate-by-competition.png",
      alt: "Horizontal bar chart comparing Ronaldo's goals per appearance and goals per 90 minutes across competitions.",
      caption:
        "Scoring rates across competitions represented in the match archive.",
    },
    {
      type: "paragraph",
      text: "Cristiano Ronaldo was ferocious in La Liga, with a goals per 90 ratio of 1.12. He was also prolific in the UEFA EURO Qualifiers and Saudi Pro League, with a goals per appearance ratio of 0.93. His lowest scoring rate game in the Primeira Liga, which makes sense, because he played fewer minutes, had a winger role, and was still developing as a player.",
    },

    {
      type: "heading",
      text: "5. The Injury and Absence Hypothetical",
    },
    {
      type: "paragraph",
      text:
        "What might Ronaldo's seasonal goal totals have looked like if he had played the matches he missed through injury? This hypothetical applies each season's observed goals-per-appearance rate to the recorded number of games missed.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-injury-hypothetical.png",
      alt: "Line chart comparing Ronaldo's actual seasonal goals with hypothetical totals estimated using his observed scoring rate and recorded games missed.",
      caption:
        "Actual goals compared with a hypothetical estimate for seasons with available absence data.",
    },
    {
      type: "paragraph",
      text:
        "This hypothetical was created just for fun and is not illustrative of his true potential It is a mere observation of his goal ratio across seasons and how his goal tallies would change had he scored at the same rate in the matches he missed. Also, this hypothetical intentionally leaves out suspensions and absences. From the data, it is clear that 2013/14 would have been his best scoring season, with a predicted tally of 69 goals. Though he did scored fewer goals than he did in 2014/15, he missed seven games, which would have given him 64 total appearances compared to his 57 actual appearances. It is also worth mentioning that he did not miss any games in the 2023/24 season due to injury.",
    },

    {
      type: "heading",
      text: "6. Overall Career Goals",
    },
    {
      type: "paragraph",
      text:
        "The final visualization returns to the broader career timeline, showing how Ronaldo's cumulative goal total developed across the recorded matches.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-career-time-series.png",
      alt: "Time-series line chart showing Ronaldo's cumulative goals across recorded matches.",
      caption:
        "Cumulative goals across the chronological match archive.",
    },
    {
      type: "paragraph",
      text: "This visualization shows the steady accumulation of goals over Ronaldo's career, with notable spikes during his peak years. The slope of the line indicates periods of high scoring efficiency, while flatter sections correspond to seasons with fewer goals. This cumulative view provides a clear picture of his overall impact and consistency as a goal scorer throughout his career.",
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

export default article;
