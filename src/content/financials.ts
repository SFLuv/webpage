import type { DocumentLink } from "@/components/ui/DocumentLinkList";

export type ReportPeriod = {
  label: string;
  documents: DocumentLink[];
};

export type FiscalYear = {
  label: string;
  /** Expanded by default in the accordion — most recent year first. */
  periods: ReportPeriod[];
};

export const financialsContent = {
  title: "Financials and Reports",
  lead: "Quarterly and fiscal year statements, tax filings, and our 501(c)(3) determination letter.",
  determinationLetter: {
    title: "501(c)(3) Determination Letter",
    href: "/assets/wp-content/uploads/2024/08/SFLuv-501c3-Determination-Letter.pdf",
    label: "SFLuv 501c3 Determination Letter"
  }
};

export const fiscalYears: FiscalYear[] = [
  {
    label: "FYE June 30, 2026",
    periods: [
      {
        label: "Q2",
        documents: [
          {
            href: "/assets/wp-content/uploads/2026/02/SFLuv20StatementofActivity202025_12_31-2.pdf",
            label: "2025-12-31 Statement of Activity"
          },
          {
            href: "/assets/wp-content/uploads/2026/02/SFLuv20StatementofCashFlows202025_12_31.pdf",
            label: "2025-12-31 Statement of Cash Flows"
          },
          {
            href: "/assets/wp-content/uploads/2026/02/SFLuv-StatementofFinancialPosition-2025_12_31.pdf-SFLuv-StatementofActivity-2025_12_31.pdf-SFLuv-StatementofCashFlows-2025_12_31.pdf",
            label: "2025-12-31 Statement of Financial Position"
          }
        ]
      },
      {
        label: "Q1",
        documents: [
          {
            href: "/assets/wp-content/uploads/2026/01/2025-09-30-Statement-of-Activity-.pdf",
            label: "2025-09-30 Statement of Activity"
          },
          {
            href: "/assets/wp-content/uploads/2026/01/2025-09-30-Statement-of-Cash-Flows.pdf",
            label: "2025-09-30 Statement of Cash Flows"
          },
          {
            href: "/assets/wp-content/uploads/2026/01/2025-09-30-Statement-of-Financial-Position.pdf",
            label: "2025-09-30 Statement of Financial Position"
          }
        ]
      }
    ]
  },
  {
    label: "FYE June 30, 2025",
    periods: [
      {
        label: "Q4 / FYE",
        documents: [
          {
            href: "/assets/wp-content/uploads/2025/07/2025_06_30-FYE-StatementofActivity.pdf",
            label: "2025-06-30 Statement of Activity"
          },
          {
            href: "/assets/wp-content/uploads/2025/07/2025_06_30-FYE_StatementofCashFlows.pdf",
            label: "2025-06-30 Statement of Cash Flows"
          },
          {
            href: "/assets/wp-content/uploads/2025/07/2025_06_30-FYE-Statement-of-Financial-Position.pdf",
            label: "2025-06-30 Statement of Financial Position"
          },
          {
            href: "/assets/wp-content/uploads/2025/07/2025_06_30_Stmnt-of-Activity_Comparison.pdf",
            label: "2025-06-30 Statement of Activity Comparison"
          },
          {
            href: "/assets/wp-content/uploads/2025/09/FYE-2025_199N-Confirmation.pdf",
            label: "2025 199N Confirmation"
          },
          { href: "/assets/wp-content/uploads/2025/09/FYE-2025_990N.pdf", label: "2025 990N" }
        ]
      },
      {
        label: "Q3",
        documents: [
          {
            href: "/assets/wp-content/uploads/2025/06/2025-03-31-Statement-of-Activity.pdf",
            label: "2025-03-31 Statement of Activity"
          },
          {
            href: "/assets/wp-content/uploads/2025/06/2025-03-31-Statement-of-Cash-Flows.pdf",
            label: "2025-03-31 Statement of Cash Flows"
          },
          {
            href: "/assets/wp-content/uploads/2025/06/2025-03-31-Statement-of-Financial-Position.pdf",
            label: "2025-03-31 Statement of Financial Position"
          }
        ]
      },
      {
        label: "Q2",
        documents: [
          {
            href: "/assets/wp-content/uploads/2025/06/2024-12-31-Statement-of-Activity-.pdf",
            label: "2024-12-31 Statement of Activity"
          },
          {
            href: "/assets/wp-content/uploads/2025/06/2024-12-31-Statement-of-Cash-Flows.pdf",
            label: "2024-12-31 Statement of Cash Flows"
          },
          {
            href: "/assets/wp-content/uploads/2025/06/2024-12-31-Statement-of-Financial-Position.pdf",
            label: "2024-12-31 Statement of Financial Position"
          }
        ]
      }
    ]
  },
  {
    label: "FYE June 30, 2024",
    periods: [
      {
        label: "Full year",
        documents: [
          {
            href: "/assets/wp-content/uploads/2024/11/2024-06-30-Statement-of-Activity.pdf",
            label: "2024-06-30 Statement of Activity"
          },
          {
            href: "/assets/wp-content/uploads/2024/11/2024-06-30-Statement-of-Cash-Flows.pdf",
            label: "2024-06-30 Statement of Cash Flows"
          },
          {
            href: "/assets/wp-content/uploads/2024/11/2024-06-30-Statement-of-Financial-Position.pdf",
            label: "2024-06-30 Statement of Financial Position"
          },
          {
            href: "/assets/wp-content/uploads/2025/09/FYE-2024_199N-Confirmation.pdf",
            label: "2024 199N Confirmation"
          },
          { href: "/assets/wp-content/uploads/2025/09/FYE-2024_990N.pdf", label: "2024 990N" }
        ]
      }
    ]
  }
];
