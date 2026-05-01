import wixLocation from "wix-location";
import wixWindow from "wix-window";
import {
  PKL_IDS,
  PKL_ROUTES,
  GARAGE_BIKES,
  MAP_ZONES,
} from "public/pkl-config";
import { getProfile, patchProfile } from "public/pkl-state";

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
  $w(selector).onClick(handler);
}

function safeText(selector, value) {
  if (!hasElement(selector)) {
    return;
  }
  $w(selector).text = value;
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
  const updateGender = (gender) => {
    patchProfile({ character: { gender } });
    safeText(PKL_IDS.home.subtitle, `Rider: ${gender}`);
  };
  safeOnClick(PKL_IDS.character.maleCard, () => updateGender("male"));
  safeOnClick(PKL_IDS.character.femaleCard, () => updateGender("female"));

  const bumpGear = (slot, dir) => {
    const profile = getProfile();
    const current = profile.character.gear[slot] || 0;
    const next = Math.max(0, Math.min(5, current + dir));
    patchProfile({ character: { gear: { [slot]: next } } });
  };

  safeOnClick(PKL_IDS.character.helmetLeft, () => bumpGear("helmet", -1));
  safeOnClick(PKL_IDS.character.helmetRight, () => bumpGear("helmet", 1));
  safeOnClick(PKL_IDS.character.jacketLeft, () => bumpGear("jacket", -1));
  safeOnClick(PKL_IDS.character.jacketRight, () => bumpGear("jacket", 1));
  safeOnClick(PKL_IDS.character.glovesLeft, () => bumpGear("gloves", -1));
  safeOnClick(PKL_IDS.character.glovesRight, () => bumpGear("gloves", 1));
  safeOnClick(PKL_IDS.character.shoesLeft, () => bumpGear("shoes", -1));
  safeOnClick(PKL_IDS.character.shoesRight, () => bumpGear("shoes", 1));

  safeOnClick(PKL_IDS.character.saveBtn, () => navigate(PKL_ROUTES.garage));
}

export function bindGarageScreen() {
  const profile = getProfile();
  let selectedBikeId = profile.bike.id;

  if (hasElement(PKL_IDS.garage.repeater)) {
    $w(PKL_IDS.garage.repeater).data = GARAGE_BIKES.map((bike) => ({
      ...bike,
      _id: bike.id,
    }));

    $w(PKL_IDS.garage.repeater).onItemReady(($item, itemData) => {
      if (itemHas($item, "#txtBikeCardName")) {
        $item("#txtBikeCardName").text = itemData.name;
      }
      if (itemHas($item, "#txtBikeCardMeta")) {
        $item("#txtBikeCardMeta").text = `${itemData.handling} • ${itemData.tier}`;
      }
      if (itemHas($item, "#btnBikeCardSelect")) {
        $item("#btnBikeCardSelect").onClick(() => {
          selectedBikeId = itemData.id;
          safeText(PKL_IDS.garage.previewName, itemData.name);
          safeText(PKL_IDS.garage.previewMeta, `${itemData.handling} • ${itemData.tier}`);
        });
      }
    });
  }

  safeOnClick(PKL_IDS.garage.selectBtn, () => {
    const selected = GARAGE_BIKES.find((bike) => bike.id === selectedBikeId) || GARAGE_BIKES[0];
    patchProfile({ bike: selected });
    navigate(PKL_ROUTES.map);
  });
}

export function bindMapScreen() {
  const chooseZone = (zone) => {
    const zoneData = MAP_ZONES[zone];
    patchProfile({ map: { selectedZone: zone } });
    safeText(PKL_IDS.map.detailTitle, zoneData.title);
    safeText(PKL_IDS.map.detailBody, zoneData.body);
  };

  safeOnClick(PKL_IDS.map.hotspotA, () => chooseZone("A"));
  safeOnClick(PKL_IDS.map.hotspotB, () => chooseZone("B"));
  safeOnClick(PKL_IDS.map.hotspotC, () => chooseZone("C"));

  safeOnClick(PKL_IDS.map.startBtn, () => navigate(PKL_ROUTES.play));
}

export function showSimpleToast(message) {
  if (wixWindow.formFactor === "Mobile") {
    console.log(`[PKL-MOBILE] ${message}`);
    return;
  }
  console.log(`[PKL] ${message}`);
}
