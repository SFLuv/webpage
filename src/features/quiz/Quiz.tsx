"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Disclosure } from "@/components/ui/Disclosure";
import { Panel } from "@/components/ui/Panel";
import { StatusMessage, type Status } from "@/components/ui/StatusMessage";
import { cn } from "@/lib/cn";
import { quizContent, quizSections, type QuizQuestion } from "@/content/quiz";

type QuestionState = {
  selected: string[];
  feedback: Status;
  solved: boolean;
};

const allQuestions = quizSections.flatMap((section) => section.questions);

function initialState(): Record<number, QuestionState> {
  return Object.fromEntries(
    allQuestions.map((question) => [question.number, { selected: [], feedback: null, solved: false }])
  );
}

/** Returns null when nothing is selected yet, otherwise whether the set matches. */
function isCorrect(question: QuizQuestion, selected: string[]) {
  if (!selected.length) return null;
  if (selected.length !== question.correct.length) return false;

  const expected = [...question.correct].sort();
  return [...selected].sort().every((value, index) => value === expected[index]);
}

/**
 * Self-scoring quiz.
 *
 * Each question must be answered correctly before the quiz can be submitted,
 * matching the original: wrong answers can be retried, correct ones lock.
 */
export function Quiz() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [state, setState] = useState<Record<number, QuestionState>>(initialState);
  const [globalFeedback, setGlobalFeedback] = useState<Status>(null);
  const [finished, setFinished] = useState(false);

  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const finishRef = useRef<HTMLDivElement | null>(null);

  const section = quizSections[sectionIndex];

  const setSelection = (question: QuizQuestion, value: string, checked: boolean) => {
    setState((previous) => {
      const current = previous[question.number];
      if (current.solved) return previous;

      const selected =
        question.answerType === "single"
          ? [value]
          : checked
            ? [...current.selected, value]
            : current.selected.filter((entry) => entry !== value);

      return { ...previous, [question.number]: { ...current, selected, feedback: null } };
    });
    setGlobalFeedback(null);
  };

  const submitQuestion = (question: QuizQuestion) => {
    setGlobalFeedback(null);

    setState((previous) => {
      const current = previous[question.number];
      const result = isCorrect(question, current.selected);

      if (result === null) {
        return {
          ...previous,
          [question.number]: {
            ...current,
            feedback: { tone: "error", message: "Please choose an option before submitting." }
          }
        };
      }

      if (result) {
        return {
          ...previous,
          [question.number]: {
            ...current,
            solved: true,
            feedback: { tone: "success", message: "Correct." }
          }
        };
      }

      return {
        ...previous,
        [question.number]: {
          ...current,
          feedback: { tone: "error", message: "Not quite. Try again." }
        }
      };
    });
  };

  const goToSection = (index: number) => {
    setGlobalFeedback(null);
    setSectionIndex(index);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitQuiz = () => {
    const unanswered = allQuestions.filter((question) => !state[question.number].selected.length);
    const incorrect = allQuestions.filter(
      (question) => isCorrect(question, state[question.number].selected) === false
    );

    const blockers = unanswered.length ? unanswered : incorrect;

    if (blockers.length) {
      const verb = unanswered.length ? "finish" : "correct";
      setGlobalFeedback({
        tone: "error",
        message: `Please ${verb} questions ${blockers.map((question) => question.number).join(", ")} before submitting.`
      });

      // The first blocker is often in an earlier section, which is not mounted.
      // Switch to it so the highlighted question is actually reachable.
      const target = blockers[0];
      const targetSection = quizSections.findIndex((entry) =>
        entry.questions.some((question) => question.number === target.number)
      );

      if (targetSection !== -1 && targetSection !== sectionIndex) {
        setSectionIndex(targetSection);
      }

      window.requestAnimationFrame(() => {
        questionRefs.current[target.number]?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    setGlobalFeedback({ tone: "success", message: "All answers are correct. Submitting quiz…" });
    setState((previous) =>
      Object.fromEntries(
        Object.entries(previous).map(([key, value]) => [
          key,
          { ...value, solved: true, feedback: { tone: "success", message: "Correct." } as Status }
        ])
      )
    );
    setFinished(true);

    window.requestAnimationFrame(() => {
      finishRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const isLastSection = sectionIndex === quizSections.length - 1;

  return (
    <div className="flex flex-col gap-8">
      <Panel padding="lg" bordered as="section">
        <div ref={sectionRef} className="scroll-mt-24">
          <h2 className="text-title font-medium">{section.title}</h2>
          <p className="mt-1 mb-5 font-medium text-ink-muted">{section.lead}</p>

          <div className="flex flex-col gap-2">
            {section.facts.map((fact) => (
              <Disclosure key={fact.summary} summary={fact.summary}>
                {fact.body}
              </Disclosure>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-6">
            {section.questions.map((question) => {
              const questionState = state[question.number];

              return (
                <div
                  key={question.number}
                  ref={(node) => {
                    questionRefs.current[question.number] = node;
                  }}
                  className={cn(
                    "scroll-mt-24 rounded-xl border p-5 transition-colors",
                    questionState.solved ? "border-success/40 bg-success/5" : "border-line bg-surface-muted/40"
                  )}
                >
                  <p className="font-medium text-ink">
                    {question.number}. {question.prompt}
                  </p>

                  <fieldset className="mt-3 flex flex-col gap-2" disabled={questionState.solved}>
                    {question.answerType === "multiple" ? (
                      <legend className="mb-1 text-sm text-ink-subtle">Select all that apply.</legend>
                    ) : null}

                    {question.options.map((option) => (
                      <label key={option.value} className="flex items-start gap-2.5 text-ink-muted">
                        <input
                          className="mt-1 size-4 shrink-0 accent-brand"
                          type={question.answerType === "multiple" ? "checkbox" : "radio"}
                          name={`q${question.number}`}
                          value={option.value}
                          checked={questionState.selected.includes(option.value)}
                          onChange={(event) => setSelection(question, option.value, event.target.checked)}
                        />
                        <span>
                          {option.value}. {option.label}
                        </span>
                      </label>
                    ))}
                  </fieldset>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button size="sm" onClick={() => submitQuestion(question)} disabled={questionState.solved}>
                      Submit Answer
                    </Button>
                    <StatusMessage status={questionState.feedback} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kept visible on every section: submitting can send you back to an earlier one. */}
          <StatusMessage status={globalFeedback} className="mt-6" />

          <div className="mt-8 flex items-center justify-between gap-3">
            {sectionIndex > 0 ? (
              <Button variant="secondary" onClick={() => goToSection(sectionIndex - 1)}>
                Previous Section
              </Button>
            ) : (
              <span />
            )}

            {isLastSection ? (
              <Button onClick={submitQuiz}>Submit Quiz</Button>
            ) : (
              <Button onClick={() => goToSection(sectionIndex + 1)}>Next Section</Button>
            )}
          </div>
        </div>
      </Panel>

      {finished ? (
        <div ref={finishRef} className="scroll-mt-24">
          <Panel padding="lg" bordered className="text-center">
            <h3 className="text-title font-medium">{quizContent.finish.title}</h3>
            <p className="mt-2 text-ink-muted">{quizContent.finish.body}</p>
            <Image
              className="mx-auto mt-6 h-auto w-32"
              src={quizContent.finish.logo.src}
              alt={quizContent.finish.logo.alt}
              width={quizContent.finish.logo.width}
              height={quizContent.finish.logo.height}
            />
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
