export type PlayerEntity = {
    x: number;
    y: number;
    thruster_on: boolean;
    brake_on: boolean;
    turning_left: boolean;
    turning_right: boolean;
    velocity: number;
    direction: number;
};

export type SpaceViewState = {
    player: PlayerEntity;
    hotbar_selection: number;
    mouse_x: number;
    mouse_y: number;
    //game_width: number;
    //game_height: number;
    //game_scale: number;
};
