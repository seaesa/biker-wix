import wixLocation from "wix-location";
import wixWindow from "wix-window";
import {
  PKL_IDS,
  PKL_ROUTES,
  GARAGE_BIKES,
  MAP_ZONES,
  GEAR_LIMITS,
} from "./pkl-config";
import { getProfile, patchProfile } from "./pkl-state";
import { createGameplayController } from "./pkl-gameplay";

function hasElement(selector) {
  try {
    return Boolean($w(selector));
  } catch (_) {
    return false;
  }
}

function safeOnClick(selector, handler) {
  if (!hasElement(selector)) {
    return;
  }
  const element = $w(selector);
  if (typeof element.onClick !== "function") {
    return;
  }
  element.onClick(handler);
}

function safeText(selector, value) {
  if (!hasElement(selector)) {
    return;
  }
  $w(selector).text = value;
}

function safeButtonLabel(selector, value) {
  if (!hasElement(selector)) {
    return;
  }
  $w(selector).label = value;
}

function safeImage(selector, src) {
  if (!src || !hasElement(selector)) {
    return;
  }
  $w(selector).src = src;
}

function safeShow(selector, effect = "fade", options = { duration: 180 }) {
  if (!hasElement(selector)) {
    return;
  }
  const element = $w(selector);
  if (typeof element.show !== "function") {
    console.warn(`[PKL] ${selector} does not support show().`);
    return;
  }
  try {
    element.show(effect, options);
  } catch (_) {
    element.show();
  }
}

function itemHas($item, selector) {
  try {
    return Boolean($item(selector));
  } catch (_) {
    return false;
  }
}

function navigate(path) {
  wixLocation.to(path);
}

function formatGearSummary(gear) {
  return `Helmet ${gear.helmet} • Jacket ${gear.jacket} • Gloves ${gear.gloves} • Shoes ${gear.shoes}`;
}

export function bindGlobalNavigation() {
  safeOnClick(PKL_IDS.shell.navHome, () => navigate(PKL_ROUTES.home));
  safeOnClick(PKL_IDS.shell.navCharacter, () => navigate(PKL_ROUTES.character));
  safeOnClick(PKL_IDS.shell.navGarage, () => navigate(PKL_ROUTES.garage));
  safeOnClick(PKL_IDS.shell.navMap, () => navigate(PKL_ROUTES.map));
  safeOnClick(PKL_IDS.shell.navPlay, () => navigate(PKL_ROUTES.play));
}

export function bindHomeScreen() {
  safeOnClick(PKL_IDS.home.start, () => navigate(PKL_ROUTES.character));
  safeOnClick(PKL_IDS.home.continueBtn, () => navigate(PKL_ROUTES.map));
}

export function bindCharacterScreen() {
  const renderCharacterPreview = (profile) => {
    const { gender, gear } = profile.character;
    safeText(PKL_IDS.character.previewTitle, `Rider ${gender === "male" ? "Male" : "Female"}`);
    safeText(PKL_IDS.character.previewStats, formatGearSummary(gear));
  };

  const updateGender = (gender) => {
    const next = patchProfile({ character: { gender } });
    renderCharacterPreview(next);
  };
  safeOnClick(PKL_IDS.character.maleCard, () => updateGender("male"));
  safeOnClick(PKL_IDS.character.femaleCard, () => updateGender("female"));

  const bumpGear = (slot, dir) => {
    const profile = getProfile();
    const current = profile.character.gear[slot] || 0;
    const next = Math.max(0, Math.min(GEAR_LIMITS[slot], current + dir));
    const updated = patchProfile({ character: { gear: { [slot]: next } } });
    renderCharacterPreview(updated);
  };

  safeOnClick(PKL_IDS.character.helmetLeft, () => bumpGear("helmet", -1));
  safeOnClick(PKL_IDS.character.helmetRight, () => bumpGear("helmet", 1));
  safeOnClick(PKL_IDS.character.jacketLeft, () => bumpGear("jacket", -1));
  safeOnClick(PKL_IDS.character.jacketRight, () => bumpGear("jacket", 1));
  safeOnClick(PKL_IDS.character.glovesLeft, () => bumpGear("gloves", -1));
  safeOnClick(PKL_IDS.character.glovesRight, () => bumpGear("gloves", 1));
  safeOnClick(PKL_IDS.character.shoesLeft, () => bumpGear("shoes", -1));
  safeOnClick(PKL_IDS.character.shoesRight, () => bumpGear("shoes", 1));

  renderCharacterPreview(getProfile());
  safeOnClick(PKL_IDS.character.saveBtn, () => navigate(PKL_ROUTES.garage));
}

