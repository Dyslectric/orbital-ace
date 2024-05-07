import { Container, Renderer } from "pixi.js";
import { SpaceView } from "./components/SpaceView";
import { SpaceViewState } from "../types";

export const SpaceViewRenderer = (
    renderer: Renderer,
    container: Container,
    state: SpaceViewState,
): {
    render: (state: SpaceViewState) => void;
    destroy: () => void;
} => {
    const spaceView = SpaceView(renderer, state);
    container.addChild(spaceView.container);

    const render = (state: SpaceViewState) => {
        const canvas = document.getElementById("game-canvas");
        if (canvas) {
            console.log("found it");
            //document.body.removeChild(canvas);
            canvas.style.removeProperty("cursor");
            canvas.style.setProperty("cursor", "none");
            //document.body.appendChild(canvas);
        }
        spaceView.update(state);
    };

    const destroy = () => {
        spaceView.container.destroy({ children: true });
    };

    return {
        render,
        destroy,
    };
};
