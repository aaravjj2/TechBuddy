type PageHeaderProps = {
  title: string;
  description?: string;
  /** Sets id on the h1 for aria-labelledby from sections */
  id?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  id,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`mb-8 space-y-2 ${className}`.trim()}>
      <h1
        id={id}
        className="font-display text-[36px] leading-tight text-text-primary"
      >
        {title}
      </h1>
      {description ? (
        <p className="text-body text-text-secondary">{description}</p>
      ) : null}
    </header>
  );
}
