export type Coordinates = { lat: number; lng: number };

/**
 * Great-circle distance in kilometres.
 *
 * Only ever used to order a list, so the exact figure does not matter — but
 * haversine is a couple of lines and avoids the flat-earth error that makes
 * equirectangular comparisons wrong at the edges of a wide list.
 */
export function distanceKm(from: Coordinates, to: Coordinates): number {
  const EARTH_RADIUS_KM = 6371;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(deltaLng / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
