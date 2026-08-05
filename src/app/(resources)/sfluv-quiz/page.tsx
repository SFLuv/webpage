import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Quiz } from "@/features/quiz/Quiz";
import { quizContent } from "@/content/quiz";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: quizContent.title,
  description: `${quizContent.subtitle} — learn about the Tenderloin, community finance, and SFLuv.`,
  path: routes.quiz
});

export default function QuizPage() {
  return (
    <>
      <PageHeader title={quizContent.title} lead={quizContent.subtitle} />

      <section className="py-8">
        <Container>
          <Quiz />
        </Container>
      </section>
    </>
  );
}
