import { Disclosure } from "@/components/ui/Disclosure";
import { DocumentLinkList } from "@/components/ui/DocumentLinkList";
import type { FiscalYear } from "@/content/financials";

export function FiscalYearReports({ years }: { years: FiscalYear[] }) {
  return (
    <div className="flex flex-col gap-3">
      {years.map((year, index) => (
        <Disclosure key={year.label} summary={year.label} defaultOpen={index === 0}>
          <div className="flex flex-col gap-5">
            {year.periods.map((period) => (
              <div key={period.label}>
                <h3 className="mb-2 font-medium text-ink">{period.label}</h3>
                <DocumentLinkList links={period.documents} />
              </div>
            ))}
          </div>
        </Disclosure>
      ))}
    </div>
  );
}
