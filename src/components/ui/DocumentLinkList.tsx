import { DocumentIcon } from "@/components/icons";
import { financialDocumentAnchor } from "@/content/financials";

/** `id`, when there is one, makes the item a link target (see `OpenOnHash`). */
export type DocumentLink = { href: string; label: string; id?: string };

type DocumentLinkListProps = {
  links: DocumentLink[];
};

/** Vertical list of downloadable documents (PDF reports, filings, letters). */
export function DocumentLinkList({ links }: DocumentLinkListProps) {
  return (
    <ul className="flex flex-col gap-1.5">
      {links.map((link) => (
        <li
          key={link.href + link.label}
          id={link.id ? financialDocumentAnchor(link.id) : undefined}
          className="scroll-mt-32 rounded-lg target:bg-brand-tint target:ring-2 target:ring-brand/40"
        >
          <a
            className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-ink no-underline transition-colors hover:bg-brand-tint"
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            <DocumentIcon className="mt-0.5 size-4 shrink-0 fill-brand" />
            <span className="underline decoration-transparent underline-offset-2 transition-colors group-hover:decoration-current">
              {link.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
