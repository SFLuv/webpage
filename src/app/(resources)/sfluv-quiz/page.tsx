import { quizEn } from "@/content/quiz";
import { QuizPage } from "@/features/quiz/QuizPage";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: quizEn.title,
  description: quizEn.description,
  path: routes.quiz
});

export default function EnglishQuizPage() {
  return <QuizPage content={quizEn} lang="en" />;
}
