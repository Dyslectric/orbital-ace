import { Container as PixiContainer, Application as PixiApp } from "pixi.js";
import { GameState, ViewMode } from "../types";
import { Ui } from "./components/Ui";
import { SpaceBackground } from "./components/SpaceBackground";
import { Planets } from "./components/Planets";
import { Sun } from "./components/Sun";

export type RenderObj = {
    container: PixiContainer;
    update: () => void;
    destroy: () => void;
};

export type GameRenderer = {
    update: () => void;
    destroy: () => void;
};

export type RenderState = {
    gameZoom: number;
};

export const createGameRenderer = (app: PixiApp, gameState: GameState): GameRenderer => {
    let lastTickViewMode = gameState.viewMode;
    let zoomAnimationProgress = 0.0;

    const getZoom = () => {
        switch (gameState.viewMode) {
            case ViewMode.Interplanetary:
                return 0.25 + zoomAnimationProgress * 2.75;
            case ViewMode.Fleet:
                return 3.0 - zoomAnimationProgress * 2.75;
        }
    };

    let renderState: RenderState = {
        gameZoom: getZoom(),
    };

    const bg = SpaceBackground({ gameState: gameState, renderState });
    const planets = Planets({ gameState: gameState, renderState });
    const sun = Sun({ gameState: gameState, renderState });

    const worldLayer = new PixiContainer({
        children: [bg.container, planets.container, sun.container],
    });

    const ui = Ui(app.renderer, worldLayer, gameState);

    const container = new PixiContainer({
        children: [worldLayer, ui.container],
    });

    app.stage.addChild(container);

    const update = () => {
        if (gameState.viewMode != lastTickViewMode) {
            lastTickViewMode = gameState.viewMode;
            //animationProgress = 1.0;
            zoomAnimationProgress = 1.0 - zoomAnimationProgress;
        }
        if (zoomAnimationProgress > 0) {
            zoomAnimationProgress -= 0.01;
            if (zoomAnimationProgress < 0) {
                zoomAnimationProgress = 0;
            }
        }

        renderState.gameZoom = getZoom();

        ui.update();
        planets.update();
        sun.update();
        bg.update();
    };

    const destroy = () => {
        container.destroy({ children: true });
    };

    return {
        update,
        destroy,
    };
};
