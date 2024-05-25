import { Container, Renderer } from "pixi.js";
import { PlayerPanel } from "./PlayerPanel";
import { BackgroundBlur } from "../BackgroundBlur";
import { Hotbar } from "./Hotbar";
import { Compass } from "./Compass";
import { Pointer } from "./Pointer";
import { GameState } from "../../../types";
import { MaskFilter } from "../MaskFilter";
import { RenderObj } from "../..";

export const Ui = (renderer: Renderer, background: Container, state: GameState): RenderObj => {
    const playerPanel = PlayerPanel(20, 20, 240, 50, 16);
    const hotbar = Hotbar(30, 8, 12, 12, state);
    // compass has compass radius, shadow radius
    const compass = Compass(renderer, 63, 76, 10, 10);
    //const compassShadow = MaskFilter(renderer, compass.shadowMask, [compass.shadowMaskFilter], background);
    const blurMask = new Container({
        children: [playerPanel.blurMask, hotbar.blurMask, compass.blurMask],
    });
    const hudBlur = BackgroundBlur(renderer, background, blurMask);
    const pointer = Pointer(state.pointerCoords);

    const container = new Container({
        children: [
            blurMask,
            hudBlur.container,
            playerPanel.renderObj.container,
            hotbar.renderObj.container,
            //compassShadow.container,
            compass.renderObj.container,
            pointer.container,
        ],
    });

    const update = () => {
        // disable mouse cursor on canvas element
        const canvas = document.getElementById("game-canvas");
        canvas?.style.setProperty("cursor", "none");

        playerPanel.renderObj.update();
        hotbar.renderObj.update();
        compass.renderObj.update();
        //compassShadow.update();
        hudBlur.update();
        pointer.update();
    };

    const destroy = () => {
        container.destroy({ children: true });
    };

    return {
        container,
        update,
        destroy,
    };
};
