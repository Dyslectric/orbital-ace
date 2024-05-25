import { Container, Sprite, Texture } from "pixi.js";
import { PlanetEntity, PlanetType, GameState, ViewMode } from "../../types";
import { get_game_height, get_game_width } from "../util";
import { RenderObj, RenderState } from "../";

type PlanetTextureStorage = {
    airless: Texture[];
    arid: Texture[];
    oasis: Texture[];
};

const createTextures = (): PlanetTextureStorage => {
    return {
        airless: [
            Texture.from("assets/planets/128/Unshaded Solid/Airless/Airless_01-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Airless/Airless_02-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Airless/Airless_03-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Airless/Airless_04-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Airless/Airless_05-128x128.png"),
        ],
        arid: [
            Texture.from("assets/planets/128/Unshaded Solid/Arid/Arid_01-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Arid/Arid_02-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Arid/Arid_03-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Arid/Arid_04-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Arid/Arid_05-128x128.png"),
        ],
        oasis: [
            Texture.from("assets/planets/128/Unshaded Solid/Oasis/Oasis_01-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Oasis/Oasis_02-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Oasis/Oasis_03-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Oasis/Oasis_04-128x128.png"),
            Texture.from("assets/planets/128/Unshaded Solid/Oasis/Oasis_05-128x128.png"),
        ],
    };
};

export type PlanetsOpts = {
    gameState: GameState;
    renderState: RenderState;
};

export const Planets = (opts: PlanetsOpts): RenderObj => {
    const container = new Container();
    const textureSeeds = new WeakMap<PlanetEntity, number>();
    const textures = createTextures();

    const createPlanetSprite = (planet: PlanetEntity, textureSeed: number): Sprite => {
        const { gameState: state, renderState } = opts;
        const { gameZoom: zoom } = renderState;

        const screenCenterX = get_game_width() / 2;
        const screenCenterY = get_game_height() / 2;
        //console.log(screenCenterX, screenCenterY);

        const planetOrbitX = planet.orbitProperties.radius_x * Math.cos(planet.orbitProperties.position);
        const planetOrbitY = planet.orbitProperties.radius_y * Math.sin(planet.orbitProperties.position);

        const x = (-state.cameraPosition.x + planetOrbitX) * zoom + screenCenterX;
        const y = (-state.cameraPosition.y + planetOrbitY) * zoom + screenCenterY;

        //console.log("x: ", x, "y: ", y);
        //console.log("size: ", planet.size);

        const getTexture = (): Texture => {
            switch (planet.type) {
                case PlanetType.Airless:
                    return textures.airless[textureSeed];
                case PlanetType.Arid:
                    return textures.arid[textureSeed];
                case PlanetType.Oasis:
                    return textures.oasis[textureSeed];
            }
        };

        const texture = getTexture();

        //console.log(texture);

        const sprite = new Sprite({ x, y, texture, anchor: 0.5, width: planet.size, height: planet.size });

        return sprite;
    };
    const update = () => {
        const { gameState: state } = opts;

        container.removeChildren().forEach((child) => {
            child.destroy({ children: true });
        });

        state.planets.forEach((planet) => {
            let textureSeed = 0;

            if (!textureSeeds.has(planet)) {
                textureSeed = Math.floor(Math.random() * 5) % 5;
                textureSeeds.set(planet, textureSeed);
            }

            container.addChild(createPlanetSprite(planet, textureSeed));
        });
    };

    update();

    const destroy = () => {
        container.destroy({ children: true });
    };

    return {
        container,
        update,
        destroy,
    };
};
