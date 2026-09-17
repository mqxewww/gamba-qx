# gamba — v1 Specification

> Status: draft · Scope: first stable deliverable (v1)
> This document defines **what** v1 must do, not how to build it. Technical
> architecture (folder layout, module boundaries, WS protocol details) belongs to
> the `/plan` role; visual design and UI belong to the `/design` role.

## 1. Overview

**gamba** is a real-time **crash game** with play money. A shared round runs
continuously: players place a bet during a short betting window, a multiplier
then rises from `1.00×` and keeps climbing until the round "crashes" at a
predetermined point. A player wins by cashing out **before** the crash, at the
current multiplier; if the round crashes first, the stake is lost.

The project is a **rewrite** of two legacy code bases (`legacy-front`,
`legacy-server`) onto a new stack. The business logic of a round is preserved;
almost everything else is rebuilt.

- Single developer, public GitHub repository.
- **Play money only. No real currency, no payments, no cash-out to money.**
- Documentation and code comments are written in **English**.

## 2. Goals & non-goals for v1

### Goals

- Ship **one** feature done well: a playable, real-time crash game.
- Be **stable**: builds, lints, runs from a documented local setup, and is
  guarded by CI.
- Establish the new stack cleanly so later features can be added.

### Non-goals (explicitly out of scope for v1)

- Item auctions / marketplace between players.
- Magic-link email authentication and password reset.
- Auto-cashout (setting a target multiplier that cashes out automatically).
- Leaderboards, social features, chat.
- Online deployment / hosting.
- Multiple concurrent game rooms.
- Provably-fair with a per-player client seed (v1 uses a server seed only).

These are candidates for later versions (see §12).

## 3. Target stack (summary)

Stated as product constraints; `/plan` owns the details.

- **Frontend**: React (SPA, **no Next.js**, **no Vue**).
- **Backend**: Hono (replacing NestJS).
- **Real-time**: **native Bun WebSocket** exposed through Hono (Socket.IO is
  dropped).
- **Database**: PostgreSQL (replacing MySQL).
- **Runtime & package manager**: **Bun only**. `npm`, `yarn`, `pnpm` are
  forbidden and this must be enforced.
- Repository: `gamba-qx` monorepo holding frontend + backend together.

## 4. Users

- **Player**: a registered user who can bet and cash out. Has a coin balance.
- **Spectator**: any connected client watching a round without an active bet
  (e.g. logged-out visitor, or a logged-in user who did not bet this round).

## 5. Functional requirements

### 5.1 Authentication

- Registration with **email + password**; login with the same credentials.
- Passwords are stored **hashed** (never in plain text).
- `email` and display `name` are unique.
- Session is persisted so a returning user stays logged in.
- Logout is available.
- **Deferred**: password reset (needs email), email verification, magic link.

### 5.2 Economy (coins)

- Coins are **non-negative integers**.
- A new account starts with **1000 coins**.
- **Faucet (option A)**: a player can **claim free coins** only while their
  balance is **below 100 coins**; a claim grants a flat **1000 coins**. There is
  **no cooldown** — the threshold alone gates it (after a claim the balance is
  above 100, so the player must play the coins down before claiming again).
- Coin accounting for a bet:
  - **Stake is debited at bet placement** (`balance -= amount`).
  - On **cashout at multiplier `N`**, the player receives `floor(amount × N)`
    back (net gain `amount × (N − 1)`).
  - If the round **crashes before cashout**, nothing is returned — the stake is
    lost.
  - Winnings are **floored** to whole coins.

### 5.3 Crash game — round lifecycle

A single global round is shared by all connected clients and cycles through:

1. **Pending (betting window)** — default **20 s**. Players may place their bet.
2. **In progress** — the multiplier starts at `1.00×` and rises continuously
   until it reaches the round's crash point.
3. **Finished** — the crash multiplier is shown for a short pause (default
   **~5 s**), the seed is revealed (see §6), then a new round starts at step 1.

Multiplier growth and crash point use the **legacy formulas**:

- Multiplier over time is exponential: `multiplier(t) = e^(K · t)` with
  `K = 0.0578` (t in seconds since round start), value tracked at 2 decimals
  (`×100` internally).
- The crash point is **derived deterministically from the round seed**, with a
  **5% house edge** and a **minimum of 1.00×**.

**Real-time model — client-side animation.** Because the curve is deterministic
from the round start time, the multiplier is **computed and animated locally by
the client** (~60 fps) rather than streamed value by value:

- On round start, the server sends the **start timestamp** and the seed hash;
  each client renders the rising multiplier itself from the shared formula.
- The server only broadcasts **authoritative events**: a bet placed, a cashout,
  and the **crash** (which ends the round). The crash timing and cashout
  multipliers are **server-authoritative** — the client animation is display
  only and never decides an outcome.
- A client joining mid-round receives the current round's start timestamp and
  state so its local animation is in sync.

### 5.4 Betting & cashout rules

