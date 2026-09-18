# Design Principles

These are the rules. Not preferences. Not suggestions. Each is grounded in UX research,
cognitive science, or proven practice from teams that ship premium software.

---

## Simplicity Is Architecture

Every element must justify its existence. If it doesn't serve the user's immediate goal, it's
clutter. The best interface is the one the user never notices.

**The Subtraction Method**: Remove elements until something breaks — then add back only the last
thing. Stripe, Linear, and Apple all follow this discipline. If you can convey the same meaning
with fewer elements, the current design has waste.

**Hick's Law**: Decision time increases logarithmically with the number of choices. Every
additional button, link, or option makes the interface slower to use. Reduce options to reduce
cognitive load.

**The Doherty Threshold**: System response under 400ms maintains user engagement. Above 400ms,
attention fragments. Every interaction — click feedback, transition, state change — must feel
instantaneous or deliberately animated. Nothing in between.

---

## Hierarchy Drives Everything

Every screen has one primary action. Make it unmissable. Secondary actions support — they never
compete. If everything is bold, nothing is bold.

**The Von Restorff Effect**: When multiple similar objects are present, the one that differs most
is best remembered. This is the science behind effective CTA design — the primary action must
break the pattern of everything around it through size, color, contrast, or isolation.

**Three-Tier Text Contrast**:
- Primary text: highest contrast (~21:1 on white, near-black)
- Secondary text: medium contrast (~7:1, grays like #6B7280)
- Tertiary/disabled text: lower contrast (4.5:1 minimum per WCAG AA)

If your interface has more than three text contrast levels, the hierarchy is fighting itself.

**Visual Weight = Functional Importance**: A decorative element should never outweigh a
functional one. If the user's eye goes to an illustration before seeing the CTA, the hierarchy
is broken regardless of how beautiful the illustration is.

**The Squint Test**: Blur the screen at 5–10px mentally. If groupings, hierarchy, and the
primary CTA aren't clear when blurred, the hierarchy needs work. This is how real users
perceive your interface at a glance.

---

## Consistency Is Non-Negotiable

The same component must look and behave identically everywhere. If you find inconsistency,
flag it — do not invent a third variation. All values reference design system tokens. No
hardcoded colors, spacing, or sizes. Ever.

**Jakob's Law**: Users spend most of their time on other apps. They expect your interface to
work like the ones they already know. Consistency within your app is mandatory; consistency
with platform conventions is strongly preferred.

**Design Token Discipline**: The three-tier token architecture is the enforcement mechanism:
- Primitive tokens store raw values (`color.blue.500: #2563EB`)
- Semantic tokens assign purpose (`color.action.primary → color.blue.500`)
- Component tokens handle specifics (`button.primary.bg → color.action.primary`)

If a value isn't in the token system, it doesn't belong in the codebase.

**State Coverage**: Every interactive component needs: default, hover, focus, active, disabled,
loading, and error states. Missing states break the illusion of a polished product. If a button
doesn't respond to hover, it feels dead. If focus states are invisible, keyboard users are locked out.

---

## Alignment Is Precision

Every element sits on the 8px grid. No exceptions. If something is off by 1–2 pixels, it's
wrong. Alignment separates premium from good-enough. The eye detects misalignment before the
brain can name it.

**The 8-Point Grid**: All dimensions, padding, and margins use multiples of 8 (8, 16, 24, 32,
40, 48, 56, 64px). Use 4px as a half-step only for fine adjustments in dense interfaces.
Both Apple and Google endorse this as the industry standard.

**Optical vs Mathematical Alignment**: Start with pixel-perfect grid alignment, then fine-tune
optically. Play-button triangles must shift right because visual mass sits left. Circles next
to same-height squares appear smaller and must be enlarged ~2–3%. Text next to icons often needs
1–2px vertical offset to appear centered.

**The Concentric Radius Rule**: Outer border-radius must equal inner border-radius plus the
padding between them. Inner 12px + padding 8px = outer 20px. Violating this creates a subtle
wrongness that users feel but can't name.

---

## Whitespace Is a Feature

Space is not empty — it is structure. Crowded interfaces feel cheap. Breathing room feels
premium. When in doubt, add more space, not more elements.

**Gestalt Law of Proximity**: Elements that are close together are perceived as belonging together.
Internal padding of a component should never exceed the spacing between components. If card padding
is 24px, card gap must be ≥ 24px — otherwise cards blur into a single mass.

**The Refactoring UI Principle**: Start with too much whitespace, then remove. It's easier to
identify when you've removed too much than when you haven't added enough. Most interfaces are
too dense, not too sparse.

**Spacing Creates Hierarchy**: More space around an element gives it more importance. A heading
with generous top margin (40–64px) and tight bottom margin (8–16px) creates a clear visual
connection to the content it labels, while separating it from the section above.

---

## Responsive Is the Real Design

Mobile is the starting point. Tablet and desktop are enhancements. Design for thumbs first,
then cursors. Every screen must feel intentional at every viewport — not just resized.

**Touch Targets**: Minimum 44×44px (Apple HIG) / 48×48dp (Material Design). This is not
negotiable. If a tap target is smaller, users with normal-sized fingers will miss it regularly.

**Fluid Adaptation**: Use fluid typography (clamp), flexible grids, and container queries rather
than hard breakpoints alone. The design should feel native at 320px and 2560px — not just at the
three breakpoints you tested.

**Content Priority**: Mobile forces you to choose what matters. If it's not important enough for
the mobile layout, question whether it belongs in the desktop layout. Mobile isn't a degraded
experience — it's the truth about what your interface actually needs.

---

## Shadows Create Depth, Not Decoration

Shadows are the primary tool for communicating spatial relationships. They must be systematic,
not decorative.

**Layered Shadows**: Premium depth requires at minimum two shadow layers — a sharp, directional
key shadow paired with a soft, diffused ambient shadow. Single box-shadows look flat and
artificial.

**Elevation Ramp**: Define 5–6 levels and use them consistently:
- Level 0: Flat (background surfaces)
- Level 1: Slight lift (cards, content areas)
- Level 2: Raised (hover states, dropdowns)
- Level 3: Floating (popovers, selects)
- Level 4: Overlay (modals, dialogs)
- Level 5: Highest (toasts, notifications with scrim)

**Replace Borders with Shadows**: Borders make designs feel busy and add visual weight at every
edge. Shadows, spacing, and background color differences can create separation more elegantly.
Audit every border: can it be replaced?

**Dark Mode Shadows**: Shadows need ~28% opacity in dark mode (vs 14–24% in light mode) because
they're harder to perceive. Some teams use subtle light glows or border overlays instead.

---

## Motion Is Physics, Not Decoration

Transitions should feel like natural movement. The app should feel like it respects the user's
time while maintaining a sense of responsiveness.

**Duration Rules**:
- Button/tap feedback: 100–200ms
- Standard transitions (expand, collapse, fade): 200–300ms
- Page/route transitions: 300–500ms
- Complex choreography: 500–700ms maximum
- Never exceed 700ms for any single animation

**Easing**:
- Elements entering: ease-out (`cubic-bezier(0.0, 0, 0.2, 1)`)
- Elements leaving: ease-in (`cubic-bezier(0.4, 0, 1, 1)`)
- Standard movement: standard easing (`cubic-bezier(0.4, 0, 0.2, 1)`)
- Spring physics (via Motion/Framer): preferred for interactive elements

**Choreography**: Stagger entering elements with ~100ms delays. Exit animations should be more
subtle than enter animations (smaller translateY, faster duration). Elements should leave together
but enter in sequence.

**Accessibility**: Always implement `prefers-reduced-motion`. Reduced motion should still convey
state changes — use opacity fades (instant or very fast) instead of positional movement.

---

## Typography Is Structure, Not Decoration

Typography creates the information architecture. It is not an afterthought applied to content.

**Modular Type Scale**: Use mathematical ratios for harmony:
- 1.250 (Major Third): for dense UIs, dashboards, data-heavy apps
- 1.333 (Perfect Fourth): for balanced content apps, most SaaS products
- From 16px base with Major Third: 13, 16, 20, 25, 32, 40px

**The 4-Size Rule**: Even interaction-heavy pages need at most ~4 font sizes. Use weight, color,
and style — not just size — to create sub-levels. More than 3 font families in one product is
always wrong.

**Line Height**: Body text 1.4–1.6 (1.5 is the sweet spot). Headings 1.1–1.2 at large sizes.
Line-height values should be divisible by 4 to align to the 8px grid.

**Line Length**: 50–75 characters for body text. Longer lines cause re-reading errors; shorter
lines create too many line breaks. This is non-negotiable for readability.

**Letter Spacing**: Tighten display text by -0.02em. Leave body at default. Widen all-caps by
+0.05 to +0.1em.

---

## Color Is Communication, Not Decoration

Color must carry meaning. Every color choice must answer: what is this telling the user?

**The 60-30-10 Rule**: 60% dominant neutral (backgrounds, surfaces), 30% secondary (cards,
sections), 10% accent (CTAs, alerts, highlights). Deviating from this ratio makes interfaces
feel noisy or monotone.

**Desaturation Creates Sophistication**: Full saturation reads as cheap or childish. Pull back
saturation 10–20% on all colors except where maximum attention is needed (error states, primary
CTAs). Stripe and Linear both use slightly muted palettes.

**Semantic Color Tokens**: Colors must be named by purpose, not appearance: `color.success`,
`color.warning`, `color.error`, `color.info`, `color.action.primary`. Never `color.green` in
component code.

**Dark Mode**: Never pure black (#000). Use #121212 as base surface. Body text is light gray
(#E0E0E0), not pure white. Desaturate accent colors. Surfaces above the base are progressively
lighter (not darker). Semantic tokens handle the swap automatically.

**Contrast Compliance**: WCAG 2.1 AA minimum: 4.5:1 for body text, 3:1 for large text
(≥24px or ≥18.66px bold). Report exact ratios for every text/background combination.

---

## No Cosmetic Fixes Without Structural Thinking

Never suggest a change without explaining what it accomplishes in the hierarchy or user
experience. Every change must have a measurable outcome or clear design rationale.

**BAD**: "Make this blue"
**GOOD**: "Change CTA color to `color.action.primary` (#2563EB) to increase contrast ratio from 3.8:1 to 8.6:1 against the surface, meeting WCAG AAA and creating clear differentiation from secondary actions"

**BAD**: "Add more space"
**GOOD**: "Increase `section-gap` from 24px to 48px (`spacing.2xl`) to separate content groups per Gestalt proximity — currently adjacent cards read as one visual block"

**BAD**: "The shadows look flat"
**GOOD**: "Replace single box-shadow with layered elevation token `shadow.md` (key: 0 1px 3px rgba(0,0,0,0.12), ambient: 0 4px 6px rgba(0,0,0,0.04)) to create depth differentiation between cards and the background surface"

---

## The Premium Standard

Premium apps feel calm, confident, and quiet. The Aesthetic-Usability Effect (Norman, 2004)
demonstrates that users perceive beautiful design as more usable — first impressions form
in approximately 50 milliseconds. This is not vanity. It is function.

The goal is not "good enough." The goal is that every screen feels inevitable — like no other
arrangement of elements was ever possible. When users say an app "just works," they're describing
this feeling: visual hierarchy, spacing, typography, color, and motion all operating in quiet
harmony, requiring zero conscious effort to navigate.
