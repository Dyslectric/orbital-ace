import { Container, Texture, TilingSprite } from "pixi.js";
import { game_consts } from "../../../const";
import { parallax } from "../../util";

export const Background = (
    width: number,
    height: number,
    player_x: number,
    player_y: number,
): {
    container: Container;
    update: (width: number, height: number, player_x: number, player_y: number) => void;
} => {
    const bg_1_scroll = parallax(player_x, player_y, 960, 540, game_consts.bg_1_parallax);
    const bg_2_scroll = parallax(player_x, player_y, 960, 540, game_consts.bg_2_parallax);
    const bg_3_scroll = parallax(player_x, player_y, 960, 540, game_consts.bg_3_parallax);

    const textures = {
        bg0: Texture.from("assets/bg_0.png"),
        bg1: Texture.from("assets/bg_1.png"),
        bg2: Texture.from("assets/bg_2.png"),
        bg3: Texture.from("assets/bg_3.png"),
    };

    const sprites = {
        bg0: new TilingSprite({
            texture: textures.bg0,
            width,
            height,
        }),
        bg1: new TilingSprite({
            texture: textures.bg1,
            width,
            height,
            tilePosition: {
                x: bg_1_scroll.x,
                y: bg_1_scroll.y,
            },
        }),
        bg2: new TilingSprite({
            texture: textures.bg2,
            width,
            height,
            tilePosition: {
                x: bg_2_scroll.x,
                y: bg_2_scroll.y,
            },
        }),
        bg3: new TilingSprite({
            texture: textures.bg3,
            width,
            height,
            tilePosition: {
                x: bg_3_scroll.x,
                y: bg_3_scroll.y,
            },
        }),
    };

    const container = new Container({ children: [sprites.bg0, sprites.bg1, sprites.bg2, sprites.bg3] });

    const update = (width: number, height: number, player_x: number, player_y: number) => {
        const bg_1_scroll = parallax(player_x, player_y, 960, 540, game_consts.bg_1_parallax);
        const bg_2_scroll = parallax(player_x, player_y, 960, 540, game_consts.bg_2_parallax);
        const bg_3_scroll = parallax(player_x, player_y, 960, 540, game_consts.bg_3_parallax);

        sprites.bg1.tilePosition.x = bg_1_scroll.x;
        sprites.bg1.tilePosition.y = bg_1_scroll.y;
        sprites.bg2.tilePosition.x = bg_2_scroll.x;
        sprites.bg2.tilePosition.y = bg_2_scroll.y;
        sprites.bg3.tilePosition.x = bg_3_scroll.x;
        sprites.bg3.tilePosition.y = bg_3_scroll.y;

        sprites.bg0.width = width;
        sprites.bg0.height = height;
        sprites.bg1.width = width;
        sprites.bg1.height = height;
        sprites.bg2.width = width;
        sprites.bg2.height = height;
        sprites.bg3.width = width;
        sprites.bg3.height = height;
    };

    return {
        container,
        update,
    };
};
