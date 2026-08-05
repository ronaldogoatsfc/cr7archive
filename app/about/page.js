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
          Ronaldo&apos;s career match by match. It is a place where
          fans can explore every appearance, goal, assist, and trophy, 
          filterable and visualized in one place. The goal is to 
          provide a comprehensive, accurate, and accessible record of 
          Ronaldo&apos;s career for fans, researchers, and enthusiasts 
          alike.
        </p>
        <p>
          This website is maintained by hand: match data is added and 
          corrected manually, rather than pulled automatically from a 
          live feed, so accuracy depends on ongoing upkeep rather 
          than an official source.
        </p>
        <p>
          This site is <span className="text-paper">not affiliated with, 
          endorsed by, or connected to</span> Cristiano Ronaldo, any club, 
          league, or federation he has played for. It is an independent, 
          non-commercial fan project. No copyright is claimed over any 
          underlying match footage, competition names, or club and 
          federation marks referenced here; they remain the property of 
          their respective owners.
        </p>
        <p>
          If you spot an error, have footage for a match, or have a 
          correction to suggest, please get in touch:
        </p>
        <p>
          <a
            href="mailto:ronaldogoatsfc@gmail.com"
            className="font-mono text-gold underline underline-offset-2 hover:text-gold-bright"
          >
            ronaldogoatsfc@gmail.com
          </a>
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
          What&apos;s next?
        </h1>
          <p>
            Here are some additional features that we are considering on 
            implementing in the near future:
          </p>
          <p>
            <span className="text-paper">Official & Unofficial Match Logs: </span>
            There are many games where statistics and footage were not 
            found. If this changes, we will add them. Other things such as goal 
            types, minute scored in, assist types, and opponent rankings will 
            be added in the future.
          </p>
          <p>
            <span className="text-paper">Visualizations: </span>
            We plan on building more interactive data visualizations covering 
            various aspects of Cristiano Ronaldo's game.
          </p>
          <p>
            <span className="text-paper">Individual Honors: </span>
            Clear and concise breakdown of the awards received, including 
            voting breakdown, criteria, etc.
          </p>
          <p>
            <span className="text-paper">Records: </span>
            This page is yet to be built, but will contain currently held records 
            alongside previously held records.
          </p>
          <p>
            <span className="text-paper">Articles: </span>
            If you have an article or analysis piece that you would like to submit,
            please reach out to us and we will consider adding it to the site.
          </p>
          <p>
            <span className="text-paper">Comparisons: </span>
            We plan on building a comparison tool that users can use to compare 
            across seasons, clubs, years, and more.
          </p>
          <p>
            <span className="text-paper">Mobile Compatibility: </span>
            We are looking into enhancing the mobile user's experience.
          </p>
          <p>
            <span className="text-paper">Timeline: </span>
            We are looking to add a chronological view of Ronaldo's career, 
            covering the milestones and achievements throughout his journey.
          </p>
        <p>Follow along or drop a suggestion on social media:</p>
        <SocialLinks />
      </div>
    </div>
  );
}
