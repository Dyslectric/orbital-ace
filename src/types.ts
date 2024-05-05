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
    game_width: number;
    game_height: number;
    game_scale: number;
};
