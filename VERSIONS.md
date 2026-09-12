# Portfolio versions

Track notable change batches here. The assistant labels work by version in chat and updates this file after each batch.

| Version | Date       | Commit   | Summary |
|---------|------------|----------|---------|
| v1.0    | 2026-05-26 | `76a4b25` | Header layout polish: nav order (Available → Display → Menu), single-column display panel, spacing, white display icon. |
| v1.1    | 2026-05-28 | `34eb0eb` | Usability: hash scroll from `/work` and `/resume`, display panel + mobile menu keyboard/focus, anchor `scroll-margin` for hero CTA and sections. |
| v1.2    | 2026-05-28 | `4daed9f` | Project rows: more space between title and tag row (`8px` → `20px`). |
| v1.3    | 2026-05-28 | `4daed9f` | Tag category filter on home work section and `/work` page. |
| v1.4    | 2026-05-28 | `4daed9f` | Filter limited to Branding, B2B / SaaS, Mobile, Product, UI/UX; card display tags unchanged. |
| v1.5    | 2026-07-04 | `de8da43` | Design/polish: removed stray "Identity" award badge on project 002; About "DK" portrait gets accent-glow gradient, editorial inset frame, and refined monogram; row-hover brightens tags, keyboard focus rings on project rows + nav/contact links, touch tap-affordance arrow; tighter mobile project-row spacing. Accessibility: "Skip to content" link (first focusable, jumps focus to main) + `<main id="main-content">` landmarks on home/work/resume. |

> **Versioning restarted at `v0.x` on 2026-07-05.** Earlier `v1.x` rows above are kept as history; new builds are numbered from `V0.02`.

| V0.02   | 2026-07-05 | `9171f29` | All 10 project case-study pages rebuilt from Figma with real, optimized imagery. Added gallery layouts to the case-study template — 3-column masonry, fixed 2-column, wrapping "flow" (phones + full-width desktops), full-width, per-project `narrative` blocks, and custom `workflowSteps`; image-zoom lightbox on every case-study image. Bespoke `RkaliCaseStudy` reconstructing the Rkali identity page (logos, construction, green Challenge/Goal panel, meta, packaging). Image optimization pipeline (~45 MB of raw exports → ~6 MB). |

| V0.03   | 2026-08-28 | `7fb2966` | Global header on case studies: MaraHeader (nav, Available chip, Display popover, mobile drawer) now renders on `/project/:slug` for both the shared template and the bespoke Rkali page, each with a `<main id="main-content">` landmark; the project sub-header no longer sticks and clears the fixed nav. Theme system: `--mp-*` appearance tokens moved from `.mp` to `:root` so case studies inherit light + high-contrast without a wrapper — the earlier `.mp` wrapper dragged in `overflow-x: hidden`, which made the page a nested scroll container (double scrollbar, background detaching on scroll). Case-study chrome (background, text, borders, shadows) now follows the tokens, with mock print collateral pinned as fixed artwork. Theme switches suppress transitions for one style recalc, since Chrome kept stale colours when a transitioned property was driven by a custom property. Removed the hardcoded near-black gradient on `.aa-assets` that ran cream to black in light mode. Image stage `--aa-media-bg` deliberately stays dark in both themes: 23 of the 64 case-study PNGs are transparent white line-art drawn for the dark theme. |

**Next version:** `v0.04`
