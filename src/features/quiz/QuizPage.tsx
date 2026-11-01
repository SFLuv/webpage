import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Quiz } from "@/features/quiz/Quiz";
import type { QuizContent } from "@/content/quiz";

/**
 * The quiz page, in whichever language `content` is written in. `lang` marks
 * the page's text so screen readers and translation tools read it correctly
 * (the site's <html> is English).
 */
export function QuizPage({ content, lang }: { content: QuizContent; lang: string }) {
  return (
    <div lang={lang}>
      <PageHeader title={content.title} lead={content.subtitle} />

      <section className="py-8">
        <Container>
          <p className="mb-4 text-right text-sm">
            <Link
              className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand"
              href={content.ui.otherLanguage.href}
              hrefLang={lang === "es" ? "en" : "es"}
            >
              {content.ui.otherLanguage.label}
            </Link>
          </p>
          <Quiz content={content} />
        </Container>
      </section>
    </div>
  );
}
