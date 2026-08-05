import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <section className="py-24 text-center">
      <Container width="narrow">
        <p className="font-medium text-brand">404</p>
        <h1 className="mt-2 text-headline">Page not found</h1>
        <p className="mt-4 text-ink-muted">
          The page you are looking for may have moved. Head back to the homepage to keep exploring SFLuv.
        </p>
        <div className="mt-8">
          <Button href={routes.home} size="lg">
            Return home
          </Button>
        </div>
      </Container>
    </section>
  );
}
