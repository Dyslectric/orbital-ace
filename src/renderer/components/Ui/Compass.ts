import { Container, Filter, Graphics, GraphicsPath, Renderer, Sprite } from "pixi.js";
import { get_game_height } from "../../util";
import { ColorGradientFilter } from "pixi-filters";
import { colors } from "./colors";

export const Compass = (
    renderer: Renderer,
    radius_compass: number,
    radius_shadow: number,
    padding_left: number,
    padding_bottom: number,
): {
    render: Container;
    blurMask: Container;
    shadowMask: Sprite;
    shadowMaskFilter: Filter;
    update: () => void;
} => {
    const height = get_game_height();
    const x = padding_left;
    const y = height - padding_bottom - 2 * radius_shadow;

    const compassShadowArea = new GraphicsPath().circle(radius_shadow, radius_shadow, radius_shadow);
    const compassArea = new GraphicsPath().circle(radius_shadow, radius_shadow, radius_compass);

    const shadowMaskGraphic = new Graphics({ x, y }).path(compassShadowArea).fill({ color: "#fff" });

    const shadowMask = new Sprite({
        texture: renderer.generateTexture(shadowMaskGraphic),
        x,
        y,
    });

    const shadowMaskFilter = new ColorGradientFilter({
        type: 1, // Radial
        alpha: 0.75,
        replace: true,
        stops: [
            {
                alpha: 1.0,
                offset: 0.0,
                color: "#000",
            },
            {
                alpha: 1.0,
                offset: 0.75,
                color: "#000",
            },
            {
                alpha: 1.0,
                offset: 0.8,
                color: colors.compassBack,
            },
            {
                alpha: 0.0,
                offset: 0.88,
                color: colors.compassBack,
            },
            {
                alpha: 0.0,
                offset: 1.0,
                color: colors.compassBack,
            },
        ],
    });

    const compassGlassEdgeShine = new ColorGradientFilter({
        type: 1, // Radial
        alpha: 1.0,
        replace: false,
        stops: [
            {
                alpha: 0.0,
                offset: 0.0,
                color: "#fff",
            },
            {
                alpha: 0.0,
                offset: 0.75,
                color: "#fff",
            },
            {
                alpha: 0.3,
                offset: 0.92,
                color: "#fff",
            },
            {
                alpha: 1.0,
                offset: 1.0,
                color: colors.compassBack,
            },
        ],
    });

    const compassGlass = new Graphics({ x, y }).path(compassArea).fill({ color: "#00000040" });
    compassGlass.filters = compassGlassEdgeShine;

    const blurMask = new Graphics({ x, y }).path(compassArea).fill({ color: "#fff" });

    //const render = new Container({
    //    children: [compassGlass],
    //});

    const update = () => {
        const height = get_game_height();
        const y = height - padding_bottom - 2 * radius_shadow;
        shadowMask.y = y;
        compassGlass.y = y;
        blurMask.y = y;
    };

    return {
        render: compassGlass,
        blurMask,
        shadowMask,
        shadowMaskFilter,
        update,
    };
};
