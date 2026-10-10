import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Panel } from "@/components/ui/Panel";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowRightIcon } from "@/components/icons";
import { listOpenForms } from "@/lib/site-content/client";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: "Forms and Waivers",
  description: "Sign a form or waiver for an SFLuv event or project.",
  path: routes.forms
});

/** A form opened or closed in the admin panel appears within this many seconds. */
export const revalidate = 10;

export default async function FormsPage() {
  const forms = await listOpenForms();

  return (
    <>
      <PageHeader
        title="Forms and Waivers"
        lead="If we have asked you to sign something for an SFLuv event or project, you can do it here."
      />

      <section className="py-10">
        <Container width="narrow">
          {forms === null ? (
            <Panel padding="lg" bordered>
              <p className="text-center text-ink-muted">
                Forms are temporarily unavailable. Please try again in a few minutes, or{" "}
                <Link className="font-medium text-brand-deep underline underline-offset-2" href={routes.contact}>
                  contact us
                </Link>
                .
              </p>
            </Panel>
          ) : forms.length === 0 ? (
            <Panel padding="lg" bordered>
              <p className="text-center text-ink-muted">
                There is nothing to sign right now. When we need a signature, the form will appear here.
              </p>
            </Panel>
          ) : (
            <ul className="flex flex-col gap-4">
              {forms.map((form) => (
                <li key={form.slug}>
                  <Link
                    href={`${routes.forms}/${form.slug}`}
                    className="group block rounded-panel border border-line bg-surface p-6 no-underline shadow-panel transition-shadow hover:shadow-raised"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-title font-medium text-heading">{form.title}</h2>
                        {form.summary ? <p className="mt-1.5 text-ink-muted">{form.summary}</p> : null}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-2 font-medium text-brand-deep">
                        Sign
                        <ArrowRightIcon className="size-3.5 fill-current transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
