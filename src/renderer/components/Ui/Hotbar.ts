import { ColorGradientFilter } from "pixi-filters";
import { Container, Graphics, GraphicsPath } from "pixi.js";
import { get_game_height, get_game_width } from "../../util";

export const Hotbar = (
    box_size: number,
    box_padding: number,
    box_corner_radius: number,
    bottom_distance: number,
    color: string,
): {
    container: Container;
    blurMask: Container;
    update: () => void;
} => {
    const width = get_game_width();
    const height = get_game_height();
    const y = height - bottom_distance - box_size;
    const left_x = width / 2 - box_padding / 2 - box_padding * 4 - box_size * 5;

    const boxArea = new GraphicsPath()
        .lineTo(box_size - box_corner_radius, 0)
        .arc(box_size - box_corner_radius, box_corner_radius, box_corner_radius, Math.PI * 1.5, Math.PI * 0.0)
        .lineTo(box_size, box_size)
        .lineTo(box_corner_radius, box_size)
        .arc(box_corner_radius, box_size - box_corner_radius, box_corner_radius, Math.PI * 0.5, Math.PI * 1.0)
        .lineTo(0, 0);

    const gradFilter = new ColorGradientFilter({
        type: 1, // Radial
        alpha: 0.16,
        replace: false,
        stops: [
            {
                alpha: 1.0,
                offset: 0.0,
                color: "#fff",
            },
            {
                alpha: 0.0,
                offset: 0.9,
                color: "#fff",
            },
        ],
    });

    const boxes = Array.from({ length: 10 }, (_, index) => {
        const x = left_x + index * (box_size + box_padding);
        const box = new Graphics({ x, y }).path(boxArea).fill({ color });
        box.filters = gradFilter;
        return box;
    });

    const blurMasks = Array.from({ length: 10 }, (_, index) => {
        const x = left_x + index * (box_size + box_padding);
        const blurMask = new Graphics({ x, y }).path(boxArea).fill({ color: "#fff" });
        return blurMask;
    });

    const container = new Container({
        children: boxes,
    });

    const blurMask = new Container({
        children: blurMasks,
    });

    const update = () => {
        //boxes.forEach((box) => {});
        //blurMasks.forEach((blurMask) => {});
    };

    return {
        container,
        blurMask,
        update,
    };
};
