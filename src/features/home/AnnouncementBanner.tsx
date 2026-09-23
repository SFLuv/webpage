import Image from "next/image";
import { RichInline } from "@/components/content/RichDocument";
import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { announcement } from "@/content/announcement";
import { cn } from "@/lib/cn";

/**
 * Homepage announcement, switched on and off from `src/content/announcement.ts`.
 *
 * Renders nothing when disabled, so the hero moves back up to the top of the
 * page with no leftover spacing.
 */
export function AnnouncementBanner() {
  if (!announcement.enabled) return null;

  const { eyebrow, title, body, image, actions = [] } = announcement;

  return (
    <section aria-label="Announcement" className="pt-6">
      <Container width="wide">
        <div className="panel relative overflow-hidden">
          {/* Brand edge, matching the accent the site uses on its buttons. */}
          <div className="absolute inset-y-0 left-0 w-1.5 bg-brand" aria-hidden="true" />

          <div
            className={cn(
              "grid items-center gap-x-4 gap-y-4 p-5 pl-7 sm:gap-x-8 sm:p-7 sm:pl-10",
              image ? "grid-cols-[4.5rem_1fr] sm:grid-cols-[auto_1fr]" : "grid-cols-1"
            )}
          >
            {image ? (
              <div className="rounded-lg bg-brand-tint p-1.5 sm:row-span-2 sm:rounded-xl sm:p-3">
                <Image
                  className="h-auto w-full rounded-sm shadow-raised sm:w-28 sm:rounded-md"
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="112px"
                  priority
                />
              </div>
            ) : null}

            <div className="sm:self-end">
              {eyebrow ? (
                <p className="text-xs font-semibold tracking-[0.14em] text-brand uppercase">{eyebrow}</p>
              ) : null}
              <h2 className="mt-1.5 text-title font-semibold">{title}</h2>
            </div>

            <div className={cn("min-w-0 sm:col-start-2 sm:self-start", image && "col-span-2 sm:col-span-1")}>
              <p className="max-w-3xl text-ink-muted [&_a]:font-medium [&_a]:text-brand-deep [&_a]:underline [&_a]:underline-offset-2">
                <RichInline nodes={body} />
              </p>

              {actions.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {actions.slice(0, 2).map((action, index) => (
                    <Button
                      key={action.href}
                      href={action.href}
                      external={action.newTab}
                      variant={index === 0 ? "primary" : "secondary"}
                    >
                      {action.label}
                      {index === 0 ? <ArrowRightIcon className="size-3.5 fill-current" /> : null}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
