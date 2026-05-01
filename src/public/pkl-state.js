import { local, memory } from "wix-storage";
import { DEFAULT_PROFILE } from "./pkl-config";

const PROFILE_KEY = "pkl.profile.v1";

function cloneDefaultProfile() {
  return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
}

function mergeDeep(base, patch) {
  if (!patch || typeof patch !== "object") {
    return base;
  }
  const out = Array.isArray(base) ? [...base] : { ...base };
  Object.keys(patch).forEach((key) => {
    const value = patch[key];
    if (Array.isArray(value)) {
      out[key] = [...value];
      return;
    }
    if (value && typeof value === "object") {
      out[key] = mergeDeep(base?.[key] || {}, value);
      return;
    }
    out[key] = value;
  });
  return out;
}

export function getProfile() {
  const saved = local.getItem(PROFILE_KEY);
  if (!saved) {
    return cloneDefaultProfile();
  }
  try {
    const parsed = JSON.parse(saved);
    return mergeDeep(cloneDefaultProfile(), parsed);
  } catch (error) {
    console.warn("[PKL] invalid profile in storage; resetting", error);
    return cloneDefaultProfile();
  }
}

export function setProfile(nextProfile) {
  const merged = mergeDeep(cloneDefaultProfile(), nextProfile || {});
  local.setItem(PROFILE_KEY, JSON.stringify(merged));
  return merged;
}

export function patchProfile(patch) {
  const current = getProfile();
  const next = mergeDeep(current, patch);
  local.setItem(PROFILE_KEY, JSON.stringify(next));
  return next;
}

export function clearProfile() {
  local.removeItem(PROFILE_KEY);
}

export function setSessionFlag(flag, value) {
  memory.setItem(`pkl.session.${flag}`, JSON.stringify(Boolean(value)));
}

export function getSessionFlag(flag) {
  const raw = memory.getItem(`pkl.session.${flag}`);
  return raw ? JSON.parse(raw) : false;
}
