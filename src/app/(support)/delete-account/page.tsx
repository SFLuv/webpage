import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { AccountDeletionForm } from "@/features/account-deletion/AccountDeletionForm";
import { deleteAccountContent } from "@/content/forms";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: deleteAccountContent.title,
  description: deleteAccountContent.lead,
  path: routes.deleteAccount
});

export default function DeleteAccountPage() {
  const { signIn, help, policies } = deleteAccountContent;

  return (
    <>
      <PageHeader title={deleteAccountContent.title} lead={deleteAccountContent.lead} />

      <section className="py-8">
        <Container>
          <div className="flex flex-col gap-7">
            <Panel padding="lg" bordered as="section">
              <h2 className="text-title font-medium">{signIn.title}</h2>
              <p className="mt-2 font-medium text-ink-muted">{signIn.lead}</p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button href={signIn.primaryCta.href}>{signIn.primaryCta.label}</Button>
                <Button variant="secondary" href={signIn.secondaryCta.href} external={false}>
                  {signIn.secondaryCta.label}
                </Button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Panel tone="muted" padding="sm" bordered>
                  <h3 className="mb-2 font-medium">{signIn.afterSignIn.title}</h3>
                  <ol className="list-decimal pl-5 text-ink-muted">
                    {signIn.afterSignIn.steps.map((step) => (
                      <li key={step} className="my-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </Panel>

                <Panel tone="muted" padding="sm" bordered>
                  <h3 className="mb-2 font-medium">{signIn.retention.title}</h3>
                  <p className="text-ink-muted">{signIn.retention.body}</p>
                </Panel>
              </div>

              <p className="mt-6 font-medium text-danger">{signIn.warning}</p>
            </Panel>

            <Panel id="deletion-help" padding="lg" bordered as="section" className="scroll-mt-24">
              <h2 className="text-title font-medium">{help.title}</h2>
              <p className="mt-2 mb-6 font-medium text-ink-muted">{help.lead}</p>
              <AccountDeletionForm />
            </Panel>

            <Panel padding="lg" bordered as="section">
              <h2 className="text-title font-medium">{policies.title}</h2>
              <p className="mt-2 mb-5 font-medium text-ink-muted">{policies.lead}</p>
              <div className="flex flex-wrap gap-3">
                {policies.links.map((link) => (
                  <Button key={link.href} variant="secondary" href={link.href}>
                    {link.label}
                  </Button>
                ))}
              </div>
            </Panel>
          </div>
        </Container>
      </section>
    </>
  );
}
