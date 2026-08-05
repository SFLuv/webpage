/**
 * Volunteer event types.
 *
 * `Api*` types mirror the wire format agreed in comms.md entry [2] (snake_case,
 * owned by the backend). Everything downstream of `mapEvent` uses the camelCase
 * domain types below, so a field rename upstream touches exactly one file.
 */

export type ApiSignupMode = "none" | "external" | "internal";
export type ApiEventStatus = "scheduled" | "live" | "ended" | "cancelled";
export type ApiSignupClosedReason = "full" | "ended" | "cancelled" | "not_open_yet" | null;

export type ApiCoverPhoto = {
  id?: string;
  url: string;
  width?: number;
  height?: number;
  /** Explicit display order; falls back to array order when absent. */
  position?: number;
};

export type ApiOrganizer = {
  type: "sfluv" | "affiliate";
  organization_id?: number | null;
  name: string;
  logo_url?: string | null;
};

export type ApiRecurrence = {
  frequency?: "daily" | "weekly" | "monthly";
  interval?: number;
  summary?: string;
};

/**
 * Locations are rows in the backend's shared `locations` table (comms.md [12]).
 * `address` is the pre-[12] flat field, still accepted so either shape maps.
 */
export type ApiLocation = {
  id?: number;
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  lat?: number;
  lng?: number;
  address?: string;
};

export type ApiVolunteerEvent = {
  id: string;
  slug?: string | null;
  series_id?: string | null;
  title: string;
  description?: string;
  cover_photos?: ApiCoverPhoto[];
  organizer: ApiOrganizer;
  start_at: string;
  end_at?: string | null;
  timezone?: string;
  recurrence?: ApiRecurrence | null;
  max_participants?: number | null;
  signup_count?: number | null;
  spots_remaining?: number | null;
  reward_amount_sfluv?: number | null;
  signup?: {
    mode?: ApiSignupMode;
    url?: string | null;
    open?: boolean;
    closed_reason?: ApiSignupClosedReason;
  };
  status?: ApiEventStatus;
  location?: ApiLocation | null;
};

export type ApiEventListResponse = {
  events?: ApiVolunteerEvent[];
  page?: number;
  count?: number;
  has_more?: boolean;
  total?: number;
  organizers?: ApiOrganizer[];
};

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export type CoverPhoto = {
  url: string;
  width: number;
  height: number;
};

export type Organizer = {
  type: "sfluv" | "affiliate";
  organizationId: number | null;
  name: string;
  logoUrl: string | null;
};

export type EventSignup =
  | { mode: "none" }
  | { mode: "external"; url: string }
  | { mode: "internal"; open: boolean; closedReason: ApiSignupClosedReason };

export type EventLocation = {
  id: number | null;
  name: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  lat: number | null;
  lng: number | null;
  /** Single display line composed from the parts, e.g. "150 Golden Gate Ave, San Francisco, CA 94102". */
  addressLine: string | null;
};

export type VolunteerEvent = {
  id: string;
  /** Display slug. Not unique — the id in the URL is authoritative. */
  slug: string;
  seriesId: string | null;
  title: string;
  description: string;
  coverPhotos: CoverPhoto[];
  organizer: Organizer;
  startAt: Date;
  endAt: Date | null;
  timeZone: string;
  recurrenceSummary: string | null;
  maxParticipants: number | null;
  spotsRemaining: number | null;
  rewardAmountSfluv: number | null;
  signup: EventSignup;
  status: ApiEventStatus;
  location: EventLocation | null;
};

export type EventListResult = {
  events: VolunteerEvent[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  organizers: Organizer[];
  /** True when the upstream API could not be reached. */
  degraded: boolean;
};

export type EventFilters = {
  page: number;
  search: string;
  organizer: string;
  when: "upcoming" | "past";
  openSpotsOnly: boolean;
};
