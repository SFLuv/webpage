type ClassValue = string | number | null | undefined | false | ClassValue[];

/** Joins conditional class names. Small enough not to warrant a dependency. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  for (const value of values) {
    if (!value && value !== 0) continue;
    if (Array.isArray(value)) {
      const nested = cn(...value);
      if (nested) out.push(nested);
      continue;
    }
    out.push(String(value));
  }

  return out.join(" ");
}
