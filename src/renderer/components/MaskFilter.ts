import { Container, Filter, Rectangle, Renderer, Sprite } from "pixi.js";
import { RenderObj } from "..";

export const MaskFilter = (renderer: Renderer, mask: Sprite, filters: Filter[], background: Container): RenderObj => {
    const sprite = new Sprite({
        texture: renderer.generateTexture({
            target: background,
            frame: new Rectangle(mask.x, mask.y, mask.width, mask.height),
        }),
        x: mask.x,
        y: mask.y,
    });
    sprite.filters = filters;

    const update = () => {
        sprite.texture.source.destroy();
        sprite.texture = renderer.generateTexture({
            target: background,
            frame: new Rectangle(mask.x, mask.y, mask.width, mask.height),
        });
        sprite.x = mask.x;
        sprite.y = mask.y;
    };

    const destroy = () => {
        sprite.destroy({ children: true });
    };

    return {
        container: sprite,
        update,
        destroy,
    };
};
