//import { KawaseBlurFilter } from "pixi-filters";
import { BlurFilter, Container, Renderer, Sprite } from "pixi.js";
//import { get_game_height, get_game_width } from "../util";

export const BackgroundBlur = (
    renderer: Renderer,
    background: Container,
    blurMask: Container,
): {
    container: Container;
    update: () => void;
} => {
    const sprite = new Sprite(renderer.generateTexture(background));
    sprite.mask = blurMask;
    sprite.filters = new BlurFilter();

    const update = () => {
        sprite.texture.source.destroy();
        sprite.texture = renderer.generateTexture(background);
    };

    return {
        container: sprite,
        update,
    };
};
