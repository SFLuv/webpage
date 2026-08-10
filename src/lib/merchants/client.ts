import { API_BASE_URL, apiUnavailable, usingStubs, warnIfUnconfigured } from "@/lib/volunteer-events/config";
import { fixtureMerchants } from "./fixtures";
import { mapMerchant } from "./map";
import type { ApiMerchantListResponse, Merchant } from "./types";

/**
 * Seconds the merchant list stays cached.
 *
 * Longer than the events cache: a shop's address, logo, and opening week change
 * on the order of months, and the map's live element — whether it is open right
 * now — is computed in the browser from the hours, not refetched.
 */
const REVALIDATE_SECONDS = 900;

/** The API caps a page at 200; the merchant body is far smaller than that. */
const PAGE_SIZE = 200;

/**
 * Every approved merchant, ready to place on a map.
 *
 * Failure is non-fatal by design. The map is one section of a marketing page,
 * and an empty list renders as "map unavailable" rather than taking the page
 * down with it.
 */
export async function getMerchants(): Promise<Merchant[]> {
  if (usingStubs()) {
    return fixtureMerchants.map(mapMerchant).filter((merchant): merchant is Merchant => merchant !== null);
  }

  if (apiUnavailable()) {
    warnIfUnconfigured("merchants");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/locations?page=0&count=${PAGE_SIZE}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS }
    });

    if (!response.ok) {
      console.error(`[merchants] ${response.status} from /locations`);
      return [];
    }

    const body = (await response.json()) as ApiMerchantListResponse;
    return (body.locations ?? [])
      .map(mapMerchant)
      .filter((merchant): merchant is Merchant => merchant !== null);
  } catch (error) {
    console.error("[merchants] request failed", error);
    return [];
  }
}
