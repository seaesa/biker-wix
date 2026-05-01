# PKL - Phase 3 Implementation (Riding Gameplay Layer)

Phase 3 is implemented for Wix feasibility as a **state-driven riding experience** with optional HTML Component integration.

## Implemented

- `src/public/pkl-gameplay.js`
  - Core gameplay controller:
    - speed / rpm / steer / lean simulation (pseudo-physics)
    - throttle / brake / clutch hold controls
    - scoring and combo accumulation
    - trick validation windows:
      - wheelie (throttle + clutch pop)
      - drift (brake + lean + speed)
      - stoppie (high-speed braking)
      - knee-down (angle + speed corridor)
    - run timer (45s), result panel, best score persistence

- `src/public/pkl-ui.js`
  - Added `bindPlayScreen()`:
    - binds hold controls for throttle/brake/clutch
    - binds steer pad drag input
    - binds trick buttons and retry/back actions
    - updates HUD fields
    - optional `HtmlComponent` bridge via `postMessage` / `onMessage`
      - sends `init`, `status`, `telemetry`
      - receives `ready`, `steer`, `trick`

- `src/public/pkl-config.js`
  - Added `PKL_IDS.play` with all Phase 3 UI IDs.

- `src/pages/masterPage.js`
  - Now auto-runs `bindPlayScreen()` (safe no-op unless play elements exist).

## Required Play page IDs in Wix Editor

- `#htmlPlayCanvas` (optional, if using canvas iframe)
- HUD text:
  - `#txtHudSpeed`, `#txtHudRpm`, `#txtHudScore`, `#txtHudCombo`
  - `#txtHudStatus`, `#txtHudTimer`, `#txtHudBike`, `#txtHudZone`
- Controls:
  - `#boxSteerPad`
  - `#btnThrottle`, `#btnBrake`, `#btnClutch`
  - `#btnTrickWheelie`, `#btnTrickDrift`, `#btnTrickStoppie`, `#btnTrickKneeDown`
- Run flow:
  - `#btnRetryRun`, `#btnBackToMap`
  - `#boxRunResult`, `#txtRunResultTitle`, `#txtRunResultBody`

## Simplifications vs original sketch (intentional)

- No true tire/suspension rigid-body physics.
- No full free-roam world/collision system.
- Trick logic uses skill windows and control-state checks instead of full simulation.
- Steering is normalized input mapped to lean behavior.

## Why this fits Wix Velo

- Works fully with native Wix elements and Velo page code.
- Supports progressive enhancement: can run now without iframe.
- Later can connect a canvas mini-game through `#htmlPlayCanvas` without replacing UI/HUD architecture.
