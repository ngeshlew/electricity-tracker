# Design System Decision Tree

Use this tree to pick a primary system and define where selective borrowing is allowed. Record the decision in `memory-bank/projectbrief.md` and implementation details in `techContext.md`.

## Step 1 — Platform & Ecosystem
- iOS/iPadOS/macOS native: Prefer Apple HIG + SwiftUI/UIKit
- Android native: Prefer Material 3 + Jetpack Compose
- Web (consumer/Google ecosystem): Prefer Material 3 (Material Web or React wrappers)
- Web (enterprise/data-heavy): Prefer Carbon (React/Web Components)
- Web (custom brand/greenfield, need speed): Tailwind + Headless UI/Radix; optionally adopt Material/Carbon as a component base behind Tailwind tokens

## Step 2 — Product Characteristics
- Data dense tables/filters/workflows → Carbon
- Strong platform affinity (Apple/Google) → respective native system
- Highly branded/marketing-heavy → Tailwind tokens + selective components from Material/Carbon
- Cross-platform parity (Android + Web) → Material 3
- Internal tools/admin → Carbon or Material, depending on org standards

## Step 3 — Team & Timeline
- Existing expertise in one system → bias to that system
- Short delivery timeline/limited designers → Tailwind with clear token governance + minimal component set
- Multi-team consistency & longevity → Carbon or Material with docs and Storybook

## Step 4 — Accessibility & Compliance
- Strict enterprise governance → Carbon
- Mobile accessibility focus → Apple/Material native guidance
- Web WCAG AA/AAA → Any, but enforce tokenized contrast and a11y tests

## Step 5 — Decision
- Select one Primary System (Apple, Material, Carbon, or Tailwind-as-foundation)
- Define Borrowing Policy:
  - Allowed: data table from Carbon in a Material/Tailwind app if tokens and a11y are preserved
  - Not allowed: mixing conflicting navigation paradigms (e.g., iOS tab bar + Material navigation rail inconsistently)
- Define Token Strategy: one source of truth; map to implementation themes (SwiftUI/Compose/Tailwind/React)

## Step 6 — Implementation Mode Hooks
- Research: evaluate candidate systems, list pros/cons, collect references
- Plan: finalize selection, enumerate components and tokens, acceptance criteria
- Execute: scaffold library, tokens, Storybook, a11y & visual tests; implement first 3 screens
- Review: verify checklists and metrics; open issues for any deviations
- Commit: include DS decision and affected artifacts in commit notes

## Decision Examples
- Android + Web app with dense admin workflows → Primary: Material 3; Borrow: Carbon Data Table; Tokens: shared via Style Dictionary; Tailwind used for utility layout only
- iOS-only consumer app → Primary: Apple HIG; Borrow: none; Tokens: SwiftUI theme; Motion: HIG defaults
- Web marketing + app shell → Primary: Tailwind (tokens); Borrow: Material modal/sheet patterns; Components: Headless UI + custom skins