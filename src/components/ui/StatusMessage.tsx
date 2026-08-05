import { cn } from "@/lib/cn";

export type StatusTone = "success" | "error" | "neutral";

export type Status = { tone: StatusTone; message: string } | null;

const tones: Record<StatusTone, string> = {
  success: "text-success",
  error: "text-danger",
  neutral: "text-ink-muted"
};

type StatusMessageProps = {
  status: Status;
  className?: string;
};

/** Polite live region for inline form feedback. Renders nothing when idle. */
export function StatusMessage({ status, className }: StatusMessageProps) {
  return (
    <p role="status" aria-live="polite" className={cn("text-sm font-medium", status && tones[status.tone], className)}>
      {status?.message ?? ""}
    </p>
  );
}
