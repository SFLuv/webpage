import { quizEs } from "@/content/quiz-es";
import { QuizPage } from "@/features/quiz/QuizPage";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: quizEs.title,
  description: quizEs.description,
  path: routes.quizEs
});

export default function SpanishQuizPage() {
  return <QuizPage content={quizEs} lang="es" />;
}
