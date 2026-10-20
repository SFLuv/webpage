import { permanentRedirect } from "next/navigation";
import { routes } from "@/lib/routes";

/**
 * /contact is now /get-in-touch.
 *
 * Kept as a redirect rather than deleted: the old path is in printed material,
 * in other people's links and in search results, and a 404 there costs us the
 * message somebody was trying to send. Permanent, so search engines move on.
 */
export default function ContactPage() {
  permanentRedirect(routes.getInTouch);
}
