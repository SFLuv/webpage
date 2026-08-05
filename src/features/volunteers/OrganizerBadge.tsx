import { cn } from "@/lib/cn";
import type { Organizer } from "@/lib/volunteer-events/types";
import { RemoteImage } from "./RemoteImage";

const sizes = {
  sm: { box: "size-7", text: "text-sm" },
  md: { box: "size-10", text: "text-base" }
} as const;

type OrganizerBadgeProps = {
  organizer: Organizer;
  size?: keyof typeof sizes;
  className?: string;
};

/** Organizer attribution — logo plus name. Falls back to an initial monogram. */
export function OrganizerBadge({ organizer, size = "sm", className }: OrganizerBadgeProps) {
  const scale = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {organizer.logoUrl ? (
        <RemoteImage
          src={organizer.logoUrl}
          alt=""
          width={80}
          height={80}
          className={cn(scale.box, "shrink-0 rounded-full object-contain")}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            scale.box,
            "flex shrink-0 items-center justify-center rounded-full bg-brand-tint font-medium text-brand-deep"
          )}
        >
          {organizer.name.charAt(0)}
        </span>
      )}

      <span className={cn("min-w-0 truncate font-medium text-ink", scale.text)}>
        {organizer.name}
      </span>
    </div>
  );
}
