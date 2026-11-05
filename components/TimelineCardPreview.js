export default function TimelineCardPreview({ presentation, details }) {
  const items = [];
  const add = (label, value) => {
    if (value === undefined || value === null || value === "") return;
    const normalized = label.toLowerCase();
    if (items.some((item) => item.label.toLowerCase() === normalized)) return;
    items.push({ label, value });
  };

  (presentation?.highlights || []).forEach((item) => add(item.label, item.value));

  const snapshot = details?.stats?.[0]?.stats;
  if (snapshot) {
    add("Appearances", snapshot.appearances);
    add("Goals", snapshot.goals);
    add("Assists", snapshot.assists);
  }

  if (details?.trophies) {
    const total = details.trophies.reduce((sum, group) => sum + group.items.length, 0);
    add("Domestic trophies", total);
    details.trophies.forEach((group) => add(group.club, group.items.length));
  }

  (details?.transfer?.facts || []).forEach((fact) => add(fact.label, fact.value));
  (details?.record?.facts || []).forEach((fact) => add(fact.label, fact.value));

  const visibleItems = items.slice(0, 4);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {visibleItems.length > 0 ? visibleItems.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2 rounded-lg border border-line bg-pitch px-3 py-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">{item.label}</span>
          <span className="data-mono text-sm font-semibold text-paper">{item.value}</span>
        </span>
      )) : (
        <span className="text-xs text-paper-dim">Explore the story and context behind this career moment</span>
      )}
      <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-gold transition group-hover/card:translate-x-0.5">
        Click to explore ↗
      </span>
    </div>
  );
}
