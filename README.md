# FinYaari

Marketing / landing site for FinYaari — a WhatsApp-based investing companion ("Nova") that
teaches first-time investors through practice with virtual money. Built as a single-page React
app (Vite + Tailwind CSS + Framer Motion).

## Tech stack

- **React 19** + **Vite 8** — app shell and dev/build tooling
- **Tailwind CSS 3** — styling, using a small custom design-token set in `tailwind.config.js`
  (`primary`, `dark`, `accent`, `mint`, `emerald`, custom shadows/animations)
- **Framer Motion** — scroll-linked and interaction animations used throughout the sections
- **lucide-react** — icon set
- **libphonenumber-js** — phone number parsing/validation for the waitlist form
- **oxlint** — linting (`npm run lint`)

No router, no state library, no backend of its own — this is a static marketing page that talks
to one external API (see [Waitlist API](#waitlist-api) below).

## Getting started

```bash
npm install
cp .env.example .env   # then fill in VITE_WAITLIST_API_URL if it differs
npm run dev             # start the Vite dev server
npm run build            # production build to dist/
npm run preview          # preview the production build locally
npm run lint              # oxlint
```

## Project structure

```
src/
  App.jsx                 # page composition — mounts Navbar/Footer + all sections in order
  main.jsx                # React root
  index.css                # Tailwind directives + global utilities (glass, gradients, etc.)

  components/
    Navbar.jsx              # sticky nav, mobile menu, "Start Learning on WhatsApp" CTA
    Hero.jsx                 # landing hero
    Story.jsx                 # scroll-driven "Nova arrives" narrative section
    WhyFinYaari.jsx             # value props
    HowItWorks.jsx                # step-by-step explainer
    LearningJourney.jsx             # journey/roadmap visual
    Companion.jsx                     # intro to Nova, the WhatsApp companion
    InteractiveDemo.jsx                 # simulated WhatsApp chat demo
    LivingConversation.jsx                # conversation showcase
    LearningProgress.jsx                    # progress/gamification showcase
    FeatureIslands.jsx                        # feature grid
    FAQ.jsx                                     # accordion FAQ
    CTA.jsx                                      # closing call-to-action section
    Footer.jsx                                    # site footer
    WaitlistModal.jsx                               # "Join the Waitlist" popup (see below)
    Roadmap.jsx                                       # currently unused, not mounted in App.jsx
    ui/
      Button.jsx                                        # shared button (variants/sizes/icon)
      SectionHeading.jsx                                  # shared section heading component

  context/
    WaitlistModalContext.jsx    # global open/close state for WaitlistModal, via useWaitlistModal()

  lib/
    countries.js                 # country + dial-code list (built from libphonenumber-js metadata)
    waitlistApi.js                 # fetch wrapper for the waitlist API (see below)
    utils.js                         # cn() — clsx + tailwind-merge helper

  hooks/
    useCountUp.js                      # animated number count-up hook
```

Every top-level section in `App.jsx` is a self-contained component with its own Framer Motion
animations; there isn't a shared layout/section wrapper beyond Tailwind utility classes.

## Waitlist flow ("Start Learning on WhatsApp")

Every "Start Learning on WhatsApp" button on the page (Navbar ×2, Hero, Story, InteractiveDemo,
CTA) does **not** link out to WhatsApp — it opens a **Join the Waitlist** modal instead, wired up
via `WaitlistModalContext`:

- `WaitlistModalProvider` (mounted once in `App.jsx`) holds `isOpen` state and renders the
  `WaitlistModal` alongside the app.
- Any component calls `const { openWaitlistModal } = useWaitlistModal()` and fires it on click.

`WaitlistModal.jsx` handles:
- A country-code selector (defaults to India) + phone number input, built on `libphonenumber-js`
  for validation.
- Required / invalid / duplicate / generic-failure error states, each with the specific copy
  spelled out in the component.
- A disabled/"Submitting…" loading state that prevents double submits.
- A "Thank You!" success screen with a **Done** button.
- Resets to a fresh, empty state every time it's reopened; closes on the ✕ button, an outside
  click, or Escape (but not while a submit is in flight).
- Fires a best-effort "warm up" ping to the API as soon as the modal opens, and retries the
  submit once on a network-level failure — see [Waitlist API](#waitlist-api) for why.

### Waitlist API

`src/lib/waitlistApi.js` posts to the URL in `VITE_WAITLIST_API_URL`:

```
POST {VITE_WAITLIST_API_URL}
Content-Type: application/json

{ "mobile_number": "9876543210" }   // bare national number, no "+"/country code
```

Response shapes actually returned by the current backend (`nova-gtbk.onrender.com`):

| Case | HTTP status | Body |
|---|---|---|
| Added | `201` | `{ "status": "added", ... }` |
| Already on the waitlist | `200` | `{ "status": "already_added", "message": "..." }` |
| Validation error | `422` | `{ "message": "...", "errors": { "mobile_number": ["..."] } }` |

`submitToWaitlist()` maps all of these (plus outright network failures) to the exact user-facing
messages the modal shows. Note the backend currently only accepts 10-digit Indian mobile numbers
— the country selector in the UI is there for when/if the backend adds international support, but
non-Indian numbers will currently come back as a validation error.

This API host is on Render's free tier, which spins the service down after inactivity — the first
request after a while can take 30-60s to wake up and may fail once. That's what the warm-up ping
and single automatic retry in `waitlistApi.js` are there to smooth over; if you see a generic
"Something went wrong" error once and it works on retry, that's why.

## Environment variables

Copy `.env.example` to `.env` for local development:

```
VITE_WAITLIST_API_URL=https://nova-gtbk.onrender.com/api/wishlist
```

Because this is a Vite app, only variables prefixed `VITE_` are exposed to client code, and they
are baked into the bundle **at build time** — not read at runtime. `.env` is gitignored (only
`.env.example` is committed), so:

- Locally: `npm run dev` / `npm run build` pick up `.env` automatically.
- On Vercel (or any host): set `VITE_WAITLIST_API_URL` under **Project → Settings → Environment
  Variables**, then **redeploy** — simply saving the variable does not update an already-built
  deployment.

## Linting

```bash
npm run lint
```

Rules are configured in `.oxlintrc.json`.
