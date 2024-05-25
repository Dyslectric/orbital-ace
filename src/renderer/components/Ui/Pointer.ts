import { Sprite, Texture } from "pixi.js";
import { get_game_scale } from "../../util";
import { RenderObj } from "../..";
import { GameState } from "../../../types";

export const Pointer = (pointerCoords: { x: number; y: number }): RenderObj => {
    const scale = get_game_scale();
    const texture = Texture.from("assets/pointer.png");
    const sprite = new Sprite({ x: pointerCoords.x / scale, y: pointerCoords.y / scale, texture });
    const update = () => {
        const scale = get_game_scale();
        sprite.position.set(pointerCoords.x / scale, pointerCoords.y / scale);
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
