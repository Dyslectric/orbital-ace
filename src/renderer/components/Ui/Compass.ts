import { Container, Filter, Graphics, GraphicsPath, Renderer, Sprite } from "pixi.js";
import { get_game_height } from "../../util";
import { ColorGradientFilter } from "pixi-filters";
import { colors } from "./colors";
import { RenderObj } from "../..";

export const Compass = (
    renderer: Renderer,
    radius_compass: number,
    radius_shadow: number,
    padding_left: number,
    padding_bottom: number,
): {
    renderObj: RenderObj;
    blurMask: Container;
    shadowMask: Sprite;
    shadowMaskFilter: Filter;
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
        alpha: 1.0,
        replace: true,
        stops: [
            {
                alpha: 0.8,
                offset: 0.0,
                color: "#040004",
            },
            {
                alpha: 0.8,
                offset: 0.75,
                color: "#040004",
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
                offset: 0.6,
                color: "#fff",
            },
            {
                alpha: 0.2,
                offset: 0.96,
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

    const compassGlassGlareGradient = new ColorGradientFilter({
        type: 1, // Radial
        alpha: 1.0,
        replace: true,
        stops: [
            {
                alpha: 0.1,
                offset: 0.0,
                color: "#fff",
            },
            {
                alpha: 0.0,
                offset: 1.0,
                color: "#fff",
            },
        ],
    });

    const compassGlareX = 24;
    const compassGlareY = -24;

    const compassGlassGlare = new Graphics({ x, y })
        .circle(radius_shadow + compassGlareX, radius_shadow + compassGlareY, radius_compass * 0.3)
        .fill({ color: "#fff" });
    compassGlassGlare.filters = compassGlassGlareGradient;

    const line_length = radius_compass - 4;

    const compassLines = new Graphics({ x, y })
        .moveTo(radius_shadow, radius_shadow)
        .lineTo(radius_shadow - line_length, radius_shadow)
        .moveTo(radius_shadow, radius_shadow)
        .lineTo(radius_shadow, radius_shadow - line_length)
        .moveTo(radius_shadow, radius_shadow)
        .lineTo(radius_shadow + line_length, radius_shadow)
        .moveTo(radius_shadow, radius_shadow)
        .lineTo(radius_shadow, radius_shadow + line_length)
        .stroke({ color: "#fff4" });

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
        compassGlassGlare.y = y;
        compassLines.y = y;
    };
    const render = new Container({
        children: [compassLines, compassGlass, compassGlassGlare],
    });
    const destroy = () => {
        render.destroy({ children: true });
    };
    return {
        renderObj: {
            container: render,
            update,
            destroy,
        },
        blurMask,
        shadowMask,
        shadowMaskFilter,
    };
};
