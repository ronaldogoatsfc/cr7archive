import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from "lucide-react";
import { getTimelineEvents, getEventPresentation, getTimelineMatch } from "@/lib/timeline";
import TimelinePerformanceCard from "@/components/TimelinePerformanceCard";

export const metadata = {
  title: "Career Timeline | The Ronaldo Archive",
  description: "Explore defining performances, milestones, and achievements from Cristiano Ronaldo's career.",
};

function TimelineEvent({ event }) {
  const presentation = getEventPresentation(event);
  const match = presentation.category === "Performance" ? getTimelineMatch(event) : null;
  const date = new Date(event.date + "T00:00:00");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });

  if (presentation.category === "Performance" && match) {
    return <TimelinePerformanceCard event={event} match={match} presentation={presentation} />;
  }

  return (
    <article className="group relative grid gap-3 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-6">
      <div className="relative z-10 flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1 sm:pt-5">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
          {month}
        </span>
        <span className="stat-number text-3xl font-semibold leading-none text-paper sm:text-4xl">
          {day}
        </span>
      </div>

      <div className="rounded-2xl border border-line bg-pitch-raised/80 p-5 transition duration-300 group-hover:border-gold/40 group-hover:bg-pitch-raised sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
            {presentation.category}
          </span>
          {presentation.highlights.map((highlight) => (
            <span
              key={highlight.label}
              className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-paper-dim"
            >
              <span className="text-paper">{highlight.value}</span>{" "}
              {highlight.label}
            </span>
          ))}
        </div>
        <p className="text-sm leading-7 text-paper sm:text-[15px]">
          {event.description}
        </p>
      </div>

      <span className="absolute left-[7px] top-0 hidden h-full w-px bg-gradient-to-b from-gold/50 via-line to-transparent sm:block" />
    </article>
  );
}

export default function TimelinePage() {
  const events = getTimelineEvents();
  const years = [...new Set(events.map((event) => event.year))];

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
      <section className="relative mb-16 overflow-hidden rounded-3xl border border-line bg-pitch-raised px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper-dim transition hover:text-gold"
          >
            <ArrowLeft size={14} />
            Back to archive
          </Link>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-3xl">
              <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-gold">
                <CalendarDays size={14} />
                The career timeline
              </p>
              <h1 className="font-display text-4xl font-semibold leading-tight text-paper sm:text-6xl">
                Every moment <span className="text-gold">matters.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-paper-dim sm:text-base">
                From the first steps in professional football to records,
                unforgettable performances, and career-defining achievements.
                Explore the moments that shaped Ronaldo&apos;s journey.
              </p>
            </div>

            <div className="flex gap-6 border-t border-line pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
              <div>
                <p className="stat-number text-3xl font-semibold text-paper">{events.length}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim">Moments</p>
              </div>
              <div>
                <p className="stat-number text-3xl font-semibold text-paper">{years.length}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-dim">Years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">The journey</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-paper">A career in moments</h2>
        </div>
        <p className="hidden items-center gap-2 text-xs text-paper-dim sm:flex">
          <Clock3 size={14} />
          Chronological order
        </p>
      </div>

      <div className="space-y-14">
        {years.map((year) => {
          const yearEvents = events.filter((event) => event.year === year);

          return (
            <section key={year}>
              <div className="mb-6 flex items-center gap-4">
                <h3 className="stat-number text-4xl font-semibold text-gold sm:text-5xl">{year}</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
                  {yearEvents.length} {yearEvents.length === 1 ? "moment" : "moments"}
                </span>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {yearEvents.map((event) => (
                  <TimelineEvent
                    key={event.date + event.description}
                    event={event}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 border-t border-line pt-8 text-center">
        <p className="text-sm text-paper-dim">The story is still being written.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold transition hover:text-gold-bright"
        >
          Return to The Ronaldo Archive
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </main>
  );
}
