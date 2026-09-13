# Mach Detail — proposed booking and automation skeleton

Status: **reference architecture; not connected or deployed**. The public site currently prepares a local text draft. This directory is excluded from the published static build. No Nano syntax, Aether API route, account binding, credential, or provider integration is assumed to exist.

## Smallest useful launch

Start with **appointment requests**, then let the shop confirm after inspection/scoping. Paint correction and ceramic preparation can take very different amounts of time; hourly “free” slots generated in a browser cannot establish real capacity.

1. Static website sends a validated request to an authenticated provider-owned ingress configured for this shop; anonymous public visitors must pass abuse controls.
2. In one database transaction, store the request and a notification outbox row with a stable idempotency key. Return `202 accepted` with an opaque request receipt, never `appointment confirmed`.
3. A worker sends the shop notification through the configured email/SMS provider. Authenticated staff review, quote, and select a real calendar interval.
4. Confirmation atomically creates a bay reservation, updates the request, and queues a confirmation notification. Only that state produces “confirmed” customer copy.
5. A scheduler queues one reminder for a confirmed appointment at its configured offset. Cancellation/rescheduling invalidates older reminder versions. If the appointment is less than the reminder offset away, apply the agreed policy rather than sending stale jobs.

See [openapi.yaml](openapi.yaml) for the boundary and [schema.sql](schema.sql) for a PostgreSQL reference. These must be adapted to the actual Aether Cloud service and migration conventions after authorized project registration is verified.

## Ownership and execution

| Layer | Owns | Does not own |
| --- | --- | --- |
| Browser | Accessible form, consent choice, human-readable state | Availability truth, credentials, final prices, confirmation |
| API | Input/size limits, abuse controls, idempotency, scoped authorization | Trust in browser-selected “free” slots |
| Calendar ledger | Shop/bay identifiers, time intervals, expiry, state transitions | Unverified provider delivery claims |
| Nano orchestration adapter | A deterministic validated workflow invocation, once the actual runtime/schema is known | Arbitrary visitor code, secrets, permission escalation |
| Aether Cloud worker | Governed task execution, queue retries, provider adapters | Fabricated runtime registration or cloud connectivity |
| Delivery provider | Provider acceptance and signed delivery/bounce events | Business appointment authority |

Use a separately provisioned service identity with only this shop’s ledger/outbox permissions. Staff authentication and shop membership must be checked on every management endpoint. No browser secret. Do not use existing owner/operator credentials as a customer-facing service credential.

## Scheduling contract

- Shop timezone: `America/New_York`. Persist instants as UTC; retain timezone and local intent. Use a real timezone library for DST ambiguity, not browser offset arithmetic.
- User-supplied weekly hours: Mon–Fri 08:00–17:00, Sat 09:00–14:00, Sunday closed. Shop-approved exceptions override them.
- Owner config sets service duration, buffer, eligible bays/staff, lead time, max booking horizon, and whether a service requires consultation. Reject automatic reservation until those values are approved; do not invent them.
- Interval includes setup/cleanup. Hold and confirm in a transaction with database overlap protection. Expire stale holds before allocation. Simultaneous requests for one interval produce one winner; others receive `409 slot_unavailable`.
- Replaying one idempotency key with identical normalized payload returns the original receipt. A changed payload with that key returns `409 idempotency_conflict`. Retain keys long enough for the documented retry window.
- A timeout is “status unknown”; look up the same request/receipt before retrying with a new identity. The frontend must preserve the customer's details without silently resubmitting them.

## Notifications and privacy

- Configure and verify the shop’s actual sender and recipient. Email receipt may confirm request acceptance; only an appointment-confirmed event can promise a booked time.
- Capture the customer's explicit transactional SMS choice separately from any marketing permission. No marketing enrollment by default. Follow the chosen provider’s current onboarding/opt-out requirements before activation.
- Notification outbox has a unique logical event key, appointment version, attempt count, retry-after, and last safe error category. Use provider idempotency where available. A network timeout after provider acceptance needs reconciliation; do not claim exactly-once delivery from a database row alone.
- Verify webhook signatures, timestamps, event IDs, and replay protection. Store acceptance, delivery, and failure separately. Do not paste message bodies or phone/email into public logs or analytics.
- Keep contact data encrypted under the service’s managed key; the reference schema only stores encrypted payloads. Set a documented retention/deletion period with the shop. Use redacted operational logs and keep secrets out of artifacts.

## Gates for enabling the live form

1. Shop approval and verified calendar owner, business details, service rules, providers, and sender identities.
2. Actual Aether project/runtime registration and scoped worker binding; review existing API/tool contracts before implementing adapters.
3. Migrations exercised in staging, backup/restore and rollback plan recorded.
4. Two concurrent attempts for one bay interval; idempotent retry; different-payload key reuse; Sunday/holiday/buffer/DST boundary tests; cross-shop access rejection.
5. Provider timeout, duplicate/out-of-order webhook, cancellation before reminder, and reschedule races exercised. No customer message for a draft request or failed transaction.
6. Authorized smoke test verifies one request, one confirmed appointment, one notification receipt, and the configured reminder behavior. Record what was actually delivered.
7. Replace the local text-draft path only after backend checks pass. Preserve a visible direct-call fallback, loading/errors, no-JS safety, and reduced-motion support.

No new paid service, calendar connection, SMS campaign, email, or production booking was activated by this concept build.
