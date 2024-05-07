import "./style.css";
import { Application, Assets, TextureStyle } from "pixi.js";
import { SpaceViewState } from "./types";
import { SpaceViewRenderer } from "./renderer/SpaceViewRenderer";
//import { get_game_height, get_game_width, get_game_scale } from "./renderer/util";
import { game_consts } from "./const";

const app = new Application();

window.onload = async (): Promise<void> => {
    await app.init({
        backgroundColor: 0xd3d3d3,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    TextureStyle.defaultOptions.scaleMode = "nearest";

    await Promise.all([
        Assets.load("assets/pointer.png"),
        Assets.load("assets/player.png"),
        Assets.load("assets/bg_0.png"),
        Assets.load("assets/bg_1.png"),
        Assets.load("assets/bg_2.png"),
        Assets.load("assets/bg_3.png"),
    ]);

    app.canvas.id = "game-canvas";
    document.body.appendChild(app.canvas);

    resizeCanvas();

    new SpaceView();
};

function resizeCanvas(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);
}

class SpaceView {
    state: SpaceViewState;

    constructor() {
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
            mouse_x: 0,
            mouse_y: 0,
            //game_width: get_game_width(),
            //game_height: get_game_height(),
            //game_scale: get_game_scale(),
            hotbar_selection: 0,
        };

        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.state.player.thruster_on = true;
                    event.preventDefault();
                    break;
                case "w":
                    this.state.player.thruster_on = true;
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    this.state.player.brake_on = true;
                    event.preventDefault();
                    break;
                case "s":
                    this.state.player.brake_on = true;
                    event.preventDefault();
                    break;
                case "ArrowLeft":
                    this.state.player.turning_left = true;
                    event.preventDefault();
                    break;
                case "a":
                    this.state.player.turning_left = true;
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    this.state.player.turning_right = true;
                    event.preventDefault();
                    break;
                case "d":
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
                case "w":
                    this.state.player.thruster_on = false;
                    event.preventDefault();
                    break;
                case "ArrowDown":
                    this.state.player.brake_on = false;
                    event.preventDefault();
                    break;
                case "s":
                    this.state.player.brake_on = false;
                    event.preventDefault();
                    break;
                case "ArrowLeft":
                    this.state.player.turning_left = false;
                    event.preventDefault();
                    break;
                case "a":
                    this.state.player.turning_left = false;
                    event.preventDefault();
                    break;
                case "ArrowRight":
                    this.state.player.turning_right = false;
                    event.preventDefault();
                    break;
                case "d":
                    this.state.player.turning_right = false;
                    event.preventDefault();
                    break;
            }
        });

        document.addEventListener("wheel", (event) => {
            if (event.deltaY > 0 && this.state.hotbar_selection < 10 - 1) {
                this.state.hotbar_selection++;
            } else if (this.state.hotbar_selection > 0) {
                this.state.hotbar_selection--;
            }
        });

        document.addEventListener("keypress", (event) => {
            switch (event.key) {
                case "1":
                    this.state.hotbar_selection = 0;
                    break;
                case "2":
                    this.state.hotbar_selection = 1;
                    break;
                case "3":
                    this.state.hotbar_selection = 2;
                    break;
                case "4":
                    this.state.hotbar_selection = 3;
                    break;
                case "5":
                    this.state.hotbar_selection = 4;
                    break;
                case "6":
                    this.state.hotbar_selection = 5;
                    break;
                case "7":
                    this.state.hotbar_selection = 6;
                    break;
                case "8":
                    this.state.hotbar_selection = 7;
                    break;
                case "9":
                    this.state.hotbar_selection = 8;
                    break;
                case "0":
                    this.state.hotbar_selection = 9;
                    break;
            }
        });

        document.addEventListener("mousemove", (moveEvent) => {
            this.state.mouse_x = moveEvent.clientX;
            this.state.mouse_y = moveEvent.clientY;
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
        const renderer = SpaceViewRenderer(app.renderer, app.stage, this.state);

        let startTime = performance.now();

        while (true) {
            const next = new Promise((resolve) => setTimeout(resolve, 6));
            this.update();
            renderer.render(this.state);
            const endTime = performance.now();
            console.log("Frametime: ", endTime - startTime);
            startTime = endTime;

            await next;
        }
    }
}
