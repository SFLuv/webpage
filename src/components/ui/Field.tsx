import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const controlClasses =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-ink " +
  "placeholder:text-ink-subtle/70 focus:border-brand focus:outline-3 focus:outline-brand-tint";

type FieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
};

/** Label + control + optional hint, at consistent spacing. */
export function Field({ label, htmlFor, required, hint, children }: FieldProps) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block font-medium text-ink" htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-sm text-ink-subtle">{hint}</p> : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClasses, className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClasses, "min-h-[150px] resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClasses, className)} {...props} />;
}

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & { children: ReactNode };

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <label className="mb-5 flex items-start gap-3 text-ink-muted">
      <input
        type="checkbox"
        className={cn("mt-1 size-4 shrink-0 accent-brand", className)}
        {...props}
      />
      <span>{children}</span>
    </label>
  );
}
