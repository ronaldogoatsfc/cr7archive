export default function StatCard({ label, value, accent = "gold", detail }) {
  const accentClass = accent === "turf" ? "text-turf-bright" : "text-gold";
  return (
    <div className="rounded-2xl border border-line bg-pitch-raised p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-paper-dim">
        {label}
      </p>
      <p className={`stat-number mt-2 text-4xl font-semibold ${accentClass}`}>
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-paper-dim">{detail}</p>}
    </div>
  );
}
