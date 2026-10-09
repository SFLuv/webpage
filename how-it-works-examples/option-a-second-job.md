# Option A — "One dollar. Two jobs."

The dollar moves **forward**, not round. It enters once, does the neighbourhood
job, and the same money arrives again as business revenue. Smallest copy change
of the three.

## Animation

Replaces `AmplificationLoop.tsx`. A coin travels left to right; at the midpoint
it splits, and the two impacts land as labelled blocks. No return path, nothing
repeating back to a start.

<svg viewBox="0 0 680 300" width="680" style="max-width:100%;height:auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
  <rect width="680" height="300" fill="#fef4ee" rx="12"/>
  <!-- track -->
  <path d="M70,150 H610" stroke="#fcd9d2" stroke-width="10" fill="none" stroke-linecap="round"/>
  <!-- the split -->
  <path d="M340,150 C420,150 440,100 540,100" stroke="#fcd9d2" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M340,150 C420,150 440,200 540,200" stroke="#fcd9d2" stroke-width="10" fill="none" stroke-linecap="round"/>
  <!-- arrowheads -->
  <path d="M-7,-9 L7,0 L-7,9" transform="translate(556 100)" fill="none" stroke="#eb6c6c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-7,-9 L7,0 L-7,9" transform="translate(556 200)" fill="none" stroke="#eb6c6c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- start -->
  <circle cx="70" cy="150" r="26" fill="#fff" stroke="#eb6c6c" stroke-width="3"/>
  <text x="70" y="158" text-anchor="middle" font-size="18" font-weight="700" fill="#8f2e2e">$</text>
  <text x="70" y="206" text-anchor="middle" font-size="14" font-weight="500" fill="#0b303b">One</text>
  <text x="70" y="224" text-anchor="middle" font-size="14" font-weight="500" fill="#0b303b">donation</text>
  <!-- impact blocks -->
  <g>
    <rect x="556" y="72" width="104" height="56" rx="10" fill="rgba(235,108,108,0.12)" stroke="#eb6c6c" stroke-width="2"/>
    <text x="608" y="96" text-anchor="middle" font-size="11" font-weight="700" fill="#8f2e2e" letter-spacing="1">FIRST IMPACT</text>
    <text x="608" y="114" text-anchor="middle" font-size="13" fill="#0b303b">A better block</text>
  </g>
  <g>
    <rect x="556" y="172" width="104" height="56" rx="10" fill="rgba(235,108,108,0.12)" stroke="#eb6c6c" stroke-width="2"/>
    <text x="608" y="196" text-anchor="middle" font-size="11" font-weight="700" fill="#8f2e2e" letter-spacing="1">SECOND IMPACT</text>
    <text x="608" y="214" text-anchor="middle" font-size="13" fill="#0b303b">Local revenue</text>
  </g>
  <!-- travelling coin, then two -->
  <g>
    <circle r="9" fill="#eb6c6c">
      <animateMotion dur="4s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"
        path="M70,150 H340"/>
      <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.48;0.5;1"/>
    </circle>
    <circle r="9" fill="#eb6c6c">
      <animateMotion dur="4s" repeatCount="indefinite" path="M340,150 C420,150 440,100 540,100"
        keyPoints="0;0;1" keyTimes="0;0.5;1" calcMode="linear"/>
      <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0;0;1;1" keyTimes="0;0.5;0.52;1"/>
    </circle>
    <circle r="9" fill="#eb6c6c">
      <animateMotion dur="4s" repeatCount="indefinite" path="M340,150 C420,150 440,200 540,200"
        keyPoints="0;0;1" keyTimes="0;0.5;1" calcMode="linear"/>
      <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0;0;1;1" keyTimes="0;0.5;0.52;1"/>
    </circle>
  </g>
  <text x="340" y="268" text-anchor="middle" font-size="17" font-weight="600" fill="#8f2e2e">The same dollar, counted twice</text>
</svg>

> The `<g>` wrapping the coins takes `className="motion-reduce:hidden"` in the
> component, exactly as the current ring does, so reduced-motion visitors get the
> static diagram.

## Copy changes

**Eyebrow**

- Before: `One contribution. Two impacts.`
- After: `One dollar. Two jobs.`

**Intro** — final clause only

- Before: `…so that a single donation first improves the neighborhood and then becomes revenue for the businesses in it.`
- After: `…so that a single donation does two jobs: it improves the neighborhood, and the same money then arrives again as revenue for the businesses in it.`

**Step 4 body** — this is the sentence doing the most damage

- Before: `Merchants can spend the SFLUV they receive at other participating businesses, which keeps the money circulating in the neighborhood, or convert it back into U.S. dollars.`
- After: `Merchants can spend the SFLUV they receive at other participating businesses, stretching the same dollar further still, or convert it back into U.S. dollars.`

**Amplification panel** — one sentence, to name the mechanism

- Before: `…so the same $100 is counted twice: once as a cleaner block, and once as revenue for a neighborhood business.`
- After: `…so the same $100 is counted twice: once as a cleaner block, and once as revenue for a neighborhood business. It is not the same dollar going round — it is one dollar doing a second job on its way out.`

**Accessible label** (in the component)

- Before: `A loop of four steps: …, and back to the start.`
- After: `One donation moves through four steps and produces two impacts: a better block, and revenue for a local business.`

## Why this one

It is the least invasive option and it fixes the actual problem — the picture.
Nothing about the four steps or the numbers changes. The risk is that it is the
least *quantitative* of the three: it says "twice" where the measured figure is
1.43x, so the panel's existing explanation of why it is below 2x still carries
that weight.
