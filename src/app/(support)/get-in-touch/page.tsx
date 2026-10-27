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
 * The page is a wrapper now.
 *
 * It used to read NEXT_PUBLIC_TELEGRAM_COMMUNITY_URL on the server and hand the
 * invite down, so the link lived in configuration rather than the client bundle.
 * The community chat step is gone — pending a link to chat inside the SFLuv app
 * — so there is nothing left to read. The env var is deliberately left in
 * .env.example and in the deployment: it costs nothing unset, and the
 * replacement step will want somewhere to put a link.
 *
 * `startOnForm` went with it. The form is the only thing on the page, so it is
 * always open and arriving with a ?subject= no longer needs to skip a step —
 * it just preselects the subject.
 */
export default async function GetInTouchPage({
  searchParams
}: {
  searchParams: Promise<{ subject?: string }>;
}) {
  const { subject } = await searchParams;

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <GetInTouchFlow initialSubject={subject ?? null} />
      </Container>
    </section>
  );
}
