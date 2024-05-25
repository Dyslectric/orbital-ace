export type PlayerEntity = {
    x: number;
    y: number;
    z: number;
    thruster_on: boolean;
    brake_on: boolean;
    turning_left: boolean;
    turning_right: boolean;
    velocity: number;
    direction: number;
};

export enum PlanetType {
    Arid,
    Airless,
    Oasis,
    //Lush,
    //Snowy,
    //Terrestrial,
    //Tropical,
    //Magma,
    //Cloudy,
}

export type PlanetEntity = {
    orbitProperties: {
        // in radius pixels from center of star to center of planet
        radius_x: number;
        radius_y: number;
        // in radians
        position: number;
    };
    type: PlanetType;
    // in radius pixels
    size: number;
};

export enum ViewMode {
    Interplanetary,
    Fleet,
}

export type GameState = {
    player: PlayerEntity;
    hotbarSelection: number;
    pointerCoords: { x: number; y: number };
    planets: PlanetEntity[];
    viewMode: ViewMode;
    // in pixels, based on center of screen
    cameraPosition: {
        x: number;
        y: number;
    };
    //game_width: number;
    //game_height: number;
    //game_scale: number;
};
