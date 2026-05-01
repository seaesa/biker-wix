# PKL - Phase 2 Implementation (Customization + Garage + Map)

This phase implements the core interactive layer in Velo for:
- Character and gear customization
- Garage bike selection with preview
- Map hotspot interaction with zone detail updates

## Files updated

- `src/public/pkl-config.js`
  - Added richer metadata for bikes and map zones.
  - Added optional IDs for extra UI labels/chips.
  - Added `GEAR_LIMITS` for bounded gear toggling.

- `src/public/pkl-ui.js`
  - Character:
    - Gender switching
    - Gear increment/decrement with bounds
    - Live rider text summary update
  - Garage:
    - Repeater-driven bike selection
    - Live preview rendering (name/meta/chip/image placeholder)
    - Button state updates ("Choose" vs "Selected")
  - Map:
    - Hotspot A/B/C handlers
    - Detail panel render (title/body/meta)
    - Selected zone persistence + unlock tracking
    - Start button contextual label

- `src/pages/masterPage.js`
  - Auto-binds global nav and Phase 2 interaction handlers so any page containing matching IDs works immediately.

## Required Wix elements to fully see behavior

Character:
- `#btnMale`, `#btnFemale`
- `#btnHelmetPrev`, `#btnHelmetNext`
- `#btnJacketPrev`, `#btnJacketNext`
- `#btnGlovesPrev`, `#btnGlovesNext`
- `#btnShoesPrev`, `#btnShoesNext`
- `#txtRiderTitle`, `#txtRiderStats` (optional but recommended)

Garage:
- `#rptBikes` with item IDs:
  - `#txtBikeCardName`
  - `#txtBikeCardMeta`
  - `#btnBikeCardSelect`
- `#imgBikePreview`, `#txtBikeName`, `#txtBikeMeta`, `#txtSelectedBikeChip`
- `#btnSelectBike`

Map:
- `#boxZoneA`, `#boxZoneB`, `#boxZoneC`
- `#boxZoneDetail`, `#txtZoneTitle`, `#txtZoneBody`, `#txtZoneMeta`
- `#btnStartFromZone`

## Simplifications kept (intentional)

- Character visuals currently use text/state updates; per-gear layered image composition can be added once exact asset URLs are uploaded.
- Garage image field supports preview but defaults to empty string until Wix media assets are connected.
- Map uses hotspot state/detail interaction, not free movement or physics.

## Next upgrade path

1. Plug real image URLs into bike and rider asset maps in `pkl-config.js`.
2. Add hover/selection animation effects in Editor for repeater cards and map hotspots.
3. Move zone progression rules from simple unlock to score-gated unlock once gameplay scoring is ready.
