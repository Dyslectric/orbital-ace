import { BlurFilter, Container, Rectangle, RenderTexture, Renderer, Sprite, Texture } from "pixi.js";
import { get_game_height, get_game_width } from "../util";
import { RenderObj } from "..";

export const BackgroundBlur = (renderer: Renderer, background: Container, blurMask: Container): RenderObj => {
    const width = get_game_width();
    const height = get_game_height();
    const frame = new Rectangle(0, 0, width, height);
    const filter = new BlurFilter({ strength: 5 });

    const sprite = new Sprite({
        texture: renderer.generateTexture({
            target: background,
            frame,
        }),
    });

    sprite.filters = [filter];

    const container = new Container({
        children: [sprite],
    });

    container.mask = blurMask;

    const update = () => {
        const width = get_game_width();
        const height = get_game_height();
        frame.width = width;
        frame.height = height;

        sprite.texture.destroy(true);
        //console.log(sprite.texture.destroyed);
        sprite.texture = renderer.generateTexture({
            target: background,
            frame,
        });

        //sprite.texture.source.unload();
        //sprite.texture.destroy();
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
