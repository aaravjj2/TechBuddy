import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-body text-text-secondary">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {i > 0 ? (
              <span aria-hidden className="text-text-secondary">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="text-accent underline hover:no-underline min-h-[44px] inline-flex items-center"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-text-primary font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
