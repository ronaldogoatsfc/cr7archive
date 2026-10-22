
const ronaldoHomeVsAway = {
  slug: "ronaldo-home-vs-away",
  title: "Cristiano Ronaldo's Home vs. Away Scoring Efficiency",
  author: "Soham Ranade",
  datePublished: "2026-10-21",
  description:
    "An analysis of Cristiano Ronaldo's goals and scoring rates across home, away, and neutral venues, competitions, and teams.",
  tags: ["Data Analysis", "Statistics", "Career Analysis"],

  content: [
    {
      type: "paragraph",
      text: "Cristiano Ronaldo's scoring record can be examined not only through his total goals, but also through where he plays and how frequently he scores relative to his playing time. This analysis compares his home and away scoring output, explores differences across competitions and teams, and uses goals per 90 minutes to provide additional context.",
    },

    {
      type: "heading",
      text: "Goals by Venue",
    },
    {
      type: "paragraph",
      text: "This visualization compares Ronaldo's total goals scored at home, away, and at neutral venues.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-goals-by-venue.png",
      alt: "Bar chart showing Cristiano Ronaldo's total goals at home, away, and neutral venues.",
      caption: "Total recorded goals by venue.",
    },
    {
      type: "paragraph",
      text: "This visualization shows the raw statistics for goals by venue. He has scored the most goals at home, followed by away, and then neutral venues. However, this does not account for differences in playing time or the number of matches played in each venue type. Of course, venues can play an impact because it is easier for a team to score while playing at home; however, his away goal tally is remarkable at 395 away goals thus far.",
    },

    {
      type: "heading",
      text: "Goals per 90 Minutes by Venue",
    },
    {
      type: "paragraph",
      text: "Raw goal totals do not account for differences in playing time. This visualization compares Ronaldo's goals per 90 minutes at home, away, and at neutral venues.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-goals-per-90-by-venue.png",
      alt: "Bar chart comparing Cristiano Ronaldo's goals per 90 minutes at home, away, and neutral venues.",
      caption: "Scoring rate by venue, calculated as goals divided by minutes played and multiplied by 90.",
    },
    {
      type: "paragraph",
      text: "The bar graph shows the difference in goals per 90 minutes decreasing as the venue goes from home to away. Regardless, 0.754 goals per 90 in away games is incredible. Since we already know scoring in away games is a tougher task, this is a remarkable statistic. Also, neutral games are played in a variety of locations, so the scoring rate is likely affected by the specific venues and conditions of those matches. It could be rightfully speculated that the goal ratio is dependent on fan turnout, as well as the quality of the opposition.",
    },

    {
      type: "heading",
      text: "Goal Distribution by Competition",
    },
    {
      type: "paragraph",
      text: "Ronaldo has played in numerous domestic leagues, cup competitions, and international tournaments. This visualization compares his recorded home and away goal totals across competitions.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-goals-by-competition-home-away.png",
      alt: "Horizontal bar chart comparing Cristiano Ronaldo's home and away goal totals across competitions.",
      caption: "Recorded home and away goals by competition. Neutral venues are excluded.",
    },
    {
      type: "paragraph",
      text: "This graph shows that La Liga is the competition in which he has scored the most goals, with a clear gap, followed by the Champions League and other competitions. Of course, most competitions show his goals being higher in home than away games. Impressively, he has scored more away goals than home goals in UEFA EURO Qualifier matches.",
    },

    {
      type: "heading",
      text: "Home and Away Scoring by Team",
    },
    {
      type: "paragraph",
      text: "Ronaldo's career has included several clubs and the Portugal national team. This visualization compares his home and away goal totals and scoring rates for each team.",
    },
    {
      type: "image",
      src: "/images/articles/ronaldo-home-away-goals-by-club.png",
      alt: "Two-panel chart comparing Cristiano Ronaldo's home and away goal totals and goals per 90 minutes across teams.",
      caption: "Home and away goal totals and goals per 90 minutes by team. Neutral venues are excluded.",
    },
    {
      type: "paragraph",
      text: "Finally, Cristiano Ronaldo's goals by venue can be broken down by club. The left panel shows raw goal totals while the right panel shows goals per 90 minutes. The main focus here is the per 90 rate, which shows some key things. For example, his scoring rate in home games for Sporting is slightly higher than his scoring rate in away games for Manchester United. Additionally, his scoring rate in home and away games for Juventus, Portugal, and Al-Nassr fall between 0.75 and 0.92. To add, his scoring rate in away games for Al-Nassr is higher than his scoring rate in home games. Both scoring rates for Real Madrid are above 1.0, given that he averaged slightly over a goal per game. Overall, this visualization shows that Ronaldo has been a prolific scorer regardless of venue, competition, or team.",
    },

    {
      type: "heading",
      text: "Methodology and Limitations",
    },
    {
      type: "paragraph",
      text: "This analysis uses the match logs recorded in The Ronaldo Archive. Goals per 90 minutes is calculated by dividing recorded goals by recorded minutes played and multiplying by 90. The rate calculations use matches with valid recorded minutes, so incomplete playing-time data may affect the results. Neutral venues are included in the first two visualizations but excluded from the competition and team comparisons. Complete shot data is not available across Ronaldo's career, so shot-conversion rate is not calculated. Goals per 90 minutes measures scoring rate, not the proportion of shots converted.",
    },
  ],
};

export default ronaldoHomeVsAway;
