# UPI Shield AI

A responsive GRAVITON 2026 frontend for Problem Statement 03: Real-Time UPI Social Engineering Phishing Interceptor. All analysis is a local, explainable prototype; no backend or real payment integration is connected.

## Run
Prerequisites: Node.js 22.12+ and npm.

```sh
npm install
npm run dev
```
Open the Local URL printed by Vite. To create a production bundle, run `npm run build`; output is in `dist/`.

## Features
- Responsive navy/purple dashboard and accessible labeled navigation.
- Message scanning with character counts, loading, validation, legitimate and scam samples, weighted signals, explanations and recommended actions.
- URL heuristics for shorteners, IP hosts, HTTP, encoded domains, embedded credentials, domain complexity and brand-like patterns. URLs are never opened.
- Low / Medium / High / Critical assessments, explicitly labeled as prototype scores.
- Payment review, warning, cancellation and continuation screens. Simulation only; no real money transferred.
- LocalStorage history (latest 200 scans), empty states, confirmed clearing and storage-failure feedback. Dashboard statistics reflect local demo scans and begin at zero.
- Settings/about page describing system configuration, privacy and limitations.

## Stack and structure
React 19, Vite, TypeScript, Tailwind CSS 4, Lucide React.

- `src/main.tsx`: Layout, Dashboard, Scanner, Result, PaymentSimulation, ActivityTable and Settings UI components.
- `src/engine.ts`: shared types, standalone weighted detection engines and sample messages.
- `src/api.ts`: asynchronous local service adapter and documented backend-status placeholder.
- `src/style.css`: responsive visual system and Tailwind import.
- `src/engine.test.ts`: detection regression tests.
- `vite.config.ts`, `tsconfig.json`, `eslint.config.js`: build and validation configuration.

## Validation
```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## Limitations
Rules can miss scams and flag legitimate messages. Scores are not fraud probabilities. No AI model, URL reputation database, verified threat intelligence, sender authentication or backend is connected. Local URL checks do not fetch destinations or follow redirects. History includes entered content and persists in this browser; avoid secrets and clear history on shared devices. Private browsing or storage restrictions may prevent persistence. All sample payees are fictional. Nothing in this app initiates, authorizes or cancels real transactions.

## Roadmap
Replace the local adapter with authenticated FastAPI endpoints, explicit timeouts and schema validation; add consent-based threat-intelligence checks with source attribution and calibration/evaluation against representative data. Explore an Android companion with explicit user consent, supported platform integration and a review step before any payment handoff. A native app would require its own permissions, security review and testing.
