import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Quiz } from "@/features/quiz/Quiz";
import type { QuizContent } from "@/content/quiz";
import { routes } from "@/lib/routes";

/** Every edition of the quiz, each labelled in its own language. */
const editions = [
  { lang: "en", href: routes.quiz, label: "English" },
  { lang: "es", href: routes.quizEs, label: "Español" },
  { lang: "zh-Hant", href: routes.quizZh, label: "中文（繁體）" }
] as const;

export type QuizLang = (typeof editions)[number]["lang"];

/**
 * The quiz page, in whichever language `content` is written in, with links to
 * the other editions. `lang` marks the page's text so screen readers and
 * translation tools read it correctly (the site's <html> is English).
 */
export function QuizPage({ content, lang }: { content: QuizContent; lang: QuizLang }) {
  return (
    <div lang={lang}>
      <PageHeader title={content.title} lead={content.subtitle} />

      <section className="py-8">
        <Container>
          <nav aria-label="Languages" className="mb-4 flex flex-wrap justify-end gap-x-4 gap-y-1 text-sm">
            {editions
              .filter((edition) => edition.lang !== lang)
              .map((edition) => (
                <Link
                  key={edition.lang}
                  className="font-medium text-brand-deep underline underline-offset-2 hover:text-brand"
                  href={edition.href}
                  hrefLang={edition.lang}
                  lang={edition.lang}
                >
                  {edition.label}
                </Link>
              ))}
          </nav>
          <Quiz content={content} />
        </Container>
      </section>
    </div>
  );
}
