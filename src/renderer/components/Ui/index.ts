import { Container, Renderer } from "pixi.js";
import { PlayerPanel } from "./PlayerPanel";
import { BackgroundBlur } from "../BackgroundBlur";
import { Hotbar } from "./Hotbar";

export const Ui = (
    renderer: Renderer,
    background: Container,
): {
    container: Container;
    update: () => void;
} => {
    const uiColor = "#111a2180";
    const playerPanel = PlayerPanel(30, 30, 300, 60, 24, uiColor);
    const hotbar = Hotbar(36, 12, 12, 16, uiColor);
    const blurMask = new Container({
        children: [playerPanel.blurMask, hotbar.blurMask],
    });
    const hudBlur = BackgroundBlur(renderer, background, blurMask);
    const container = new Container({
        children: [blurMask, hudBlur.container, playerPanel.render, hotbar.container],
    });
    const update = () => {
        hudBlur.update();
        hotbar.update();
    };
    return {
        container,
        update,
    };
};