export function bindGarageScreen() {
  const profile = getProfile();
  let selectedBikeId = profile.bike.id;
  const repeater = hasElement(PKL_IDS.garage.repeater) ? $w(PKL_IDS.garage.repeater) : null;

  const renderBikePreview = (bike) => {
    safeText(PKL_IDS.garage.previewName, bike.name);
    safeText(PKL_IDS.garage.previewMeta, `${bike.handling} • ${bike.tier} • ${bike.description}`);
    safeText(PKL_IDS.garage.selectedChip, `Selected: ${bike.name}`);
    safeImage(PKL_IDS.garage.previewImage, bike.image);
  };

  if (repeater && typeof repeater.onItemReady === "function") {
    repeater.data = GARAGE_BIKES.map((bike) => ({
      ...bike,
      _id: bike.id,
    }));

    repeater.onItemReady(($item, itemData) => {
      if (itemHas($item, "#txtBikeCardName")) {
        $item("#txtBikeCardName").text = itemData.name;
      }
      if (itemHas($item, "#txtBikeCardMeta")) {
        $item("#txtBikeCardMeta").text = `${itemData.handling} • ${itemData.tier}`;
      }
      if (itemHas($item, "#btnBikeCardSelect")) {
        $item("#btnBikeCardSelect").label =
          selectedBikeId === itemData.id ? "Selected" : "Choose";
        $item("#btnBikeCardSelect").onClick(() => {
          selectedBikeId = itemData.id;
          renderBikePreview(itemData);
          repeater.data = [...repeater.data];
        });
      }
    });
  } else if (repeater) {
    console.warn(
      `[PKL] ${PKL_IDS.garage.repeater} is not a Repeater. Check the element ID in Wix Editor.`
    );
  }

  const initialBike = GARAGE_BIKES.find((bike) => bike.id === selectedBikeId) || GARAGE_BIKES[0];
  renderBikePreview(initialBike);

  safeOnClick(PKL_IDS.garage.selectBtn, () => {
    const selected = GARAGE_BIKES.find((bike) => bike.id === selectedBikeId) || GARAGE_BIKES[0];
    patchProfile({ bike: selected });
    navigate(PKL_ROUTES.map);
  });
}

export function bindMapScreen() {
  const renderZone = (zone, zoneData) => {
    safeText(PKL_IDS.map.detailTitle, zoneData.title);
    safeText(PKL_IDS.map.detailBody, zoneData.body);
    safeText(PKL_IDS.map.detailMeta, zoneData.meta || "");
    safeButtonLabel(PKL_IDS.map.startBtn, `Start Run (${zone})`);
    safeShow(PKL_IDS.map.detailBox);
  };

  const chooseZone = (zone) => {
    const zoneData = MAP_ZONES[zone];
    const profile = getProfile();
    const unlocked = new Set(profile.map.unlockedZones || ["A"]);
    unlocked.add(zone);
    patchProfile({ map: { selectedZone: zone, unlockedZones: [...unlocked] } });
    renderZone(zone, zoneData);
  };

  safeOnClick(PKL_IDS.map.hotspotA, () => chooseZone("A"));
  safeOnClick(PKL_IDS.map.hotspotB, () => chooseZone("B"));
  safeOnClick(PKL_IDS.map.hotspotC, () => chooseZone("C"));

  const profile = getProfile();
  const initialZone = profile.map.selectedZone || "A";
  renderZone(initialZone, MAP_ZONES[initialZone]);

  safeOnClick(PKL_IDS.map.startBtn, () => navigate(PKL_ROUTES.play));
}

function bindHold(selector, onChange) {
  if (!hasElement(selector)) {
    return;
  }
  const element = $w(selector);
  const pressed = () => onChange(true);
  const released = () => onChange(false);

  if (typeof element.onMouseDown === "function") {
    element.onMouseDown(pressed);
  }
  if (typeof element.onMouseUp === "function") {
    element.onMouseUp(released);
  }
  if (typeof element.onMouseOut === "function") {
    element.onMouseOut(released);
  }
  if (typeof element.onTouchStart === "function") {
    element.onTouchStart(pressed);
  }
  if (typeof element.onTouchEnd === "function") {
    element.onTouchEnd(released);
  }
}

