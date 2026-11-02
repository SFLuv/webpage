import { quizZh } from "@/content/quiz-zh";
import { QuizPage } from "@/features/quiz/QuizPage";
import { pageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

export const metadata = pageMetadata({
  title: quizZh.title,
  description: quizZh.description,
  path: routes.quizZh
});

export default function ChineseQuizPage() {
  return <QuizPage content={quizZh} lang="zh-Hant" />;
}
