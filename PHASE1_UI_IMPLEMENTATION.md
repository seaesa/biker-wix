# PKL - Phase 1 UI/UX Implementation (Wix Studio + Velo)

This document implements Phase 1 as a practical build guide tied to reusable code in this repository.

## What was added in code

- `src/public/pkl-config.js`  
  Shared constants for routes, element IDs, theme tokens, garage items, map zones, and default profile.

- `src/public/pkl-state.js`  
  Local/session storage helpers for profile persistence.

- `src/public/pkl-ui.js`  
  Reusable binders for:
  - Global navigation
  - Home screen actions
  - Character interactions
  - Garage interactions
  - Map interactions

- `src/pages/Home.c1dmp.js`  
  Home page now binds global nav + start flow.

- `src/pages/masterPage.js`  
  Site-level nav binding.

- `src/styles/global.css`  
  PKL theme utility classes (dark biker palette + neon cyan accents).

## Phase 1 execution order (task list)

1. Build visual shell in Wix Editor:
   - Header with nav buttons (Home / Character / Garage / Map / Play)
   - Main content containers using `.pkl-bg`, `.pkl-panel`, `.pkl-title`

2. Create page sections in Editor:
   - Home hero
   - Character page
   - Garage page
   - Map page

3. Apply IDs exactly as expected in `PKL_IDS`:
   - Start with home IDs, then character IDs, then garage/map IDs
   - If IDs differ, update `src/public/pkl-config.js` only

4. Wire data and interactions:
   - Keep all interaction code in `src/public/pkl-ui.js`
   - Keep page files thin: call `bind...()` inside `$w.onReady`

5. Add image assets:
   - Rider layers (base + gear variants)
   - Bike preview images
   - Map with hotspot overlays

6. Add polish:
   - Entrance animation in editor
   - Hover transitions via custom classes
   - Responsive checks on mobile

## Page-by-page wiring

## 1) Home/Menu

Required IDs:
- `#btnStartRide`
- `#btnContinueRide`
- `#txtHeroTitle` (optional)
- `#txtHeroSubtitle` (optional)

Code:
- Already active in `Home.c1dmp.js` through `bindHomeScreen()`

Behavior:
- Start -> Character page
- Continue -> Map page

## 2) Character Customization page

Create a page in Wix Editor, then use its generated page JS file and add:

```javascript
import { bindGlobalNavigation, bindCharacterScreen } from "public/pkl-ui";

$w.onReady(function () {
  bindGlobalNavigation();
  bindCharacterScreen();
});
```

Required IDs:
- `#btnMale`, `#btnFemale`
- `#btnHelmetPrev`, `#btnHelmetNext`
- `#btnJacketPrev`, `#btnJacketNext`
- `#btnGlovesPrev`, `#btnGlovesNext`
- `#btnShoesPrev`, `#btnShoesNext`
- `#imgRiderPreview`
- `#btnSaveCharacter`

## 3) Garage page

Page code:

```javascript
import { bindGlobalNavigation, bindGarageScreen } from "public/pkl-ui";

$w.onReady(function () {
  bindGlobalNavigation();
  bindGarageScreen();
});
```

Required IDs:
- `#rptBikes` (repeater)
- in repeater item:
  - `#txtBikeCardName`
  - `#txtBikeCardMeta`
  - `#btnBikeCardSelect`
- outside repeater:
  - `#imgBikePreview`
  - `#txtBikeName`
  - `#txtBikeMeta`
  - `#btnSelectBike`

## 4) Map page

Page code:

```javascript
import { bindGlobalNavigation, bindMapScreen } from "public/pkl-ui";

$w.onReady(function () {
  bindGlobalNavigation();
  bindMapScreen();
});
```

Required IDs:
- `#boxZoneA`, `#boxZoneB`, `#boxZoneC`
- `#boxZoneDetail`
- `#txtZoneTitle`
- `#txtZoneBody`
- `#btnStartFromZone`

## Simplifications vs original concept (intentional for Phase 1)

- No physics implementation yet.
- Gear and bike selection currently updates profile state, not performance simulation.
- Map hotspots show context and selection, not live roaming.
- Stunts and rider-body mechanics deferred to Phase 3 gameplay iframe.

## Challenges in Wix and how this setup handles them

1. Page code filenames are Wix-generated and cannot be invented safely:
   - Solution: keep logic in `public/` modules; page files are lightweight wrappers.

2. Element IDs may drift while designing:
   - Solution: centralize IDs in `pkl-config.js`.

3. State continuity across pages:
   - Solution: `wix-storage` local profile with defaults + deep merge.

4. Balancing visual quality with maintainability:
   - Solution: global CSS utility classes and consistent panel/button style tokens.

## Aesthetic improvements for the PKL vibe

- Use a high-contrast dark base with electric cyan accents.
- Add handwritten/biker sticker textures as PNG overlays in panel corners.
- Pair one bold display font for titles + simple sans font for UI labels.
- Add subtle animated line patterns behind map and garage previews.
- Use short SFX on button click/selection to strengthen “mechanical” feel.
