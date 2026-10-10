import type { ReactNode } from "react";
import { Prose } from "@/components/ui/Prose";

/** Where the options sit in a form's text. */
export const CHOICES_TOKEN = "{{choices}}";

/**
 * Renders a form's plain-text body.
 *
 * The convention is deliberately tiny, because the people who write it are not
 * developers: `## ` starts a heading, a blank line starts a new paragraph, lines
 * beginning `- ` are bullets, and `{{choices}}` marks where the options go.
 * Everything is rendered as text, never as HTML.
 */
export function FormBody({ body, choices }: { body: string; choices: ReactNode }) {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <Prose>
      {blocks.map((block, index) => {
        if (block === CHOICES_TOKEN) return <div key={index}>{choices}</div>;
        if (block.startsWith("## ")) return <h2 key={index}>{block.slice(3).trim()}</h2>;

        const lines = block.split("\n");
        if (lines.every((line) => line.trimStart().startsWith("- "))) {
          return (
            <ul key={index}>
              {lines.map((line, i) => (
                <li key={i}>{line.trimStart().slice(2)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </Prose>
  );
}
