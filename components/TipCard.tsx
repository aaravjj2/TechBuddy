export type TipCardProps = {
  title: string;
  body: string;
  action?: string;
};

export function TipCard({ title, body, action }: TipCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-3xl" aria-hidden>
          💡
        </span>
        <h2 className="font-display text-[28px] text-text-primary">
          Today&apos;s Tip
        </h2>
      </div>
      <div className="h-px w-full bg-border" />
      <h3 className="mt-6 font-display text-[24px] text-text-primary">{title}</h3>
      <p className="mt-4 text-body text-text-primary">{body}</p>
      {action ? (
        <p className="mt-4 text-body font-semibold text-text-primary">{action}</p>
      ) : null}
    </article>
  );
}
