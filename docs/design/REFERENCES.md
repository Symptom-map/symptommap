# Visual references

Galleries Ana chose for the visual polish (20 Oct 2026). Goal: SymptomMap should feel fluid and natural, not rigid or "AI-generated". The approved design system (colours, typefaces, brand) and the approved flow stay; the polish changes how things move, breathe and respond.

## For the app
| Gallery | Use it for |
|---|---|
| https://refero.design | Real product UI (forms, dialogs, sidebars) |
| https://mobbin.com | Real mobile and web app screens |
| https://appmotion.design | Animation and motion |
| https://component.gallery | Design-system components (buttons, fields, modals) |

## For the public site (when it opens)
| Gallery | Use it for |
|---|---|
| https://curated.design | Web design |
| https://landing.love · https://land-book.com · https://lapa.ninja | Landing pages |
| https://saaspo.com | SaaS sites |
| https://navbar.gallery | Navigation bars |
| https://cta.gallery | Call-to-action sections |
| https://footer.design | Footers |
| https://rebrand.gallery | Rebrands and brands |
| https://httpster.net | Clean, typographic design |
| https://recent.design | Recent inspiration and motion |

## How to use them
An agent cannot browse these galleries visually. Ana picks 3–5 concrete examples (link or screenshot plus one sentence on what she likes); the agent turns them into a before/after proposal on real SymptomMap screens, and applies it only after Ana approves.

## Recommended tool
`nextlevelbuilder/ui-ux-pro-max-skill` (MIT), recommended by a developer Ana knows. Use its **motion catalogue, UX rules and pre-delivery checklist**. Do **not** use its generated design system for SymptomMap: for "mental health app" it proposes lavender neumorphism, Lora/Raleway and testimonials, which is the generic look we want to avoid and would replace the approved identity.

## Examples Ana picked (20 Oct 2026)
References, not designs to copy. The first ones are the closest to what she wants. **Keep our current landing header/menu**; she likes it.

| Site | What Ana likes | What she does not want |
|---|---|---|
| https://www.overpass.com | Overall look and feel: modern, fresh, pleasant; lots of air; the typography; the hero image placed inside a rounded "button-like" shape; the custom icons in the sales section (we could design our own icons) | Its top bar; its footer (too much) |
| https://land-book.com/websites/99619-ecoriz (Ecoriz) | Clean, fluid, almost elegant layout; the top area | — (our header stays) |
| https://www.augusthealth.com | Header and how its buttons appear; the **Platform** dropdown; the icons; modals and their soft shadows — "doesn't look AI" | Its footer (excessive) |
| https://www.joinviolet.com | Look and feel; colours close to ours | — |
| https://www.footer.design/sites/leedlime | This footer, **without a photo or image**, with a touch of brand colour | — |

Common thread: generous whitespace, rounded/pill buttons, soft shadows, custom line icons, smooth dropdowns and modals, a clean fluid layout. Most examples are landing pages: they shape the public site first, and in the app they guide spacing, buttons, shadows, icons and motion.

Note: an agent cannot load these sites visually from this environment (only their text), so screenshots of the specific parts help a lot.

## Decisions on the polish proposal (20 Oct 2026)
| Proposal | Ana's decision | Where |
|---|---|---|
| 1. Pill buttons with a soft lift and press | **Yes** (changes the design-system rule "rounder, but not a pill") | `v2/src/pulido.css` |
| 2. Window: rounder corners, wide soft shadow, blurred backdrop, gentle entrance; floating suggestions | **Yes** | `v2/src/pulido.css` |
| 3. Floating sidebar, dotted map background | **No** | — |
| 3. Pill diagnosis chips in the sidebar | Not yet — "it could work but I don't see it yet" | — |
| 4. Icons as overlapping spheres (like the logo) | Likes the direction; **needs another round** | Claude Design, later |

The map is now centred in the canvas, as in the approved prototype (that was a fidelity fix, not part of the polish vote).
