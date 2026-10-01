import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { SignForm } from "@/features/forms/SignForm";
import { getForm } from "@/lib/site-content/client";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await getForm(slug);
  const title = lookup.state === "open" ? lookup.form.title : lookup.state === "closed" ? lookup.title : "Form";

  // A form is for the people who were sent to it, not for search results.
  return { title, robots: { index: false, follow: false } };
}

export default async function FormPage({ params }: PageProps) {
  const { slug } = await params;
  const lookup = await getForm(slug);

  if (lookup.state === "notfound") notFound();

  if (lookup.state === "open") {
    return (
      <>
        <PageHeader title={lookup.form.title} />
        <section className="py-8">
          <Container width="narrow">
            <SignForm form={lookup.form} />
          </Container>
        </section>
      </>
    );
  }

  const closed = lookup.state === "closed";
  return (
    <>
      <PageHeader title={closed ? lookup.title : "Form unavailable"} />
      <section className="py-8">
        <Container width="narrow">
          <Panel padding="lg" bordered>
            <p className="text-center text-ink-muted">
              {closed
                ? "This form is no longer collecting signatures."
                : "This form is temporarily unavailable. Please try again in a few minutes."}{" "}
              <Link className="font-medium text-brand-deep underline underline-offset-2" href={routes.forms}>
                See forms that are open now
              </Link>
              .
            </p>
          </Panel>
        </Container>
      </section>
    </>
  );
}
