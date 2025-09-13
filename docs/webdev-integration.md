# Web.dev Integration Framework for Cursor Starter

## Purpose
Embed modern web best practices (from web.dev) into the RIPER Σ modes so research, planning, execution, testing, and review naturally apply patterns, APIs, and metrics that make software faster, more reliable, secure, and easier to debug.

## Sources
- New patterns for amazing apps (clipboard, files, app patterns)
- TransformStream (Streams API)
- Passkey registration (WebAuthn)
- App-like PWAs (make PWAs feel native)
- Progressively enhance your PWA
- Web Vitals overview
- Top Core Web Vitals
- User-centric performance metrics
- Web Vitals field measurement best practices

## Mode overlays (what to do in each mode)

### Research (Ω₁)
- Investigate feasibility and support:
  - Identify required Web APIs: Streams API (`TransformStream`), WebAuthn (passkeys), Service Workers, Manifest, File System Access, Web Share, Badging, Background Sync, App Shortcuts, URL/Protocol handlers.
  - Check progressive enhancement paths and fallbacks for each feature.
- Define user outcomes and performance targets upfront:
  - Core Web Vitals targets at p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
  - Optional guardrails: TTFB p75 ≤ 800 ms, TBT (lab) ≤ 200 ms on mid‑tier devices.
- Capture risks and constraints (auth platform support, offline behavior, storage quotas, privacy for RUM).

### Plan (Ω₃)
- Progressive enhancement strategy:
  - Define baseline experience without JS-critical features; layer advanced features using feature detection.
  - Specify fallbacks for each API (e.g., password fallback if passkeys unavailable).
- PWA strategy and acceptance:
  - App shell offline behavior, installability, update strategy, navigation model, and error fallbacks.
  - Manifest includes: name, icons (with sizes), categories, display modes, `shortcuts`, `handle_links`, `file_handlers` if used, `scope`, `start_url`.
- Security & authentication:
  - Passkeys (WebAuthn): resident credentials, `userVerification: "required"`, `attestation: "none"`, proper RP ID, anti‑replay nonces.
  - Credential fallback path and recovery UX.
- Data & streaming:
  - Use streaming pipelines for large payloads; plan backpressure and partial rendering.
- Observability & RUM:
  - Decide RUM sampling rate (1–10%), event schema, endpoint, privacy filters, and storage/retention.

### Execute (Ω₄)
- Progressive enhancement implementation:
  - Guard features with capability checks; avoid breaking baseline UX.
- PWA implementation:
  - Service worker: cache strategy for shell/assets, offline fallback route, versioned updates.
  - Manifest: app‑like features (shortcuts, badging), install prompts as appropriate.
- Streams API:
  - Use `TransformStream` or `ReadableStream.pipeThrough()` for incremental processing.
  - Handle backpressure, errors, and cancellation; provide non‑stream fallback.
- Authentication (Passkeys):
  - Implement registration and sign‑in via WebAuthn; store server‑side public key data; rotate challenges.
  - Provide password/email‑link fallback; clear UX cues.
- Clipboard, Files, Sharing:
  - Use Clipboard API, File System Access, Web Share where available; degrade gracefully.
- Instrumentation:
  - Integrate `web-vitals` for LCP/INP/CLS and send to analytics with p75 aggregation server-side.

### Test & Measure (Ω₄/Ω₅)
- Lab checks: Lighthouse and local throttling to catch regressions (TBT, LCP approximations).
- Field measurement (RUM):
  - Collect LCP, INP, CLS at p75 per page‑type and overall, using sample rate and attribution data.
  - Verify “first contentful navigation” vs SPA navigations (use Navigation API or route tagging).
- Acceptance thresholds:
  - Block on regressions beyond budgets: LCP p75 > 2.5 s, INP p75 > 200 ms, CLS p75 > 0.1.
- Debugging guidance:
  - Use attribution from `web-vitals` to locate LCP element, INP target/interaction type, CLS sources.

### Review (Ω₅)
- Verify checklists complete, budgets respected, and fallbacks functioning.
- Confirm offline, install, and auth flows on at least 2 browsers and a mid‑tier device profile.
- Summarize performance deltas vs baseline; file follow‑ups for outliers.

## Implementation guidance

### Progressive enhancement (feature detection)
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
if ('credentials' in navigator && window.PublicKeyCredential) {
  // Passkeys supported; enable WebAuthn flows
}
if (window.TransformStream) {
  // Enable streaming code path
}
```

### Streams API (example pipeline)
```js
const response = await fetch('/api/data');
if (response.body && window.TransformStream) {
  const uppercase = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(new TextEncoder().encode(
        new TextDecoder().decode(chunk).toUpperCase()
      ));
    }
  });
  const stream = response.body.pipeThrough(uppercase);
  return new Response(stream);
} else {
  // Fallback: buffer then process
  const data = await response.text();
  return new Response(data.toUpperCase());
}
```

### Passkeys (registration sketch)
```js
const publicKey = await fetch('/webauthn/registration-options').then(r => r.json());
const cred = await navigator.credentials.create({ publicKey });
await fetch('/webauthn/register', {
  method: 'POST',
  body: JSON.stringify(cred),
  headers: { 'Content-Type': 'application/json' }
});
```

### Web Vitals (RUM collection)
```js
import { onLCP, onINP, onCLS } from 'web-vitals';
function sendToAnalytics(metric) {
  navigator.sendBeacon('/rum', JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    navigationType: metric.navigationType,
    attribution: metric.attribution // include when available
  }));
}
onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

## Checklists

### PWA
- Manifest has icons, categories, display modes, `shortcuts`, `scope`, `start_url`.
- Service worker caches shell and handles offline fallback; clear update path.
- Install prompt appropriately surfaced; app feels native (navigation, transitions, back behavior).

### Performance
- Budgets: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 (p75, field).
- Measure via RUM with sampling; attribute sources for regressions.
- Lab checks use throttling on mid‑tier device profiles.

### Authentication
- Passkeys default with `residentKey` discoverable; fallback available.
- Challenges are unique per attempt; `attestation: none`; server verifies origins and RP ID.

### Files/Clipboard/Share
- Use feature detection; provide alternatives (download links, input type="file", manual copy).

## Notes
- Always prioritize user‑centric outcomes over synthetic benchmarks; validate changes with field data at p75.
- Respect privacy and legal constraints for telemetry; minimize payloads and avoid PII.