# Microsoft Clarity — Mode-Aware Notes

This guide is referenced automatically from Plan and Research modes (hooks). Ensure tracking code and mode-aware toggles are applied per the rules.

# Microsoft Clarity Analytics Integration for Cursor Starter

This guide standardizes how to instrument usage analytics with Microsoft Clarity across projects built with Cursor Starter. It maps Clarity features to the RIPER modes and provides a practical checklist so analytics is planned, implemented, verified, and used to improve UX.

## Why Clarity
- Session recordings, heatmaps, rage/dead clicks, scroll depth, JS error insights
- Automatic Smart Events (no-code) for common user actions and friction
- Lightweight, privacy-respecting defaults with content masking
- Data Export API for downstream analysis

Key docs:
- Smart Events overview: [Automatic Smart Events](https://clarity.microsoft.com/blog/say-goodbye-to-manual-tracking-introducing-claritys-automatic-smart-events/)
- Setup and installation: [Install Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/)
- API reference: [Clarity API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api)
- Identify API: [Identify users](https://learn.microsoft.com/en-us/clarity/setup-and-installation/identify-api)
- Data Export: [Data Export API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api)
- Verify install: [Verify installation](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup#verify-your-installation)
- Smart Events: [Smart Events docs](https://learn.microsoft.com/en-us/clarity/setup-and-installation/smart-events)
- Integrations: [Supported platforms](https://learn.microsoft.com/en-us/clarity/third-party-integrations/supported-third-party-platforms)

## Mode-aware analytics plan (RIPER)

- RESEARCH (Ω₁) — Observe only
  - Review Clarity docs and prior data for similar products.
  - Draft event taxonomy and tagging plan. No code changes.
  - Output: “Telemetry Research” note in `memory-bank/activeContext.md` with proposed events, tags, masking.

- INNOVATE (Ω₂) — Design and prototype
  - Propose event names, semantics, and data minimization rules.
  - Map Smart Events you’ll rely on vs. custom events you must emit.
  - Output: “Telemetry Proposal” added to plan with acceptance checks.

- PLAN (Ω₃) — Commit to coverage
  - Add analytics acceptance criteria to the plan: where to insert Clarity snippet, SPA route handling, Identify/consent, events and tags, masking, and verify steps.
  - Define success metrics (e.g., funnel, adoption, error rate).

- EXECUTE (Ω₄) — Implement and tag
  - Install Clarity, wire SPA navigation, emit events, apply tags, respect consent, mask PII by default.
  - Tag sessions with environment, app version, experiment, and tenant.

- REVIEW (Ω₅) — Verify and learn
  - Verify installation in the dashboard; confirm Smart Events firing.
  - Validate custom events and tags; check heatmaps/recordings.
  - Export a small sample via Data Export API to sanity-check fields.

## Implementation checklist

1) Install Clarity snippet
- Obtain your project ID from Clarity and add the official snippet in the `<head>` of your app (SSR/MPA) or via your framework’s HTML entry.
- For GTM setups, use the Clarity template per the integrations guide.

2) Single Page Apps (SPA)
- After route changes, notify Clarity of a new virtual page:
```html
<script>
// Call after your router confirms navigation
window.clarity && window.clarity("page");
</script>
```

3) Identify API (optional)
- Associate a durable user identifier (prefer hashed or pseudonymous):
```html
<script>
// Use a stable internal user id. Avoid emails unless policy allows.
window.clarity && window.clarity("identify", userId);
</script>
```

4) Session/page tagging
- Tag sessions or pages to segment analysis:
```html
<script>
// Examples: environment, app version, AB experiment, tenant, role
window.clarity && window.clarity("set", "environment", "production");
window.clarity && window.clarity("set", "appVersion", "1.2.3");
window.clarity && window.clarity("set", "experiment", "checkoutA");
window.clarity && window.clarity("set", "role", "admin");
</script>
```

5) Custom events
- Emit explicit signals for critical product milestones:
```html
<script>
// Use concise, stable names; prefer kebab-case or snake_case
window.clarity && window.clarity("event", "signup_completed");
window.clarity && window.clarity("event", "checkout_started");
window.clarity && window.clarity("event", "checkout_completed");
window.clarity && window.clarity("event", "error_payment_failed");
</script>
```

6) Consent and privacy
- If consent is required, only enable tracking after consent:
```html
<script>
// Call with true once the user consents
window.clarity && window.clarity("consent", true);
</script>
```
- Mask sensitive UI by default and unmask only where explicitly allowed:
```html
<!-- Mask an input or section -->
<input data-clarity-mask="true" />
<div data-clarity-mask="true"></div>
```

7) Verify installation
- Open your site, then in the Clarity dashboard check “Live” → sessions.
- In DevTools Network, confirm POSTs to `https://www.clarity.ms/collect`.

8) Data Export API (optional)
- Generate an API token in Clarity. Pull structured data for BI:
```bash
curl --location 'https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1&dimension1=OS' \
  --header 'Authorization: Bearer YOUR_API_TOKEN'
```
- Use a scheduled job to export daily into your warehouse.

## Event taxonomy (recommended)

- Page/route: `page_view` (Smart + SPA `page`) with tags: `route`, `appVersion`, `environment`
- Sign-up funnel: `signup_started`, `signup_completed`
- Auth: `login_success`, `login_failure`
- CRUD: `entity_create`, `entity_update`, `entity_delete`
- Commerce: `checkout_started`, `checkout_completed`, `payment_failed`
- Errors: `error_boundary`, `error_network`, `error_validation`
- Experiments: tag `experiment` and emit `experiment_exposure`

Naming rules:
- Use lowercase kebab-case or snake_case.
- Prefer generic names over UI-specific ones; keep stable across refactors.
- Do not embed PII in names or values.

## Smart Events
- Enable Smart Events to reduce manual instrumentation and capture friction patterns. Review and tune Smart Events in the Clarity UI. See: [Smart Events](https://learn.microsoft.com/en-us/clarity/setup-and-installation/smart-events).

## Privacy & compliance
- Default mask sensitive elements; audit masking before launch.
- Use `identify` with a pseudonymous ID; avoid emails unless policy allows.
- Respect consent and regional laws; gate initialization behind consent if required.

## Mode-specific acceptance checks (copy into plans)
- RESEARCH: Taxonomy drafted; sources reviewed; comparable apps analyzed.
- INNOVATE: Event list, tags, masking rules proposed; Smart Events plan.
- PLAN: Acceptance criteria include: snippet added, SPA `page` wired, `identify` strategy, consent gating, events + tags list, masking list, verify steps.
- EXECUTE: Implement snippet, router hook, events, tags, masking, consent.
- REVIEW: Validate install, events, Smart Events; export sample via API; add insights to `memory-bank/progress.md`.

## Project ID and environments
- Keep the Clarity project ID out of source control if needed; inject via env or template variable.
- Use separate Clarity projects or tags for `development`, `staging`, and `production`.

## Quick integration snippets

- Head snippet (replace `PROJECT_ID` with your Clarity project id; get it from Clarity “Setup”):
```html
<!-- Microsoft Clarity -->
<script>
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "PROJECT_ID");
</script>
```

If you want us to add the snippet to a specific app in this repo, share your Clarity project ID and target entry file (e.g., `index.html`, `_app.tsx`, or framework equivalent).