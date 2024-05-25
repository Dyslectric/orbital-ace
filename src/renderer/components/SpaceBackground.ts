import { BlurFilter, Container, Graphics, Texture, TilingSprite } from "pixi.js";
//import { game_consts } from "../../../const";
import { RenderObj, RenderState } from "..";
import { GameState, ViewMode } from "../../types";
import { get_game_height, get_game_width } from "../util";

export type SpaceBackgroundOpts = {
    gameState: GameState;
    renderState: RenderState;
};

export const SpaceBackground = (opts: SpaceBackgroundOpts): RenderObj => {
    const width = get_game_width();
    const height = get_game_height();
    const starfieldTexture = Texture.from("assets/bgs/1024/Starfields/Starfield_01-1024x1024.png");
    const nebulaTexture = Texture.from("assets/bgs/1024/Purple Nebula/Purple_Nebula_01-1024x1024.png");

    const createTilingSprite = (texture: Texture, alpha: number = 1) => {
        const { gameState: state, renderState } = opts;
        const { gameZoom: zoom } = renderState;

        return TilingSprite.from(texture, {
            tilePosition: {
                x: width / 2 - state.cameraPosition.x * zoom,
                y: height / 2 - state.cameraPosition.y * zoom,
            },
            alpha,
            width,
            height,
            tileScale: { x: zoom, y: zoom },
            anchor: { x: 0.5, y: 0.5 },
        });
    };

    const starfield = createTilingSprite(starfieldTexture);
    const nebula = createTilingSprite(nebulaTexture, 0.5);

    const container = new Container({ children: [starfield, nebula], x: width / 2, y: height / 2 });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const update = () => {
        const { gameState: state, renderState } = opts;
        const { gameZoom: zoom } = renderState;

        const width = get_game_width();
        const height = get_game_height();

        const nebulaX = width / 2 - state.cameraPosition.x * zoom;
        const nebulaY = height / 2 - state.cameraPosition.y * zoom;
        const starfieldX = width / 2 - (state.cameraPosition.x * zoom) / 2;
        const starfieldY = height / 2 - (state.cameraPosition.y * zoom) / 2;

        starfield.tilePosition.set(starfieldX, starfieldY);
        nebula.tilePosition.set(nebulaX, nebulaY);
        starfield.tileScale.set(zoom, zoom);
        nebula.tileScale.set(zoom, zoom);
        starfield.width = width;
        starfield.height = height;
        nebula.width = width;
        nebula.height = height;
        container.x = width / 2;
        container.y = height / 2;
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
