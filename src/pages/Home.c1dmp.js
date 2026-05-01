import { bindGlobalNavigation, bindHomeScreen, showSimpleToast } from "public/pkl-ui";
import { getProfile } from "public/pkl-state";

$w.onReady(function () {
  bindGlobalNavigation();
  bindHomeScreen();

  const profile = getProfile();
  if (!profile.progression.onboardingComplete) {
    showSimpleToast("Welcome to PKL. Build your rider and choose your bike.");
  }
});
