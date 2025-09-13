# Design Systems Meta-Playbook

An amalgamated, vendor-agnostic playbook synthesizing Apple Human Interface Guidelines (HIG), Material Design 3 (M3), IBM Carbon, and Tailwind CSS. Use this to choose, combine, and implement a design system consistently across platforms and stacks.

## Purpose
- Establish a common language and standards across teams and platforms
- Improve UX quality, accessibility, performance, and delivery speed
- Reduce decision churn by providing principles, tokens, patterns, and checklists

## Core Principles (cross-system)
- Clarity and Deference (Apple): content-first, avoid gratuitous ornamentation; use depth sparingly
- Bold, Meaningful Motion (Material): motion communicates hierarchy, state, and causality; prefer purposeful transitions
- Consistency and Modularity (Carbon): composable components, tokenized theming, predictable behavior
- Utility-First Composition (Tailwind): encode system constraints in tokens/utilities for speed and consistency
- HCI Foundations: minimize cognitive load; use progressive disclosure; respect Hick's and Fitts's laws; apply Gestalt principles; align with mental models; ensure affordances and feedback
- Accessibility by Default: WCAG 2.2 AA minimum; keyboard first; screen reader semantics; sufficient contrast; respect Reduce Motion and High Contrast settings

## Design Tokens (source of truth)
Define tokens once; propagate to all platforms. Prefer CSS variables and/or a token pipeline (e.g., Style Dictionary).
- Color: semantic tokens (e.g., `--color-surface`, `--color-text-primary`, `--color-accent`) mapped to brand palettes and dynamic schemes (e.g., Material dynamic color)
- Typography: type scale (e.g., 12–32px), responsive sizes, line-height 1.3–1.6; prefer system fonts on native platforms
- Spacing & Layout: 8pt baseline grid, spacing scale (e.g., 4, 8, 12, 16, 24, 32, 48)
- Elevation & Effects: shadows and overlays with clear elevation ranges; avoid excessive elevation on content surfaces
- Motion: standard durations (micro: 100–150ms, UI: 200–300ms, large/route: 300–450ms); easing curves consistent with platform norms; honor Reduce Motion
- State & Interaction: focus rings, hover/pressed/disabled states defined in tokens

## Layout & Responsiveness
- Grids: use container and content grids; allow dense vs. comfortable density modes (Carbon-style)
- Breakpoints: define platform-agnostic tiers (e.g., xs < 480, sm 480–768, md 768–1024, lg 1024–1440, xl ≥ 1440). Map to platform-specific guidance (Material, Carbon)
- Safe Areas & System UI: respect notches, bars, and safe areas (Apple); avoid UI underneath critical system overlays unless intentional
- Navigation placement: follow platform norms (iOS bottom tabs, Android bottom nav, Web side nav/top bar as appropriate)

## Platform Guidance
- Apple (iOS/iPadOS/macOS): prioritize clarity, deference, and depth; native controls where possible; adopt SF symbols; use sheets, popovers, and split views appropriately
- Material (Android/Web): use M3 components; elevation & tonal color; motion as feedback; leverage dynamic color on supported platforms
- Carbon (Web/Enterprise): high information density, data tables, complex filters; skeletons and loading states; consistent enterprise patterns
- Tailwind (Web): encode tokens in Tailwind config; use Headless UI/Radix/ARIA primitives for accessible interactions; keep utilities aligned to tokens

## Cross-System Component Map (canonical set)
- App Shell: top bar/side nav/bottom nav; breadcrumbs
- Action: buttons (primary/secondary/tertiary/ghost/tonal), speed-dial/FAB where platform-appropriate
- Navigation: tabs, segmented controls, stepper, pagination
- Surfaces: sheets, dialogs, drawers, popovers, toasts/snackbars, banners
- Data Display: lists, cards, tables, data grid, chips, badges, avatar
- Forms: text fields, selects, combobox, date/time pickers, sliders, switches, radios, checkboxes, file upload
- Feedback: progress (linear/circular), skeleton, empty states, error states
- Search & Filter: search field, filter panel, chips
- Accessibility Aids: skip links, focus management, live regions

