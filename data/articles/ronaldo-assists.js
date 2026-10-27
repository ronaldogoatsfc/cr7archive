
const ronaldo_assists = {
  slug: "ronaldo-assists",
  title: "Cristiano Ronaldo's Assists Analysis",
  author: "Soham Ranade",
  datePublished: "2026-10-27",
  description:
    "An analysis of Cristiano Ronaldo's career assists and an explanation of his total tally and why it decreased.",
  tags: ["Data Analysis", "Statistics", "Career Analysis"],

  content: [
    {
      type: "paragraph",
      text: "Cristiano Ronaldo is widely recognized for his goalscoring, but his contributions as a creator are another important part of his career. Looking beyond goals provides a different perspective on his performances across clubs, seasons, and competitions."
    },
    {
      type: "paragraph",
      text: "This analysis examines Ronaldo's recorded assists throughout his career, exploring where and when he provided them, how they were distributed across competitions, and how often he recorded multiple assists in a single match."
    },
    {
      type: "paragraph",
      text: "The statistics in this article are based on The Ronaldo Archive's match-by-match records. Assist totals can vary between databases, so the figures presented here should be understood within the scope of the archive's data and counting methodology."
    },

    {
      type: "heading",
      text: "Assists by Team",
    },
    {
      type: "image",
      src: "/images/articles/assists_by_club.png",
      alt: "Cristiano Ronaldo's assists by team",
      caption: "Raw assist tallies, grouped by team.",
    },
    {
      type: "paragraph",
      text: "Cristiano Ronaldo's highest assist tally came during his time at Real Madrid, in which he registered 120 assists, more than double his tally with Manchester United. Portugal, Al-Nassr, and Juventus follow. The latter two make sense in being lower, as he had more of a goalscoring role than at any other point in his career. It is important to note that he has also been credited with having 131 assists, but again, the definition of an assist varies by database, which will be covered later.",
    },

    {
      type: "heading",
      text: "Assists by Season",
    },
    {
      type: "image",
      src: "/images/articles/assists_by_season.png",
      alt: "Cristiano Ronaldo's assist tally split by season",
      caption: "Assist tallies, split by season."
    },
    {
      type: "paragraph",
      text: "The 2014/15 season shows Ronaldo's highest recorded assist tally of 21, the only time in his career he has recorded 20 or more assists. Every season he spent as a Real Madrid player saw his assist tally reach the double digits, though this includes club and country statistics. Specific seasons stand out from the others. 2004/05 was the first time he reached double digits, with 12 assists. 2006/07 was his highest assist tally as a Manchester United player, 2018/19 was his highest assist tally as a Juventus player, and 2023/24 was his highest tally as an Al-Nassr player.",
    },

    {
      type: "heading",
      text: "Assists by Competition",
    },
    {
      type: "image",
      src: "/images/articles/assists_by_competition.png",
      alt: "Breakdown of Ronaldo's assists, split by competition.",
    },
    {
      type: "paragraph",
      text: "La Liga contributes to the majority of his assist tally in terms of competition, with 87 assists in the nine years he spent there. The UEFA Champions League has the second-highest tally of 41. More information about his assists will be discussed later. Other competitons show that he does not have an assist, which can be attributed to either his goalscoring role or his small sample size of games played.",
    },

    {
      type: "heading",
      text: "Distribution of Assists per Match",
    },
    {
      type: "image",
      src: "/images/articles/assist_match_distribution.png",
      alt: "Ronaldo's assist distribution by match, by 1, 2, and 3 assists in a game.",
    },
    {
      type: "paragraph",
      text: "The graph shows a few cases of games in which Ronaldo recorded two or more assists in a single game, but most times show that he recorded just one assist. There were two standout games in which he had a hat-trick of assists: Aston Villa 2007/08 (H) and Almeria 2010/11 (H).",
    },
    {
      type: "heading",
      text: "Investigating the Discrepancy in Ronaldo's Assist Tally",
    },
    {
      type: "paragraph",
      text: "Headline figures for Cristiano Ronaldo’s career assist tally frequently conflict across major databases. Depending on where you look, his total can vary by tens of assists, creating confusion around his true creative output. Understanding these discrepancies requires looking past the numbers to examine the data collection methodologies behind them.",
    },
    {
      type: "heading",
      text: "What Counts as an Assist?",
    },
    {
      type: "paragraph",
      text: "The primary driver of conflicting totals is the absence of a single, universally mandated definition for an assist in football. Statistical providers evaluate key actions differently:",
    },
    {
      type: "paragraph",
      text: "Opta Standard: Considered the industry baseline for providers like SofaScore and WhoScored, Opta defines an assist strictly as the final touch leading directly to a goalscorer. Deflections off defending players only count if the intended recipient was guaranteed to receive the ball regardless of contact. Under this framework, earned penalties, direct free-kicks, and rebounded shots off posts or goalkeepers are explicitly excluded.",
    },
    {
      type: "paragraph",
      text: "Extended Definitions: Platforms like Transfermarkt adopt a much broader criteria. They routinely award assists for drawn penalties, deflected passes, uncredited own goals, and secondary touches off saved shots. Consequently, published tallies on these platforms appear significantly higher than Opta-aligned databases, which has caused inconsistent assist tallies to appear across social media. This has led fans to believe he has over 300 assists, which is not true if using Opta's definition of an assist. Furthermore, this has affected his assist tally in a way where he has been credited with 131 assists for Real Madrid, while Opta have him at 120 assists. The inconsistency in data impacts overall summations, as there is no singular standard agreed upon.",
    },
    {
      type: "paragraph",
      text: "Competition-Specific Rules: Major tournament organizers occasionally apply unique standards. For example, UEFA credits Ronaldo with a goalkeeper rebound assist against Croatia at Euro 2016, a touch Opta omits under its strict standard. This singular assist puts him at the top as the assist leader in the UEFA EURO Championship, while our records have him at one less assist. SImilarly, the UEFA Champions League has him as the assist leader with 42 assists, while Opta has him at 40, with Ryan Giggs being the all-time assist leader. It is important to note that Opta's assist differs from outs because we credited Ronaldo with an assist in the 2009/10 season against Marseille, which is one they do not give him. Also, UEFA counts that one and another assist in a qualifier game, putting his tally to 42.",
    },
    {
      type: "heading",
      text: "How will this impact the data on The Ronaldo Archive?",
    },
    {
      type: "paragraph",
      text: "To put it shortly, we will use Opta's definition of an assist, rather than the extended definitions that include things such as penalties won, deflections, rebounds, etc. However, we will extend our data to include such things in match logs, visualizations, and more. Upon expanding the match logs for a game, we will show if there are any instances in which Ronaldo had a non-Opta assist. It is not that those who believe Ronaldo has over 300 assists are wrong; it is that their definition of an assist is different from Opta's. If instances such as Marseille 2009/10 occur where Opta do not give an assist for something we disagree with, we will make exceptions.",
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

export default ronaldo_assists;
