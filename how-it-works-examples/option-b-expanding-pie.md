# Option B — the expanding pie

Mirrors the annual report. The circle fills to 100% as program spending, then
**keeps going past full** to 143%, with the overshoot labelled as local business
revenue. A circle that outgrows itself reads as amplification; a circle with a
dot going round reads as circularity.

> **Caveat:** the report PDF is image-based, so I could not read its chart to
> copy it. This is drawn from the figures and from the usual way a >1x multiple
> is shown. Send a screenshot and I will match the real artwork.

## Animation

As built in `src/features/how-it-works/AmplificationRing.tsx`. The program
dollar fills the inner ring while the figure reads 1.00x; the dotted goal ring
fades in; then what the dollar adds draws on along it, to 43% of a second
dollar, as the figure counts up to 1.43x. This preview loops; the page plays it
once each time it scrolls into view.

The amounts are the report's (page 11, expenditures summary): $59,560.81 of
program expense, and $24,905.78 of it paid out in SFLuv ($20,279.25 TL
program, $1,956.00 advertising and marketing, $2,670.53 software development).
Program expense plus the SFLuv, over program expense, is the 1.43x.

<svg viewBox="0 0 680 420" width="680" style="max-width:100%;height:auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <defs>
    <linearGradient id="b-dollar" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f2a3a3"/><stop offset="1" stop-color="#eb6c6c"/>
    </linearGradient>
  </defs>
  <rect width="680" height="420" fill="#ffffff" rx="20"/>
  <text x="32" y="44" font-size="12" font-weight="700" letter-spacing="2" fill="#eb6c6c">AMPLIFICATION</text>
  <g transform="rotate(-90 200 200)">
    <circle cx="200" cy="200" r="108" fill="none" stroke="#0b303b" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round" pathLength="100" stroke-dasharray="0.01 1.24" opacity="0">
      <animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.1375;0.2250;0.9000;1"/>
    </circle>
    <circle cx="200" cy="200" r="82" fill="none" stroke="#fcd9d2" stroke-opacity="0.6" stroke-width="18"/>
    <circle cx="200" cy="200" r="82" fill="none" stroke="url(#b-dollar)" stroke-width="18" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100">
      <animate attributeName="stroke-dashoffset" dur="8.0s" repeatCount="indefinite" values="100;0;0;100" keyTimes="0;0.2250;0.9000;1" calcMode="spline" keySplines="0.65 0 0.35 1;0 0 1 1;0.4 0 0.2 1"/>
    </circle>
    <circle cx="200" cy="200" r="82" fill="none" stroke="url(#b-dollar)" stroke-width="18" opacity="0"><animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes="0;0.2250;0.9000"/></circle>
    <circle cx="200" cy="200" r="108" fill="none" stroke="#8f2e2e" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100 100" stroke-dashoffset="100" opacity="0">
      <animate attributeName="stroke-dashoffset" dur="8.0s" repeatCount="indefinite" values="100;100;57;57;100" keyTimes="0;0.2250;0.4125;0.9000;1" calcMode="spline" keySplines="0 0 1 1;0.2 0.7 0.2 1;0 0 1 1;0.4 0 0.2 1"/>
      <animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes="0;0.2250;0.9625"/>
    </circle>
  </g>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="central" font-size="44" font-weight="700" fill="#8f2e2e">1.00x<animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" calcMode="discrete" values="1;0;1" keyTimes="0;0.2250;0.9000"/></text>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="central" font-size="44" font-weight="700" fill="#8f2e2e" opacity="0">1.11x<animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes="0;0.2250;0.2719"/></text>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="central" font-size="44" font-weight="700" fill="#8f2e2e" opacity="0">1.22x<animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes="0;0.2719;0.3187"/></text>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="central" font-size="44" font-weight="700" fill="#8f2e2e" opacity="0">1.33x<animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes="0;0.3187;0.3656"/></text>
  <text x="200" y="200" text-anchor="middle" dominant-baseline="central" font-size="44" font-weight="700" fill="#8f2e2e" opacity="0">1.43x<animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" calcMode="discrete" values="0;1;0" keyTimes="0;0.3656;0.9000"/></text>
  <g opacity="0">
    <animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.0500;0.1375;0.9000;1"/>
    <circle cx="380" cy="168" r="6" fill="#eb6c6c"/>
    <text x="396" y="174" font-size="17" font-weight="600" fill="#0b303b">The program dollar</text>
    <text x="396" y="198" font-size="14" fill="#4a6069">$59,561 in program expense</text>
  </g>
  <g opacity="0">
    <animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.2375;0.3250;0.9000;1"/>
    <circle cx="380" cy="234" r="6" fill="#8f2e2e"/>
    <text x="396" y="240" font-size="17" font-weight="600" fill="#0b303b">What it adds on the way out</text>
    <text x="396" y="264" font-size="14" fill="#4a6069">$24,906 paid out in SFLUV</text>
  </g>
  <line x1="32" y1="340" x2="648" y2="340" stroke="#d9dfe1"/>
  <text x="340" y="384" text-anchor="middle" font-size="20" font-weight="700" fill="#8f2e2e" opacity="0">Each dollar does more than a dollar's work.<animate attributeName="opacity" dur="8.0s" repeatCount="indefinite" values="0;0;1;1;0" keyTimes="0;0.3875;0.4750;0.9000;1"/></text>
</svg>

## Copy changes

**Eyebrow**

- Before: `One contribution. Two impacts.`
- After: `Each dollar does more than a dollar's work.`

**Intro** — final clause only

- Before: `…so that a single donation first improves the neighborhood and then becomes revenue for the businesses in it.`
- After: `…so that a single donation improves the neighborhood and then adds to it again as revenue for the businesses in it.`

**Step 4 body**

- Before: `…which keeps the money circulating in the neighborhood, or convert it back into U.S. dollars.`
- After: `…which adds to the local total once more, or convert it back into U.S. dollars.`

**Amplification panel heading**

- Before: `The amplification effect`
- After: `How far a dollar goes`

**Amplification panel, second paragraph** — tighten to lead with the number

- Before: `We measure this directly. In our first year, counting the SFLUV spent at local merchants alongside our regular program spending, our amplification factor was 1.43x, which means each dollar of program spending produced about $1.43 of combined neighborhood and local business impact. It is below 2x because not all of our program spending is distributed as SFLUV yet.`
- After: `We measure this directly. In our first year each dollar of program spending produced about **$1.43** of combined neighborhood and local business impact — an amplification factor of 1.43x. It is below our target of 2x because not all of our program spending is distributed as SFLUV yet, which is the part we are still growing.`

## Why this one

It is the only option that puts the measured figure in the picture, and it keeps
the page consistent with the report a reader is being sent to at the bottom of
it. It is also the strongest answer to "why not 2x" — the overshoot visibly has
room left in it.

The cost is that it is the most abstract of the three: a reader has to understand
the chart before they understand the idea. The four step cards underneath carry
that weight.
