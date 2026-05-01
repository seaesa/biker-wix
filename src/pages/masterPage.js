import {
  bindGlobalNavigation,
  bindCharacterScreen,
  bindGarageScreen,
  bindMapScreen,
} from "public/pkl-ui";

$w.onReady(function () {
  bindGlobalNavigation();
  bindCharacterScreen();
  bindGarageScreen();
  bindMapScreen();
});
