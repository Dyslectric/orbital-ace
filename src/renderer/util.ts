import { game_consts } from "../const";

export function get_game_width() {
    return Math.floor(window.innerWidth / get_game_scale());
}

export function get_game_height() {
    return Math.floor(window.innerHeight / get_game_scale());
}

export function get_game_scale() {
    return window.innerWidth > game_consts.max_pixel_width
        ? Math.ceil(window.innerWidth / game_consts.max_pixel_width)
        : 1;
}

export function parallax(
    player_x: number,
    player_y: number,
    texture_w: number,
    texture_h: number,
    parallax: number,
): { x: number; y: number } {
    return {
        x: (player_x / parallax) % texture_w,
        y: (player_y / parallax) % texture_h,
    };
}
