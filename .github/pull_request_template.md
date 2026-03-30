Title: Merge `develop` → `main` — Booking flow, accessibility and UI polish

Summary
-------
This PR merges the `develop` branch into `main` and delivers the following features and improvements:

- Booking flow: provisional booking, slot picker, booking confirmation UI.
- Mock payments: `MockBookingService.mockPay` and payment confirmation flow.
- Dashboard: bookings history view with pay/cancel actions.
- Slot picker component with availability checks.
- Accessibility improvements: mobile menu focus trap, aria-hidden toggling, SR announcer.
- Micro-interactions and CSS polish (header, hero, CTA, animations).
- Tests: unit tests for `MockBookingService`.
- Docs: `docs/api-spec.md` API specification for backend work.

Files changed (high level)
-------------------------
- src/app/booking/**
- src/app/shared/slot-picker.ts
- src/app/services/mock-booking.service.ts
- src/app/dashboard/dashboard.component.ts
- src/app/shared/header.ts, footer.ts
- src/styles.css
- docs/api-spec.md

Why
---
These features complete the frontend booking MVP and provide a simple, testable mock backend flow (localStorage). The API spec will be used by backend devs to implement persistent services and payment gateway integration.

How to test locally
-------------------
1. Install dependencies and run dev server:

```bash
npm install
npm start
```

2. Run unit tests:

```bash
npm test
```

3. Quick manual checks:
- Open the app at `http://localhost:4200/`.
- Use header search and navigation.
- Go to `Services` → pick a service → `Booking`.
- Select date, choose a slot, create booking, then `Review & Pay` → `Pay Now`.
- Visit `Dashboard` to view bookings and pay/cancel actions.

Notes / Migration
-----------------
- The current mock payment implementation stores bookings in `localStorage` under `colf:bookings`. Backend integration will replace this with API-backed booking persistence and webhooks.
- `docs/api-spec.md` contains recommended endpoints for the backend.

Security
--------
- No real payment gateways are integrated; `mock` is used. When integrating a gateway, ensure to implement idempotency keys and webhook validation.

Checklist
---------
- [ ] Tests passing (`npm test`)
- [ ] Manual QA for booking and payments
- [ ] Backend API integration (follow `docs/api-spec.md`)

Deployment notes
----------------
- No DB migrations required for frontend-only changes.

If you'd like, I can create the PR using the GitHub CLI: 

```bash
gh pr create --base main --head develop --title "Merge develop → main — Booking flow & UI" --body-file .github/pull_request_template.md
```

Or I can open the PR for you if you authorize me to run the CLI here.