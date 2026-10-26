# CLAUDE.md

## Pull request workflow (always)

Every pull request must be tied to a GitHub issue. Before or when opening a PR:

1. **Create an issue** describing the problem, evidence and decision, unless one already exists. Reference it in the PR body with `Closes #<n>`.
2. **Write a descriptive PR body**: summary, why, what changed (by file), decisions and trade-offs, how it was verified, and what is left open. A future reader should understand *why* without this conversation.
3. **Assign** the PR and the issue to `ngeshlew`.
4. **Label** both (existing labels: `bug`, `enhancement`, `documentation`, ...).
5. **Milestone**: put both on the relevant milestone (create one if none fits).
6. **Project**: add both to the relevant GitHub Project. If the session can't reach Projects, say so and ask the owner to add them.
7. **Comment on non-obvious lines** in the PR review so the reasoning sits next to the code.

## Billing data (source of truth: Octopus statements)

- Tariffs live in code (`src/services/ukElectricityApi.ts`, `DEFAULT_TARIFF` and `HISTORICAL_TARIFFS`) and in the browser (`tariff-store` in localStorage), **not** in the Railway database. The database only holds meter readings.
- Rates are stored in pence **excluding VAT**. VAT is applied by date via `getVatRateForDate()`.
- Changing seeded tariffs requires bumping the `tariff-store` persist version and migrating, or existing browsers keep the old values.
- Known changes:
  - 1 Apr 2026: unit rate 23.96p → 20.62p (Budget discount).
  - 7 Aug 2026: moved to the 12M Fixed Low Standing Charge tariff (29.23p / 31.76p, £50 exit fee, fixed to 7 Aug 2027).
  - 1 Oct 2026: VAT 5% → 0% (temporary).
- 14–24 Oct 2026: low usage (1.4 kWh/day) because the household was on holiday. This is not a meter fault.
