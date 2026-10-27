import { Container } from "@/components/ui/Container";
import { GetInTouchFlow } from "@/features/contact/GetInTouchFlow";
import { getInTouchContent } from "@/content/get-in-touch";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: getInTouchContent.title,
  description: getInTouchContent.lead,
  path: routes.getInTouch
});

/**
 * The community chat invite is read on the server so the link is configured in
 * one place with everything else, rather than being baked into the client
 * bundle — it changes when the group does, and a stale invite in a cached
 * bundle is worse than no invite.
 */
export default async function GetInTouchPage({
  searchParams
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;
  const communityUrl = process.env.NEXT_PUBLIC_TELEGRAM_COMMUNITY_URL?.trim() ?? "";

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <GetInTouchFlow
          initialSubject={subject ?? null}
          communityUrl={communityUrl}
          // Arriving with a subject means arriving from a button that already
          // said what this is about, so the form opens rather than making
          // somebody click again to say the same thing.
          startOnForm={Boolean(subject)}
        />
      </Container>
    </section>
  );
}
