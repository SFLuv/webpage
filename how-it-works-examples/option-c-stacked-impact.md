# Option C — stacked impact

Leads with the multiplier. One dollar goes in; two impact bars stack up and a
counter runs from $1.00 to $1.43. The motion is **upward**, which is the thing a
ring cannot say.

## Animation

<svg viewBox="0 0 680 320" width="680" style="max-width:100%;height:auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <rect width="680" height="320" fill="#fef4ee" rx="12"/>
  <!-- baseline -->
  <path d="M90,250 H590" stroke="#fcd9d2" stroke-width="4" stroke-linecap="round"/>
  <!-- the dollar in -->
  <circle cx="150" cy="250" r="26" fill="#fff" stroke="#eb6c6c" stroke-width="3"/>
  <text x="150" y="258" text-anchor="middle" font-size="18" font-weight="700" fill="#8f2e2e">$1</text>
  <text x="150" y="292" text-anchor="middle" font-size="13" fill="#0b303b">You give</text>
  <!-- bar 1: neighbourhood -->
  <g>
    <rect x="300" y="250" width="110" height="0" rx="8" fill="#eb6c6c">
      <animate attributeName="height" dur="5s" repeatCount="indefinite" values="0;100;100;0" keyTimes="0;0.3;0.9;1"/>
      <animate attributeName="y" dur="5s" repeatCount="indefinite" values="250;150;150;250" keyTimes="0;0.3;0.9;1"/>
    </rect>
    <text x="355" y="286" text-anchor="middle" font-size="12" font-weight="700" fill="#8f2e2e" letter-spacing="1">A BETTER BLOCK</text>
  </g>
  <!-- bar 2: local revenue, stacking on top -->
  <g>
    <rect x="300" y="150" width="110" height="0" rx="8" fill="#8f2e2e">
      <animate attributeName="height" dur="5s" repeatCount="indefinite" values="0;0;43;43;0" keyTimes="0;0.35;0.62;0.9;1"/>
      <animate attributeName="y" dur="5s" repeatCount="indefinite" values="150;150;107;107;150" keyTimes="0;0.35;0.62;0.9;1"/>
    </rect>
  </g>
  <!-- running total -->
  <g>
    <text x="470" y="150" font-size="34" font-weight="700" fill="#8f2e2e">
      $1.00
      <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="1;1;0;0;1" keyTimes="0;0.35;0.4;0.9;1"/>
    </text>
    <text x="470" y="150" font-size="34" font-weight="700" fill="#8f2e2e">
      $1.43
      <animate attributeName="opacity" dur="5s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.4;0.62;0.9;1"/>
    </text>
    <text x="470" y="176" font-size="13" fill="#0b303b">of neighborhood impact</text>
    <text x="470" y="206" font-size="13" fill="#0b303b" opacity="0.7">61% of the SFLUV we hand out</text>
    <text x="470" y="224" font-size="13" fill="#0b303b" opacity="0.7">comes back as local business revenue</text>
  </g>
  <!-- rising arrow -->
  <path d="M250,240 L250,170" stroke="#eb6c6c" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 6"/>
  <path d="M-7,9 L0,-5 L7,9" transform="translate(250 166)" fill="none" stroke="#eb6c6c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

> Same reduced-motion treatment as the others: render the bars at full height and
> show only the `$1.43` label when `motion-reduce` applies.

## Copy changes

**Eyebrow**

- Before: `One contribution. Two impacts.`
- After: `Give a dollar. Do $1.43 of good.`

**Step 4 body**

- Before: `…which keeps the money circulating in the neighborhood, or convert it back into U.S. dollars.`
- After: `…which puts the same dollar to work one more time, or convert it back into U.S. dollars.`

**Amplification panel heading**

- Before: `The amplification effect`
- After: `Why a dollar goes further here`

**Amplification panel, first paragraph** — final clause

- Before: `…so the same $100 is counted twice: once as a cleaner block, and once as revenue for a neighborhood business.`
- After: `…so the same $100 lands twice: once as a cleaner block, and again as revenue for a neighborhood business. Nothing circles back to us — it accumulates in the neighborhood.`

**Numbers block** — relabel the first stat so it reads as a result

- Before: `1.43x` / `amplification factor`
- After: `1.43x` / `impact per program dollar`

## Why this one

It is the most direct and the most likely to be remembered — "give a dollar, do
$1.43 of good" is the whole proposition in one line, and the rising bars make the
point before anyone reads a word.

Two cautions. First, that eyebrow is a marketing claim, so it needs to stay true
as the factor moves; it will date faster than the other two. Second, it leans
hardest on 1.43x being the right number to headline, which is a judgement call
about whether you want the page to promise a multiple up front or explain the
mechanism first.
