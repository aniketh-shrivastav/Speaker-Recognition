export function LoadingDots({ label = 'Processing' }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
      <span className="flex gap-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:300ms]" />
      </span>
      {label}
    </div>
  );
}
