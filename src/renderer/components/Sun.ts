import { RenderObj, RenderState } from "../";
import { Container, Sprite, Texture } from "pixi.js";
import { PlanetEntity, PlanetType, GameState, ViewMode } from "../../types";
import { get_game_height, get_game_width } from "../util";

export type SunOpts = {
    gameState: GameState;
    renderState: RenderState;
};

export const Sun = (opts: SunOpts): RenderObj => {
    const texture = Texture.from("assets/sun.png");
    const sprite = new Sprite({ texture, width: 128, height: 128, anchor: 0.5 });
    const container = new Container({ children: [sprite] });

    const update = () => {
        const { gameState: state, renderState } = opts;
        const { gameZoom: zoom } = renderState;
        const screenCenterX = get_game_width() / 2;
        const screenCenterY = get_game_height() / 2;

        const x = -state.cameraPosition.x * zoom + screenCenterX;
        const y = -state.cameraPosition.y * zoom + screenCenterY;

        sprite.position.set(x, y);
        sprite.setSize(128 + zoom * (512 - 128));
    };

    update();

    const destroy = () => {
        container.destroy({ children: true });
    };

    return {
        container,
        update,
        destroy,
    };
};
