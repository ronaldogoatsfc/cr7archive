"use client";

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-line bg-pitch-raised/70 p-3">
      <p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">{label}</p>
      <p className="mt-1 stat-number text-xl font-semibold text-paper">{value}</p>
    </div>
  );
}

function StatsSnapshot({ snapshot }) {
  const { title, period, stats } = snapshot;
  return (
    <section className="rounded-xl border border-gold/20 bg-pitch p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-paper">{title}</h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-dim">{period}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat label="Appearances" value={stats.appearances} />
        <Stat label="Goals" value={stats.goals} />
        <Stat label="Assists" value={stats.assists} />
        <Stat label="Minutes" value={stats.minutes.toLocaleString("en-US")} />
      </div>
      <p className="mt-3 text-[11px] leading-5 text-paper-dim">
        Combined club and senior Portugal statistics from The Ronaldo Archive match logs.
        {stats.wins !== undefined ? ` Record: ${stats.wins} wins, ${stats.draws} draws, ${stats.losses} losses.` : ""}
      </p>
    </section>
  );
}

function TimelineDetailsPanel({ details }) {
  if (!details) return null;

  return (
    <div className="mt-7 space-y-4">
      {details.stats?.map((snapshot) => <StatsSnapshot key={snapshot.title} snapshot={snapshot} />)}

      {details.trophies && (
        <section className="rounded-xl border border-gold/20 bg-pitch p-4 sm:p-5">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-paper">Domestic trophies by club</h3>
            <p className="mt-1 text-xs text-paper-dim">18 trophies across Manchester United, Real Madrid, and Juventus</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {details.trophies.map((group) => (
              <div key={group.club}>
                <div className="flex items-baseline justify-between border-b border-gold/50 pb-2">
                  <h4 className="font-semibold text-paper">{group.club}</h4>
                  <span className="stat-number text-lg font-semibold text-gold">{group.items.length}</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.id} className="text-xs leading-5 text-paper-dim">
                      <span className="text-paper">{item.name}</span>
                      <span className="block font-mono text-[10px] text-paper-dim">{item.season}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {details.transfer && (
        <section className="rounded-xl border border-gold/20 bg-pitch p-4 sm:p-5">
          <h3 className="font-display text-lg font-semibold text-paper">{details.transfer.title}</h3>
          <p className="mt-2 text-sm leading-7 text-paper-dim">{details.transfer.description}</p>
          {details.transfer.facts?.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {details.transfer.facts.map((fact) => (
                <div key={fact.label} className="rounded-lg border border-line bg-pitch-raised/70 p-3">
                  <p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">{fact.label}</p>
                  <p className="mt-1 text-sm font-semibold text-paper">{fact.value}</p>
                </div>
              ))}
            </div>
          )}
          {details.transfer.note && <p className="mt-3 text-[11px] leading-5 text-paper-dim">{details.transfer.note}</p>}
        </section>
      )}

      {details.record && (
        <section className="rounded-xl border border-gold/20 bg-pitch p-4 sm:p-5">
          <h3 className="font-display text-lg font-semibold text-paper">{details.record.title}</h3>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {details.record.facts.map((fact) => <Stat key={fact.label} label={fact.label} value={fact.value} />)}
          </div>
          {details.record.note && <p className="mt-3 text-[11px] leading-5 text-paper-dim">{details.record.note}</p>}
        </section>
      )}
    </div>
  );
}

export default TimelineDetailsPanel;
