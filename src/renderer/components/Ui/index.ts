import { Container, Renderer } from "pixi.js";
import { PlayerPanel } from "./PlayerPanel";
import { BackgroundBlur } from "../BackgroundBlur";
import { Hotbar } from "./Hotbar";
import { Compass } from "./Compass";
import { Pointer } from "./Pointer";
import { SpaceViewState } from "../../../types";
import { MaskFilter } from "../MaskFilter";

export const Ui = (
    renderer: Renderer,
    background: Container,
    mouse_x: number,
    mouse_y: number,
): {
    container: Container;
    update: (state: SpaceViewState) => void;
} => {
    //const uiSelectedColor = "#207b5c80"
    const playerPanel = PlayerPanel(20, 20, 240, 50, 16);
    const hotbar = Hotbar(30, 8, 12, 12);
    // compass has compass radius, shadow radius
    const compass = Compass(renderer, 63, 74, 10, 10);
    const compassShadow = MaskFilter(renderer, compass.shadowMask, [compass.shadowMaskFilter], background);
    const blurMask = new Container({
        children: [playerPanel.blurMask, hotbar.blurMask, compass.blurMask],
    });
    const hudBlur = BackgroundBlur(renderer, background, blurMask);
    const pointer = Pointer(mouse_x, mouse_y);
    const container = new Container({
        children: [
            blurMask,
            hudBlur.container,
            playerPanel.render,
            hotbar.container,
            compassShadow.container,
            compass.render,
            pointer.render,
        ],
    });
    const update = (state: SpaceViewState) => {
        hotbar.update(state.hotbar_selection);
        compass.update();
        hudBlur.update();
        compassShadow.update();
        pointer.update(state.mouse_x, state.mouse_y);
    };
    return {
        container,
        update,
    };
};
