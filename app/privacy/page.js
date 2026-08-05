export const metadata = {
  title: "Privacy Policy — The Ronaldo Archive",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
        Legal
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        Privacy Policy
      </h1>
      <p className="mt-2 font-mono text-xs text-paper-dim">
        Last updated: [August 5, 2026]
      </p>

      <div className="mt-8 space-y-6 text-paper-dim">
        <section>
          <h2 className="font-display text-xl font-semibold text-paper">
            Overview
          </h2>
          <p className="mt-2">
            This is a personal, fan-made project. This policy explains what
            information is collected when you visit this site, why, and what
            choices you have. It is not affiliated with Cristiano Ronaldo or
            any club, league, or federation — see the{" "}
            <a href="/about" className="text-gold underline underline-offset-2">
              About page
            </a>{" "}
            for more on that.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper">
            Cookies & Similar Technologies
          </h2>
          <p className="mt-2">
            This site may use cookies and similar technologies for the
            following purposes:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong className="text-paper">Advertising</strong> — if this
              site displays ads (for example, via Google AdSense), Google and
              its partners may use cookies to serve ads based on your prior
              visits to this site or other sites on the internet. You can
              manage or opt out of personalized advertising by visiting{" "}
              <a
                href="https://adssettings.google.com"
                className="text-gold underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              <strong className="text-paper">Analytics</strong> — this site
              may use analytics tools (such as Google Analytics or Vercel
              Analytics) to understand overall traffic patterns, such as
              which pages are visited and roughly how many people visit. This
              data is aggregated and is not used to personally identify you.
            </li>
          </ul>
          <p className="mt-2">
            You can control cookies through your browser settings, and this
            site shows a cookie banner on your first visit so you can choose
            whether to accept non-essential cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper">
            Third-Party Services
          </h2>
          <p className="mt-2">
            This site links out to third-party platforms — including
            YouTube, Vimeo, and Footballia — for match footage. Those sites
            have their own privacy policies and their own cookies, which this
            policy does not cover. Clicking through to any of them is subject
            to that site's own terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper">
            What This Site Does Not Do
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>This site does not require an account or login.</li>
            <li>
              This site does not knowingly collect personal information from
              children.
            </li>
            <li>
              This site does not sell any information about you to third
              parties.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper">
            Your Choices
          </h2>
          <p className="mt-2">
            Depending on where you live, you may have rights to access,
            correct, or request deletion of information collected about you,
            and to opt out of certain data uses (including personalized
            advertising). Since this site does not maintain user accounts or
            store personal profiles, most of these rights are exercised
            through your browser's cookie settings and the Google Ads
            Settings link above, rather than through a request to this site
            directly. If you have a specific concern, you can still reach out
            using the contact info below.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper">
            Changes to This Policy
          </h2>
          <p className="mt-2">
            This policy may be updated from time to time as the site changes
            — for example, if a new analytics or advertising service is
            added. The "Last updated" date at the top of this page will
            reflect the most recent change.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-paper">
            Contact
          </h2>
          <p className="mt-2">
            Questions about this policy can be sent to{" "}
            <a
              href="mailto:ronaldogoatsfc@gmail.com"
              className="font-mono text-gold underline underline-offset-2"
            >
              ronaldogoatsfc@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}