import { Container, Sprite, Texture } from "pixi.js";
import { get_game_height, get_game_width } from "../../util";
//import { PixelateFilter } from "pixi-filters";

export const Player = (
    screen_width: number,
    screen_height: number,
    direction: number,
): {
    container: Container;
    update: (direction: number) => void;
} => {
    const texture = Texture.from("assets/player.png");
    //const scale = get_game_scale();
    const sprite = new Sprite({
        texture,
        anchor: 0.5,
        x: screen_width / 2,
        y: screen_height / 2,
        rotation: -(direction - Math.PI * 1.5),
    });
    //sprite.filters = pixelateFilter;

    const update = (direction: number) => {
        const width = get_game_width();
        const height = get_game_height();
        //const scale = get_game_scale();

        sprite.rotation = -(direction - Math.PI * 1.5);
        sprite.x = width / 2;
        sprite.y = height / 2;
        //pixelateFilter.size = scale;
    };

    return {
        container: sprite,
        update,
    };
};
