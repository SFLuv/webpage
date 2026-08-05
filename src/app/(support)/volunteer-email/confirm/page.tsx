import type { Metadata } from "next";
import { EmailPreferencePage } from "@/features/volunteers/EmailPreferencePage";

export const metadata: Metadata = {
  title: "Confirm your volunteer email subscription",
  robots: { index: false, follow: false }
};

/** Token links are single-use and personal — never cache the outcome. */
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ token?: string | string[]; status?: string | string[] }>;
};

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function ConfirmVolunteerEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <EmailPreferencePage action="confirm" token={one(params.token)} status={one(params.status)} />
  );
}
