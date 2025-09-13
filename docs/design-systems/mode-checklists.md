# Design System Checklists by Mode

Use these checklists with RIPER modes. Update the memory bank as indicated.

## Ω₁ Research
- Inventory target platforms/devices and constraints (projectbrief.md)
- Collect product characteristics (data density, workflows, branding needs)
- Identify candidate systems (Apple, Material, Carbon, Tailwind) with pros/cons and references (activeContext.md)
- Gather accessibility requirements and legal/compliance needs

## Ω₂ Innovate
- Prototype 1–2 critical screens using candidate systems (can be low-code/Storybook)
- Compare usability, accessibility, and performance; capture findings
- Draft initial token set and theming approach

## Ω₃ Plan
- Choose primary system and document rationale (projectbrief.md → Design System Strategy)
- Define borrowing policy and guardrails (systemPatterns.md → Key Decisions)
- Finalize token taxonomy and pipeline (techContext.md)
- Enumerate component inventory and patterns to implement first (systemPatterns.md → Components)
- Acceptance criteria: a11y, performance, consistency, docs coverage

## Ω₄ Execute
- Install libraries and scaffolding (Material/Carbon/SwiftUI/Tailwind)
- Implement token pipeline and platform themes; wire into Storybook
- Build core layout/navigation and first component set
- Add a11y tests (axe), visual snapshots, and perf budgets to CI
- Document usage in MDX/Storybook; add examples for edge cases

## Ω₅ Review
- Validate against acceptance criteria; run a11y/perf/visual checks
- Heuristic UX review (Nielsen) and HCI checklist
- Track % screens/components on approved system; file issues for deviations
- Update memory bank with outcomes and next steps

## Commit Mode
- Include DS selection/changes, tokens updated, components added/modified
- Link to affected docs (Storybook pages, MD files) and test evidence