function bindSteerPad(selector, onSteer) {
  if (!hasElement(selector)) {
    return;
  }
  const element = $w(selector);
  const toSteer = (event) => {
    const relX = event?.offsetX ?? event?.x ?? 0;
    const width = element?.renderedWidth || 240;
    const normalized = ((relX / width) * 2 - 1) || 0;
    onSteer(Math.max(-1, Math.min(1, normalized)));
  };

  if (typeof element.onMouseMove === "function") {
    element.onMouseMove(toSteer);
  }
  if (typeof element.onMouseOut === "function") {
    element.onMouseOut(() => onSteer(0));
  }
  if (typeof element.onTouchMove === "function") {
    element.onTouchMove(toSteer);
  }
  if (typeof element.onTouchEnd === "function") {
    element.onTouchEnd(() => onSteer(0));
  }
}

export function bindPlayScreen() {
  const hasPlaySurface =
    hasElement(PKL_IDS.play.steerPad) ||
    hasElement(PKL_IDS.play.throttleBtn) ||
    hasElement(PKL_IDS.play.htmlComponent);
  if (!hasPlaySurface) {
    return;
  }

  const profile = getProfile();
  const gameplay = createGameplayController({
    $w,
    ids: PKL_IDS.play,
    profile,
    onBackToMap: () => navigate(PKL_ROUTES.map),
    onStatus: (status) => {
      const html = hasElement(PKL_IDS.play.htmlComponent) ? $w(PKL_IDS.play.htmlComponent) : null;
      if (html && typeof html.postMessage === "function") {
        html.postMessage({ type: "status", payload: { status } });
      }
    },
    onTelemetry: (telemetry) => {
      const html = hasElement(PKL_IDS.play.htmlComponent) ? $w(PKL_IDS.play.htmlComponent) : null;
      if (html && typeof html.postMessage === "function") {
        html.postMessage({ type: "telemetry", payload: telemetry });
      }
    },
  });

  bindHold(PKL_IDS.play.throttleBtn, (pressed) => gameplay.setControl("throttle", pressed));
  bindHold(PKL_IDS.play.brakeBtn, (pressed) => gameplay.setControl("brake", pressed));
  bindHold(PKL_IDS.play.clutchBtn, (pressed) => gameplay.setControl("clutch", pressed));
  bindSteerPad(PKL_IDS.play.steerPad, (steer) => gameplay.setSteer(steer));

  safeOnClick(PKL_IDS.play.wheelieBtn, () => gameplay.trick("wheelie"));
  safeOnClick(PKL_IDS.play.driftBtn, () => gameplay.trick("drift"));
  safeOnClick(PKL_IDS.play.stoppieBtn, () => gameplay.trick("stoppie"));
  safeOnClick(PKL_IDS.play.kneeDownBtn, () => gameplay.trick("kneeDown"));
  safeOnClick(PKL_IDS.play.retryBtn, () => gameplay.restart());
  safeOnClick(PKL_IDS.play.backToMapBtn, () => gameplay.backToMap());

  if (hasElement(PKL_IDS.play.htmlComponent)) {
    const html = $w(PKL_IDS.play.htmlComponent);
    if (typeof html.onMessage === "function") {
      html.onMessage((event) => {
        const type = event?.data?.type;
        const payload = event?.data?.payload || {};
        if (type === "ready" && typeof html.postMessage === "function") {
          html.postMessage({
            type: "init",
            payload: {
              bike: profile.bike,
              zone: profile.map?.selectedZone || "A",
              rider: profile.character,
            },
          });
        }
        if (type === "steer") {
          gameplay.setSteer(payload.value || 0);
        }
        if (type === "trick") {
          gameplay.trick(payload.name);
        }
      });
    }
  }

  gameplay.boot();
}

export function showSimpleToast(message) {
  if (wixWindow.formFactor === "Mobile") {
    console.log(`[PKL-MOBILE] ${message}`);
    return;
  }
  console.log(`[PKL] ${message}`);
}
