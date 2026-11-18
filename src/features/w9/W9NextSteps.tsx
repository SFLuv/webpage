import { Button } from "@/components/ui/Button";
import { w9Content } from "@/content/forms";
import { routes } from "@/lib/routes";

/**
 * Where someone landing on the old W-9 page goes now.
 *
 * This page used to post to the backend's /w9/submit, which was removed when
 * W-9s moved to the hosted form in the app, so every submission failed and
 * nobody heard about it. Old emails still link here, so instead of a form it
 * sends people to the app, and gives them a way to reach us that lands in the
 * notification hub under the W-9 topic.
 */
export function W9NextSteps() {
  return (
    <div className="mt-6 max-w-lg">
      <p className="text-ink-muted">{w9Content.help}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href={`${routes.getInTouch}?subject=w9`}>Ask us about your W-9</Button>
      </div>
    </div>
  );
}