- A player may place **one bet per round**, only during the **pending** window.
- Bet amount is an integer, **minimum 1**, **maximum = current balance**.
- **Manual cashout only**, allowed only while the round is **in progress** and
  only if the player has a pending (not yet cashed-out) bet.
- A player cannot bet twice, cannot cash out twice, and cannot cash out without
  a bet — these produce clear errors.

### 5.5 Real-time presence

- Display the number of **connected clients**.
- Display the number of **players in the current round** (clients with a bet).

### 5.6 History

- All rounds and bets are **persisted** in the database.
- **Global history**: the UI shows a strip of the **10 most recent crash
  multipliers**.
- **Personal history**: a logged-in player can see their **25 most recent bets**
  (amount, the round, cashout multiplier or "lost", and net result). Pagination
  is deferred to a later version.

## 6. Provably-fair mechanism (v1)

The crash point is fully determined by the round's **server seed**, so a player
can verify a round was not rigged after the fact.

- **Commit**: when a round enters _pending_, the server publishes the
  **SHA-256 hash** of the seed (the seed itself stays secret).
- **Play**: the crash point is computed from the seed using the published
  formula (house edge 5%, min 1.00×).
- **Reveal**: when the round finishes, the server reveals the **plain seed**.
- **Verify**: anyone can hash the revealed seed, confirm it matches the earlier
  commit, and recompute the crash point to check it matches what happened.
- v1 uses a **server seed only** (no client seed / nonce). This is documented as
  a known simplification.

## 7. Frontend scope (screens)

v1 has two screens:

1. **Auth** — register / login.
2. **Game** — the live crash game: current multiplier, betting controls, cashout
   button, list of bets for the current round, presence counts, recent-results
   strip, and the player's personal bet history.

No profile page, no leaderboard, no settings in v1.

> **Design/UI is fully redesigned** from the legacy look, but the visual design,
> layout, and design system are owned by the **`/design`** role and are out of
> scope for this functional spec. This spec only fixes _what_ must appear on each
> screen, not how it looks.

## 8. Non-functional requirements ("definition of stable")

- **Bun-only** enforced: the repo pins Bun as the package manager and blocks
  `npm`/`yarn`/`pnpm` installs.
- `bun` **build**, **lint**, and **format** all pass with no errors.
- Type checking passes (TypeScript).
- **Local run is documented and reproducible**: install with Bun, start
  PostgreSQL via Docker, configure environment, run backend + frontend.
- **CI (GitHub Actions)** runs on every push / PR and verifies at least install,
  lint, type check, and build.
- No online deployment is required for v1.

## 9. Documentation deliverables (English)

- **Root `README.md`**: what gamba is, the stack, prerequisites, local setup
  (Bun + PostgreSQL via Docker), how to run, and the Bun-only rule.
- **`docs/ARCHITECTURE.md`**: high-level architecture (monorepo layout,
  frontend / backend / database, overview of the WebSocket protocol).
- **Provably-fair verification guide**: how to verify a finished round from its
  seed and hash.
- **`LICENSE`**: MIT.
- No `CONTRIBUTING` file in v1 (solo project).

## 10. Acceptance criteria

v1 is considered a stable deliverable when all of the following hold:

- A visitor can **register**, **log in**, and stay logged in across reloads.
- A new account starts with **1000 coins**.
- A logged-in player can **place one bet** during the pending window; the stake
  is **debited immediately**.
- The multiplier **rises in real time** and all clients see the same round.
- A player can **cash out** while in progress and is credited
  `floor(amount × multiplier)`.
- If the round **crashes** before cashout, the stake is **lost** and nothing is
  credited.
- The invalid actions in §5.4 are **rejected with clear errors**.
- A player at low balance can **claim free coins** (faucet) and keep playing.
- Clients see **connected count** and **players-in-round count**.
- The UI shows a **recent-results strip** and the player sees their **personal
  bet history**.
- A finished round exposes seed + hash so a round can be **verified**.
- The project **builds, lints, type-checks, and runs** from the documented local
  setup, using **Bun only**, with **green CI**.

## 11. Edge cases to handle

- Bet amount `≤ 0`, non-integer, or greater than balance → rejected.
- Betting outside the pending window → rejected.
- Cashing out with no active bet, twice, or outside the in-progress phase →
  rejected.
- Disconnect during a round: an already-placed bet stays in the round and
  resolves normally (crash = lost, since cashout is manual and requires action).
- Concurrent bets/cashouts from the same user must not double-spend or
  double-credit coins (balance stays consistent).
- Claiming the faucet when above the threshold → rejected.
- A client connecting mid-round receives the current round state (phase,
  multiplier, bets).

## 12. Deferred to later versions

- Magic-link email auth, email verification, password reset.
- Item auctions / marketplace between players.
- Auto-cashout target.
- Leaderboards, chat, social features.
- Provably-fair with per-player client seed / nonce.
- Online deployment.
- Multiple concurrent game rooms.

## 13. Open questions

None — all product decisions for v1 are resolved.
