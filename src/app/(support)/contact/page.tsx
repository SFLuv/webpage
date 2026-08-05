import { Container } from "@/components/ui/Container";
import { MailtoForm } from "@/features/contact/MailtoForm";
import { contactFormConfig } from "@/content/forms";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: contactFormConfig.title,
  description: contactFormConfig.lead,
  path: routes.contact
});

export default function ContactPage() {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <MailtoForm config={contactFormConfig} />
      </Container>
    </section>
  );
}
