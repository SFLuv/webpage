# How It Works — amplification framing options

Three options for re-pointing the *How SFLuv Works* page from **circularity** to
**amplification**. Each swaps the animation and makes small copy edits. None
changes the page structure: the four numbered step cards, the brand panel and the
first-year numbers block all stay exactly where they are.

## Why the current version reads as circular

Two things do it, and they are the two things these options change.

1. **The animation is a closed ring with a dot going round it forever.**
   `AmplificationLoop.tsx` draws a circle, four arrows all pointing clockwise,
   and `animateMotion` on an infinite loop. Its own accessible label ends
   *"…and back to the start."* Whatever the copy says, the picture says the money
   goes round.
2. **Step 4 says so out loud** — *"which keeps the money circulating in the
   neighborhood"* — and it is the last thing a reader sees before the
   amplification panel.

## What the numbers actually support

Measured from the SFLUV ledger for FY 2025–2026 (1 Jul 2025 – 1 Jul 2026):

| | SFLUV |
|---|---|
| Distributed to volunteers and Improvers | 27,227 |
| Spent at local merchants | 16,560 |
| Cashed out by merchants to dollars | 10,764 |

So about **61%** of everything handed out came back as revenue for a local
business, and merchants converted most of the rest to dollars. That is a dollar
doing a **second job on its way out** — not a dollar going round. It is also why
the published factor is **1.43x** rather than 2x, and the report is already
explicit that the gap is headroom: not all program spending is distributed as
SFLUV yet.

The honest frame is therefore *amplification*, and the honest shape is a
**quantity getting bigger**, not a ring.

## The options

| | Animation | Framing | Copy churn |
|---|---|---|---|
| [Option A](./option-a-second-job.md) | A dollar travels left to right and splits into two impacts | "One dollar. Two jobs." | Smallest — 1 step body, eyebrow, 2 sentences |
| [Option B](./option-b-expanding-pie.md) | An arc fills to 100% then keeps going to 143% | Mirrors the annual report's expanding pie | Small — eyebrow, intro clause, 1 step body, panel |
| [Option C](./option-c-stacked-impact.md) | Two impact bars stack while a counter runs $1.00 → $1.43 | Leads with the multiplier | Small — eyebrow, 1 step body, panel heading |

Each file contains the animation inline (open the `.md` in anything that renders
HTML, or copy the `<svg>` into a browser) and the exact copy changes as
before/after pairs.

## One thing to confirm

I could not read the annual report's expanding pie directly — the PDF is
image-based, so there is no extractable text, and no `pdftotext`/`poppler` on
this machine. **Option B is built from the figures and from how a >1x
amplification is conventionally drawn, not from the report's actual artwork.**
If you want it to match the report exactly, send me a screenshot of that chart
and I will redraw it to fit.
