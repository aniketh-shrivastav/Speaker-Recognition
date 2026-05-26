export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
        {eyebrow}
      </div>
      <h2 className="mt-2 font-display text-3xl font-semibold text-white">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-3xl text-sm text-slate-300">{subtitle}</p>
      ) : null}
    </div>
  );
}
