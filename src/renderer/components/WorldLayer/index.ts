import { Container, Renderer } from "pixi.js";
import { SpaceViewState } from "../../../types";
import { Background } from "./Background";
import { Player } from "./Player";
import { get_game_height, get_game_width } from "../../util";

export const WorldLayer = (
    renderer: Renderer,
    width: number,
    height: number,
    state: SpaceViewState,
): { container: Container; update: (state: SpaceViewState) => void } => {
    const bg = Background(width, height, state.player.x, state.player.y);
    const player = Player(width, height, state.player.direction);
    const container = new Container({
        children: [bg.container, player.container],
    });
    const update = (state: SpaceViewState) => {
        const width = get_game_width();
        const height = get_game_height();
        bg.update(width, height, state.player.x, state.player.y);
        player.update(state.player.direction);
    };
    return { container, update };
};
