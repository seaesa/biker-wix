import {
  bindGlobalNavigation,
  bindCharacterScreen,
  bindGarageScreen,
  bindMapScreen,
  bindPlayScreen,
} from "public/pkl-ui";

$w.onReady(function () {
  bindGlobalNavigation();
  bindCharacterScreen();
  bindGarageScreen();
  bindMapScreen();
  bindPlayScreen();
});
