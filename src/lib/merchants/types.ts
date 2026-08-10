/**
 * Merchant map types.
 *
 * `Api*` types mirror the backend's wire format (snake_case, owned by the
 * backend). Everything downstream of `mapMerchant` uses the camelCase domain
 * types, so a field rename upstream touches exactly one file.
 */

export type ApiHoursInterval = {
  open_minute: number;
  close_minute: number;
};

export type ApiDayHours = {
  weekday: number;
  is_closed: boolean;
  intervals?: ApiHoursInterval[] | null;
};

export type ApiMerchant = {
  id: number;
  google_id?: string | null;
  name: string;
  description?: string | null;
  type?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  lat?: number | null;
  lng?: number | null;
  phone?: string | null;
  website?: string | null;
  icon_url?: string | null;
  maps_page?: string | null;
  opening_hours?: string[] | null;
  hours?: ApiDayHours[] | null;
};

export type ApiMerchantListResponse = {
  locations?: ApiMerchant[] | null;
};

export type HoursInterval = {
  openMinute: number;
  closeMinute: number;
};

/**
 * One day's opening times. `isClosed` and an empty `intervals` are distinct:
 * a shop shut on Sunday is not the same as one whose Sunday we never learned.
 */
export type DayHours = {
  weekday: number;
  isClosed: boolean;
  intervals: HoursInterval[];
};

export type Merchant = {
  id: number;
  googleId: string;
  name: string;
  description: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  phone: string;
  website: string;
  /** Uploaded map-pin mark. Empty when the merchant has not set one. */
  iconUrl: string;
  mapsPage: string;
  /** Human-readable week, one line per day. */
  openingHours: string[];
  hours: DayHours[];
};
