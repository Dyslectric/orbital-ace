import { Container } from "pixi.js";
import { get_game_scale } from "../util";
import { RenderObj } from "..";

export const Scaler = (scale: number, children?: Container[]): RenderObj => {
    const container = new Container({ scale, children });
    const update = () => {
        const scale = get_game_scale();
        container.scale.set(scale);
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
