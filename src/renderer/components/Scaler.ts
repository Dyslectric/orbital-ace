import { Container } from "pixi.js";

export const Scaler = (
    scale: number,
    children?: Container[],
): {
    container: Container;
    update: (scale: number) => void;
} => {
    const container = new Container({ scale, children });
    const update = (scale: number) => {
        container.scale.set(scale);
    };
    return {
        container,
        update,
    };
};
