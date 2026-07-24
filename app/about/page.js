import SocialLinks from "@/components/SocialLinks";

export const metadata = {
  title: "About — The CR7 Archive",
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
          The CR7 Archive is a fan-made project built to log Cristiano
          Ronaldo&apos;s career match by match. It&apos;s a place where
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
          This site is <span className="text-paper">not affiliated with, endorsed by, or
          connected to</span> Cristiano Ronaldo, any club, league, or
          federation he has played for. It is an independent, non-commercial
          fan project. No copyright is claimed over any underlying match
          footage, competition names, or club and federation marks referenced
          here; they remain the property of their respective owners.
        </p>
        <p>
          Spotted an error in the data, or have footage or a correction to
          suggest? Get in touch:
        </p>
        <p>
          <a
            href="mailto:ronaldogoatsfc@gmail.com"
            className="font-mono text-gold underline underline-offset-2 hover:text-gold-bright"
          >
            ronaldogoatsfc@gmail.com
          </a>
        </p>

        <p>Follow along or drop a suggestion on social:</p>
        <SocialLinks />
      </div>
    </div>
  );
}
