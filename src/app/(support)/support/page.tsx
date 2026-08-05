import { Container } from "@/components/ui/Container";
import { MailtoForm } from "@/features/contact/MailtoForm";
import { supportFormConfig } from "@/content/forms";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: supportFormConfig.title,
  description: supportFormConfig.lead,
  path: routes.support
});

export default function SupportPage() {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <MailtoForm config={supportFormConfig} />
      </Container>
    </section>
  );
}
