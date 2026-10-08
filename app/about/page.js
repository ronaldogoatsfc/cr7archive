import SocialLinks from "@/components/SocialLinks";

export const metadata = {
  title: "About — The Ronaldo Archive",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        About
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        Our mission
      </h1>

      <div className="mt-8 space-y-5 text-paper-dim">
        <p>
          The Ronaldo Archive is a fan-made project built to log Cristiano
          Ronaldo&apos;s career match by match. It is a place where fans can
          explore every appearance, goal, assist, and trophy, filterable and
          visualized in one place. The goal is to provide a comprehensive,
          accurate, and accessible record of Ronaldo&apos;s career for fans,
          researchers, and enthusiasts alike.
        </p>

        <p>
          This website is maintained by hand: match data is added and corrected
          manually, rather than pulled automatically from a live feed. Accuracy
          therefore depends on ongoing research, review, and upkeep rather than
          an official source.
        </p>

        <p>
          This site is{" "}
          <span className="text-paper">
            not affiliated with, endorsed by, or connected to
          </span>{" "}
          Cristiano Ronaldo, any club, league, or federation he has played for,
          but rather an independent fan project. No copyright is claimed over
          any underlying match footage, competition names, or club and
          federation marks referenced here; they remain the property of their
          respective owners.
        </p>

        <p>
          If you spot an error, have footage for a match, or have a correction
          to suggest, please get in touch:
        </p>

        <p>
          <a
            href="mailto:ronaldogoatsfc@gmail.com"
            className="font-mono text-gold underline underline-offset-2 hover:text-gold-bright"
          >
            ronaldogoatsfc@gmail.com
          </a>
        </p>

        <h2 className="pt-8 font-display text-3xl font-semibold text-paper">
          Methodology &amp; Sources
        </h2>

        <p>
          The Ronaldo Archive is independently researched and maintained. Match
          information is reviewed and entered manually rather than being pulled
          from a live statistical feed. When possible, information is
          cross-checked across multiple sources to help identify discrepancies
          and improve accuracy.
        </p>

        <h3 className="pt-2 font-display text-xl font-semibold text-paper">
          Match data
        </h3>

        <p>
          Match statistics, dates, results, goals, assists, ratings, and
          advanced statistics are primarily researched using{" "}
          <span className="text-paper">SofaScore</span> and{" "}
          <span className="text-paper">WhoScored</span>. These sources provide
          detailed match-level information that helps build the archive&apos;s
          individual match records and statistical breakdowns.
        </p>

        <p>
          <span className="text-paper">Messi vs Ronaldo</span> is also used as
          a supplementary reference for match information, career statistics,
          and historical data.
        </p>

        <p>
          Because historical football records can vary between statistical
          providers, some figures may differ from other websites. When
          discrepancies are identified, the archive is reviewed and updated
          where appropriate.
        </p>

        <h3 className="pt-2 font-display text-xl font-semibold text-paper">
          Match footage
        </h3>

        <p>
          Match footage and match compilations are sourced from{" "}
          <span className="text-paper">Footballia</span> when available.
          Footage availability varies by match, particularly for older games,
          so not every match in the archive has a corresponding video.
        </p>

        <h3 className="pt-2 font-display text-xl font-semibold text-paper">
          Trophies and honors
        </h3>

        <p>
          Trophy information is researched using{" "}
          <span className="text-paper">Transfermarkt</span>,{" "}
          <span className="text-paper">Wikipedia</span>, and Messi vs Ronaldo.
          Individual honors and awards are primarily researched using
          Wikipedia and Messi vs Ronaldo.
        </p>

        <h3 className="pt-2 font-display text-xl font-semibold text-paper">
          How the statistics are calculated
        </h3>

        <p>
          The archive&apos;s visualizations and summary statistics are
          calculated from the match data contained within The Ronaldo Archive.
          This includes statistics such as:
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>Goals and assists by season</li>
          <li>Goals by competition, club, opponent, venue, and month</li>
          <li>Goals per 90 minutes</li>
          <li>Win percentage</li>
          <li>Match rating distributions</li>
          <li>Appearances and goal contributions by club</li>
          <li>Career totals and per-match averages</li>
        </ul>

        <p>
          These calculations are generated from the archive&apos;s underlying
          match records rather than manually entered summary figures.
        </p>

        <h3 className="pt-2 font-display text-xl font-semibold text-paper">
          Data limitations
        </h3>

        <p>
          The archive is an independent fan project and is not an official
          source of Cristiano Ronaldo&apos;s career statistics. Historical
          records can contain incomplete information, and statistics such as
          assists, ratings, and advanced metrics may differ between providers.
          Some matches may therefore have fewer available statistics than
          others.
        </p>

        <p>
          The database is continuously maintained, and corrections or
          additional information may be added as reliable sources become
          available.
        </p>

        <h2 className="pt-8 font-display text-3xl font-semibold text-paper">
          What&apos;s next?
        </h2>

        <p>
          Here are some additional features that we are considering implementing
          in the near future:
        </p>

        <p>
          <span className="text-paper">Official &amp; Unofficial Match Logs: </span>
          There are many games where statistics and footage were not found. If
          this changes, we will add them. Other things such as goal types,
          minute scored in, assist types, and opponent rankings will be added
          in the future.
        </p>

        <p>
          <span className="text-paper">Articles: </span>
          If you have an article or analysis piece that you would like to
          submit, please reach out to us and we will consider adding it to the
          site.
        </p>

        <p>
          <span className="text-paper">Comparisons: </span>
          We plan on building a comparison tool that users can use to compare
          across seasons, clubs, years, and more.
        </p>

        <p>
          <span className="text-paper">Timeline: </span>
          We are looking to add a chronological view of Ronaldo&apos;s career,
          covering the milestones and achievements throughout his journey.
        </p>

        <p>
          <span className="text-paper">Mobile Compatibility: </span>
          We are looking into enhancing the mobile user&apos;s experience.
        </p>

        <p>Follow along or drop a suggestion on social media:</p>
        <SocialLinks />
      </div>
    </div>
  );
}