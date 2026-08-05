import { Container } from "@/components/ui/Container";
import { DocumentLinkList } from "@/components/ui/DocumentLinkList";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { FiscalYearReports } from "@/features/financials/FiscalYearReports";
import { financialsContent, fiscalYears } from "@/content/financials";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: financialsContent.title,
  description: financialsContent.lead,
  path: routes.financialsAndReports
});

export default function FinancialsAndReportsPage() {
  const { determinationLetter } = financialsContent;

  return (
    <>
      <PageHeader title={financialsContent.title} lead={financialsContent.lead} />

      <section className="py-10">
        <Container>
          <FiscalYearReports years={fiscalYears} />

          <Panel padding="md" bordered className="mt-8">
            <h2 className="mb-2 font-medium text-ink">{determinationLetter.title}</h2>
            <DocumentLinkList links={[{ href: determinationLetter.href, label: determinationLetter.label }]} />
          </Panel>
        </Container>
      </section>
    </>
  );
}
