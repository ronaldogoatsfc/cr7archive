"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TimelineDetailsPanel from "@/components/TimelineDetailsPanel";
import TimelineCardPreview from "@/components/TimelineCardPreview";

export default function TimelineMomentCard({ event, presentation, month, day, details }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (keyEvent) => { if (keyEvent.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <article id={event.anchorId} className="relative scroll-mt-28 target:rounded-2xl target:ring-1 target:ring-gold/60 grid gap-3 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-6">
        <div className="relative z-10 flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1 sm:pt-5">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">{month}</span>
          <span className="stat-number text-3xl font-semibold leading-none text-paper sm:text-4xl">{day}</span>
        </div>
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
          className="group/card w-full rounded-2xl border border-line bg-pitch-raised/80 p-5 text-left transition duration-300 hover:border-gold/50 hover:bg-pitch-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm leading-7 text-paper sm:text-[15px]">{event.description}</p>
          </div>
          <TimelineCardPreview presentation={presentation} details={details} />
        </button>
        <span className="absolute left-[7px] top-0 hidden h-full w-px bg-gradient-to-b from-gold/50 via-line to-transparent sm:block" />
      </article>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <button type="button" aria-label="Close moment details" onClick={() => setOpen(false)} className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm" />
          <section role="dialog" aria-modal="true" aria-labelledby="timeline-moment-title" className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/25 bg-pitch-raised shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close details" className="rounded-full border border-line p-2 text-paper-dim transition hover:border-gold hover:text-gold"><X size={17} /></button>
            </div>
            <div className="p-5 sm:p-7">
              <h2 id="timeline-moment-title" className="font-display text-2xl font-semibold text-paper sm:text-3xl">{presentation.headline}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-8 text-paper-dim sm:text-base">{event.description}</p>
              {event.details && (
                <section className="mt-7 rounded-xl border border-gold/20 bg-pitch p-4 sm:p-5">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">Voting breakdown</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {event.details.split("|").map((entry, index) => {
                      const [name, ...valueParts] = entry.split(":");
                      return (
                        <div key={index} className="rounded-lg border border-line bg-pitch-raised/70 p-3">
                          <p className="text-xs leading-5 text-paper-dim">{name.trim()}</p>
                          <p className="mt-1 data-mono text-sm font-semibold text-paper">{valueParts.join(":").trim()}</p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
              <TimelineDetailsPanel details={details} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}
