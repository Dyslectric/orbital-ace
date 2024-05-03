import "./style.css";
import { Application, SCALE_MODES, Sprite, Texture, TilingSprite, BaseTexture } from "pixi.js";

BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

const game_consts = {
    max_logical_screen_width: 640,
    max_logical_screen_height: 360,
    default_scale: 2,
    max_velocity: 400,
    bg_1_parallax: 32,
    bg_2_parallax: 16,
    bg_3_parallax: 8,
};

const app = new Application<HTMLCanvasElement>({
    backgroundColor: 0xd3d3d3,
    width: Math.floor(window.innerWidth / game_consts.default_scale) * game_consts.default_scale,
    height: Math.floor(window.innerHeight / game_consts.default_scale) * game_consts.default_scale,
});

window.onload = async (): Promise<void> => {
    document.body.appendChild(app.view);
    resizeCanvas();

    const renderer = new SpaceViewRenderer();
    new SpaceView(renderer);
};

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);

        app.stage.scale.x = game_consts.default_scale;
        app.stage.scale.y = game_consts.default_scale;
    };

    resize();
    window.addEventListener("resize", resize);
}

type TextureStorage = {
    bg0: Texture;
    bg1: Texture;
    bg2: Texture;
    bg3: Texture;
    player: Texture;
};

class SpaceViewRenderer {
    textures: TextureStorage;
    sprites: {
        bg0: TilingSprite;
        bg1: TilingSprite;
        bg2: TilingSprite;
        bg3: TilingSprite;
        player: Sprite;
    };

    loadTextures() {
        return {
            bg0: Texture.from("assets/bg_0.png"),
            bg1: Texture.from("assets/bg_1.png"),
            bg2: Texture.from("assets/bg_2.png"),
            bg3: Texture.from("assets/bg_3.png"),
            player: Texture.from("assets/player.png"),
        };
    }

    initSprites() {
        const bg0 = new TilingSprite(this.textures.bg0, 960, 540);
        const bg1 = new TilingSprite(this.textures.bg1, 960, 540);
        const bg2 = new TilingSprite(this.textures.bg2, 960, 540);
        const bg3 = new TilingSprite(this.textures.bg3, 960, 540);
        const player = new Sprite(this.textures.player);

        player.anchor.set(0.5);

        app.stage.addChild(bg0);
        app.stage.addChild(bg1);
        app.stage.addChild(bg2);
        app.stage.addChild(bg3);
        app.stage.addChild(player);

        return {
            bg0,
            bg1,
            bg2,
            bg3,
            player,
        };
    }

    constructor() {
        this.textures = this.loadTextures();
        this.sprites = this.initSprites();
    }

    update_player(state: SpaceViewState) {
        this.sprites.player.rotation = -(state.player.direction - Math.PI * 1.5);
        this.sprites.player.x = app.screen.width / game_consts.default_scale / 2;
        this.sprites.player.y = app.screen.height / game_consts.default_scale / 2;
    }

    update_background(state: SpaceViewState) {
        const bg_1_scroll = {
            x: (state.player.x / game_consts.bg_1_parallax) % 960,
            y: (state.player.y / game_consts.bg_1_parallax) % 540,
        };

        const bg_2_scroll = {
            x: (state.player.x / game_consts.bg_2_parallax) % 960,
            y: (state.player.y / game_consts.bg_2_parallax) % 540,
        };

        const bg_3_scroll = {
            x: (state.player.x / game_consts.bg_3_parallax) % 960,
            y: (state.player.y / game_consts.bg_3_parallax) % 540,
        };

        this.sprites.bg1.tilePosition.x = bg_1_scroll.x;
        this.sprites.bg1.tilePosition.y = bg_1_scroll.y;
        this.sprites.bg2.tilePosition.x = bg_2_scroll.x;
        this.sprites.bg2.tilePosition.y = bg_2_scroll.y;
        this.sprites.bg3.tilePosition.x = bg_3_scroll.x;
        this.sprites.bg3.tilePosition.y = bg_3_scroll.y;
    }

    update(state: SpaceViewState) {
        this.update_player(state);
        this.update_background(state);
    }
}

type PlayerEntity = {
    x: number;
    y: number;
    thruster_on: boolean;
    brake_on: boolean;
    turning_left: boolean;
    turning_right: boolean;
    velocity: number;
    direction: number;
};

type SpaceViewState = {
    player: PlayerEntity;
};

class SpaceView {
    state: SpaceViewState;
    renderer: SpaceViewRenderer;

    constructor(renderer: SpaceViewRenderer) {
        this.state = {
            player: {
                x: 0,
                y: 0,
                thruster_on: false,
                brake_on: false,
                turning_left: false,
                turning_right: false,
                velocity: 0,
                direction: 0,
            },
        };
        this.renderer = renderer;

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.state.player.thruster_on = true;
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    this.state.player.brake_on = true;
                    event.preventDefault();
                    break;
                case "ArrowLeft":
                    this.state.player.turning_left = true;
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    this.state.player.turning_right = true;
                    event.preventDefault();
                    break;
            }
        });

        document.addEventListener("keyup", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.state.player.thruster_on = false;
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    this.state.player.brake_on = false;
                    event.preventDefault();
                    break;
                case "ArrowLeft":
                    this.state.player.turning_left = false;
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    this.state.player.turning_right = false;
                    event.preventDefault();
                    break;
            }
        });

        this.run();
    }

    update_physics() {
        const player = this.state.player;

        if (player.brake_on && player.velocity > 0) {
            player.velocity--;
        } else if (player.thruster_on && player.velocity < game_consts.max_velocity) {
            player.velocity++;
        }
        if (player.turning_right && !player.turning_left) {
            player.direction -= 0.05;
        } else if (player.turning_left && !player.turning_right) {
            player.direction += 0.05;
        }

        player.x += Math.cos(player.direction) * player.velocity * 0.3;
        player.y += Math.sin(-player.direction) * player.velocity * 0.3;
    }

    update() {
        this.update_physics();
    }

    async run() {
        //let elapsed = 0;

        while (true) {
            this.update();
            this.renderer.update(this.state);

            await new Promise((resolve) => setTimeout(resolve, 0)); // Add delay between iterations
        }
    }
}
