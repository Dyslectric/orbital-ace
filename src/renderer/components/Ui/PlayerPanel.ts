//import { BackdropBlurFilter } from "pixi-filters";
import { Container, Graphics, GraphicsPath } from "pixi.js";

export const PlayerPanel = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    color: string,
): {
    render: Container;
    blurMask: Container;
} => {
    const area = new GraphicsPath()
        .lineTo(width - radius, 0)
        .arc(width - radius, radius, radius, Math.PI * 1.5, Math.PI * 0.0, false)
        .lineTo(width, height)
        .lineTo(radius, height)
        .arc(radius, height - radius, radius, Math.PI * 0.5, Math.PI * 1.0, false)
        .lineTo(0, 0)
        //.fill({ color: "#ffffffff" })
        .closePath();

    const render = new Graphics({ x, y }).path(area).fill({ color });
    const blurMask = new Graphics({ x, y }).path(area).fill({ color: "#fff" });
    //blur_mask.x = x;
    //blur_mask.y = y;
    //blur_mask.fill({ color: "#fff" });

    return {
        render,
        blurMask,
    };
};
