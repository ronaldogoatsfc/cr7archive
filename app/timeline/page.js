import Link from "next/link";
import { getTimelineEvents } from "@/lib/timeline";

export const metadata = {
  title: "Career Timeline | The Ronaldo Archive",
  description: "Explore significant moments from Cristiano Ronaldo's career in chronological order.",
};

export default function TimelinePage() {
  const events = getTimelineEvents();
  const years = [...new Set(events.map((event) => event.year))];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          The Career Timeline
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-paper sm:text-5xl">
          Ronaldo&apos;s journey
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-paper-dim">
          Explore defining performances, milestones, and achievements from the
          beginning of Ronaldo&apos;s career to the present.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block text-sm font-semibold text-gold transition hover:text-gold-bright"
        >
          ← Back to home
        </Link>
      </div>

      <div className="space-y-8">
        {years.map((year) => {
          const yearEvents = events.filter((event) => event.year === year);

          return (
            <section key={year} className="border-t border-line pt-6">
              <h2 className="mb-4 font-display text-2xl font-semibold text-gold">
                {year}
              </h2>
              <div className="space-y-3">
                {yearEvents.map((event) => (
                  <details
                    key={event.date + event.description}
                    className="group rounded-xl border border-line bg-pitch-raised"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                      <span className="font-semibold text-paper">
                        {new Date(event.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric" }
                        )}
                      </span>
                      <span className="shrink-0 font-mono text-xs text-gold transition group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="border-t border-line px-5 py-4 text-sm leading-7 text-paper-dim">
                      {event.description}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
