import { Container, Renderer } from "pixi.js";
import { SpaceViewState } from "../../types";
import { get_game_height, get_game_scale, get_game_width } from "../util";
import { Scaler } from "./Scaler";
import { WorldLayer } from "./WorldLayer";
import { Ui } from "./Ui";
import { PixelateFilter } from "pixi-filters";

export const SpaceView = (
    renderer: Renderer,
    state: SpaceViewState,
): { container: Container; update: (state: SpaceViewState) => void } => {
    const width = get_game_width();
    const height = get_game_height();
    const scale = get_game_scale();

    const worldLayer = WorldLayer(renderer, width, height, state);
    const ui = Ui(renderer, worldLayer.container);

    const pixelateFilter = new PixelateFilter(scale);
    const scaler = Scaler(get_game_scale(), [worldLayer.container, ui.container]);
    scaler.container.filters = pixelateFilter;

    const container = new Container({
        children: [scaler.container],
    });

    const update = (state: SpaceViewState) => {
        const scale = get_game_scale();
        worldLayer.update(state);
        ui.update(state);
        scaler.update(scale);
        pixelateFilter.size = scale;
    };

    return {
        container,
        update,
    };
};
