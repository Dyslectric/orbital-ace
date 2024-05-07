import { Container, Renderer } from "pixi.js";
import { PlayerPanel } from "./PlayerPanel";
import { BackgroundBlur } from "../BackgroundBlur";
import { Hotbar } from "./Hotbar";
import { Compass } from "./Compass";
import { SpaceViewState } from "../../../types";
import { MaskFilter } from "../MaskFilter";

export const Ui = (
    renderer: Renderer,
    background: Container,
): {
    container: Container;
    update: (state: SpaceViewState) => void;
} => {
    const uiUnselectedColor = "#111a2180";
    const uiColor = "#11263198";
    const compassFront = "#20103148";
    //const uiSelectedColor = "#207b5c80"
    const playerPanel = PlayerPanel(20, 20, 240, 50, 16, uiColor);
    const hotbar = Hotbar(30, 8, 12, 12, uiUnselectedColor, uiColor);
    // compass has compass radius, shadow radius
    const compass = Compass(renderer, 64, 76, 10, 10, compassFront);
    const compassShadow = MaskFilter(renderer, compass.shadowMask, [compass.shadowMaskFilter], background);
    const blurMask = new Container({
        children: [playerPanel.blurMask, hotbar.blurMask, compass.blurMask],
    });
    const hudBlur = BackgroundBlur(renderer, background, blurMask);
    const container = new Container({
        children: [
            blurMask,
            hudBlur.container,
            playerPanel.render,
            hotbar.container,
            compassShadow.container,
            compass.render,
        ],
    });
    const update = (state: SpaceViewState) => {
        hotbar.update(state.hotbar_selection);
        compass.update();
        hudBlur.update();
        compassShadow.update();
    };
    return {
        container,
        update,
    };
};
