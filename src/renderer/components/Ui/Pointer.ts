import { Sprite, Texture } from "pixi.js";
import { get_game_scale } from "../../util";

export const Pointer = (
    x: number,
    y: number,
): {
    render: Sprite;
    update: (x: number, y: number) => void;
} => {
    const scale = get_game_scale();
    const texture = Texture.from("assets/pointer.png");
    const sprite = new Sprite({ x: x / scale, y: y / scale, texture });

    const update = (x: number, y: number) => {
        const scale = get_game_scale();
        sprite.position.set(x / scale, y / scale);
    };

    return {
        render: sprite,
        update,
    };
};
