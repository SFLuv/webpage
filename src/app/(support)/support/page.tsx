import { permanentRedirect } from "next/navigation";
import { getInTouchLink } from "@/content/get-in-touch";

/**
 * /support is now the Get in touch form, preselected to technical support.
 *
 * It used to compose a mailto: — the same approach /contact used and for the
 * same reason it was dropped: nothing was recorded, whether a message was
 * answered depended on whose inbox it reached, and the sender had no reference
 * to quote. Two routes answering the same question two different ways is also
 * how the copy on them drifts apart.
 *
 * Redirected rather than re-rendered with the new form, so there is exactly
 * one page that collects a ticket and exactly one place its content lives.
 * Permanent, because the path is in printed material and in other people's
 * links, and a 404 here costs us the message somebody was trying to send.
 */
export default function SupportPage() {
  permanentRedirect(getInTouchLink("technical-support"));
}
