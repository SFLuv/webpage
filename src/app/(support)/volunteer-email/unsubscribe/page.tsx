import type { Metadata } from "next";
import { EmailPreferencePage } from "@/features/volunteers/EmailPreferencePage";

export const metadata: Metadata = {
  title: "Unsubscribe from volunteer emails",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ token?: string | string[]; status?: string | string[] }>;
};

function one(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function UnsubscribeVolunteerEmailPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <EmailPreferencePage action="unsubscribe" token={one(params.token)} status={one(params.status)} />
  );
}
