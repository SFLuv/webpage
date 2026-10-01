import { Container } from "@/components/ui/Container";
import { Disclosure } from "@/components/ui/Disclosure";
import { OpenOnHash } from "@/components/ui/OpenOnHash";
import { DocumentLinkList } from "@/components/ui/DocumentLinkList";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { FiscalYearReports } from "@/features/financials/FiscalYearReports";
import { annualImpactReportsAnchor, financialsContent } from "@/content/financials";
import { getFinancials } from "@/lib/site-content/client";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: financialsContent.title,
  description: financialsContent.lead,
  path: routes.financialsAndReports
});

/** Document uploads made in the admin panel appear within this many seconds. */
export const revalidate = 30;

export default async function FinancialsAndReportsPage() {
  const { determinationLetter } = financialsContent;
  const { years, impact_reports: impactReports } = await getFinancials();

  return (
    <>
      <PageHeader title={financialsContent.title} lead={financialsContent.lead} />

      <section className="py-10">
        <Container>
          <FiscalYearReports years={years} />

          {impactReports.length > 0 ? (
            <Disclosure
              id={annualImpactReportsAnchor}
              summary={financialsContent.annualImpactReportsTitle}
              className="mt-8 scroll-mt-32"
            >
              <DocumentLinkList links={impactReports} />
            </Disclosure>
          ) : null}

          <Panel padding="md" bordered className="mt-8">
            <h2 className="mb-2 font-medium text-ink">{determinationLetter.title}</h2>
            <DocumentLinkList links={[{ href: determinationLetter.href, label: determinationLetter.label }]} />
          </Panel>

          <OpenOnHash />
        </Container>
      </section>
    </>
  );
}