## Motion & Feedback
- Communicate causality (what changed), continuity (where it came from), and hierarchy (what’s important)
- Default durations as per Tokens; avoid compound animations > 600ms; stagger for complex surfaces
- Provide non-motion affordances (focus styles, color/state changes) for Reduce Motion users

## Accessibility & Internationalization
- Contrast: 4.5:1 normal text, 3:1 large text; validate with automated tools and manual reviews
- Semantics: roles, labels, descriptions; logical tab order and focus return on modal close
- Input Targets: minimum 44×44px touch targets (Apple), ≥ 48dp Android; 24px icon minimum with 2px padding
- Localization: allow 30–50% text expansion; support bidi; pluralization rules; number/date/currency formats

## Tooling & Process
- Design: Figma libraries for tokens and components; plugins for a11y/contrast
- Docs & Preview: Storybook/DocsPage; auto-generate from component props with MDX
- A11y: axe, eslint-plugin-jsx-a11y, testing-library a11y helpers
- Visual Regression: Chromatic/Applitools/Playwright snapshots
- Performance: web.dev Web Vitals (FCP, LCP, INP) and Lighthouse; instrument field RUM as per `docs/webdev-integration.md` and send to analytics (see `docs/analytics/Clarity.md`)
- Token Pipeline: Style Dictionary/Theo; publish as packages; sync to Tailwind config and platform themes

## Metrics & Quality Gates
- Usability: task success rate, time-on-task, SUS
- Accessibility: automated a11y checks pass, manual keyboard/reader checks, contrast thresholds
- Performance: LCP ≤ 2.5s, INP ≤ 200ms; bundle budgets respected
- Consistency: % of screens using approved components; token coverage ≥ 90%
- Defects: UI bug density trending down; no P0 a11y defects

## Debugging Aids
- Turn on layout debug grid, readable color tokens, focus-outline debugging in dev builds
- Log component boundary warnings when custom styles override tokens
- Provide “reduce motion” and “high-contrast” preview toggles in Storybook

## References
- Apple HIG (patterns/components), SwiftUI guidelines
- Material 3 (tokens/components/motion), Material Web/Compose
- Carbon (components/react/web-components), IBM Design Language
- Tailwind CSS (tokens via config), Headless UI/Radix for behaviors

### Official Resources
- Apple Human Interface Guidelines: [developer.apple.com/design/human-interface-guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- Apple Patterns: [developer.apple.com/design/human-interface-guidelines/patterns](https://developer.apple.com/design/human-interface-guidelines/patterns)
- Apple Components: [developer.apple.com/design/human-interface-guidelines/components](https://developer.apple.com/design/human-interface-guidelines/components)
- SwiftUI docs: [developer.apple.com/documentation/SwiftUI](https://developer.apple.com/documentation/SwiftUI)
- Material 3: [m3.material.io](https://m3.material.io/)
- Material Web (docs): [github.com/material-components/material-web/tree/main/docs](https://github.com/material-components/material-web/tree/main/docs)
- Material Web (repo): [github.com/material-components/material-web](https://github.com/material-components/material-web/tree/main)
- Material Android: [github.com/material-components/material-components-android](https://github.com/material-components/material-components-android/tree/master)
- Carbon Design System: [carbondesignsystem.com](https://carbondesignsystem.com/)
- Carbon Web Components: [github.com/carbon-design-system/carbon/tree/main/packages/web-components](https://github.com/carbon-design-system/carbon/tree/main/packages/web-components)
- Carbon React: [carbondesignsystem.com/developing/frameworks/react](https://carbondesignsystem.com/developing/frameworks/react/)
- IBM Design Language: [ibm.com/design/language](https://www.ibm.com/design/language/)
- Tailwind CSS: [tailwindcss.com](https://tailwindcss.com/)
- Headless UI: [headlessui.com](https://headlessui.com/)
- Radix Primitives: [radix-ui.com/primitives](https://www.radix-ui.com/primitives)

### APIs & Implementations
- Apple: SwiftUI/UIKit component APIs; SF Symbols; HIG interaction patterns
- Material: Material Web components (custom elements), Material Compose (Android), MDC Android
- Carbon: React and Web Components packages; density/theming controls
- Tailwind: `tailwind.config.js` token mapping; Headless UI/Radix for accessible behavior APIs