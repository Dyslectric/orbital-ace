import "./style.css";
import { Application, TextureStyle } from "pixi.js";
import { PlanetEntity, PlanetType, GameState, ViewMode } from "./types";
import { importAssets } from "./import_assets";
import { createGameRenderer, GameRenderer } from "./renderer";
import { GameControls, initGameControls } from "./controls";

const app = new Application();

window.onload = async (): Promise<void> => {
    await app.init({
        backgroundColor: 0xd3d3d3,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    await importAssets();

    TextureStyle.defaultOptions.scaleMode = "linear";

    app.canvas.id = "game-canvas";
    document.body.appendChild(app.canvas);

    addResizeListener();

    startGame();
};

function addResizeListener(): void {
    const resize = () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener("resize", resize);
}

function initGameState(): GameState {
    return {
        player: {
            x: 0,
            y: 0,
            z: 0,
            thruster_on: false,
            brake_on: false,
            turning_left: false,
            turning_right: false,
            velocity: 0,
            direction: 0,
        },
        pointerCoords: {
            x: 0,
            y: 0,
        },
        cameraPosition: {
            x: 0,
            y: 0,
        },
        hotbarSelection: 0,
        planets: [
            {
                orbitProperties: {
                    radius_x: 500,
                    radius_y: 500,
                    position: 0,
                },
                type: PlanetType.Oasis,
                size: 32,
            },
        ],
        viewMode: ViewMode.Interplanetary,
    };
}

function handleControls(controls: GameControls, state: GameState) {
    if (controls.camera.up) {
        state.cameraPosition.y -= 6;
    }
    if (controls.camera.down) {
        state.cameraPosition.y += 6;
    }
    if (controls.camera.left) {
        state.cameraPosition.x -= 6;
    }
    if (controls.camera.right) {
        state.cameraPosition.x += 6;
    }
    if (controls.changeViewMode) {
        controls.changeViewMode = false;

        if (state.viewMode == ViewMode.Fleet) {
            state.viewMode = ViewMode.Interplanetary;
        } else {
            state.viewMode = ViewMode.Fleet;
        }
    }

    if (controls.hotbar.next && state.hotbarSelection < 9) {
        controls.hotbar.next = false;
        state.hotbarSelection++;
    } else if (controls.hotbar.prev && state.hotbarSelection > 0) {
        controls.hotbar.prev = false;
        state.hotbarSelection--;
    } else if (controls.hotbar.selectedChange) {
        controls.hotbar.selectedChange = false;
        state.hotbarSelection = controls.hotbar.selection;
    }

    state.pointerCoords.x = controls.mouse.x;
    state.pointerCoords.y = controls.mouse.y;
}

async function gameLoop(state: GameState, controls: GameControls, renderer: GameRenderer) {
    while (true) {
        const next = new Promise((resolve) => setTimeout(resolve, 6));

        handleControls(controls, state);
        state.planets[0].orbitProperties.position += 0.001;
        renderer.update();

        //const endTime = performance.now();
        //console.log("Frametime: ", endTime - startTime);
        //startTime = endTime;

        await next;
    }
}

function startGame() {
    const state = initGameState();
    const controls = initGameControls();
    const renderer = createGameRenderer(app, state);

    gameLoop(state, controls, renderer);
}

//class SpaceView {
//    state: GameState;
//    controls: GameControls;
//
//    constructor() {
//        const switchViewMode = () => {
//            if (this.state.viewMode == ViewMode.Fleet) {
//                this.state.viewMode = ViewMode.Interplanetary;
//            } else if (this.state.viewMode == ViewMode.Interplanetary) {
//                this.state.viewMode = ViewMode.Fleet;
//            }
//        };
//
//        this.run();
//    }
//
//    async run() {
//        const renderer = createRenderer(app.stage);
//        const spaceView = SpaceViewRenderComponent(app.renderer, this.state);
//
//        const planet1: PlanetEntity = {
//            orbitProperties: {
//                radius_x: 100,
//                radius_y: 100,
//                position: 0,
//            },
//            type: PlanetType.Oasis,
//            size: 100,
//        };
//
//        spaceView.addPlanet(planet1);
//
//        renderer.addChild(spaceView.renderObj);
//
//        //let startTime = performance.now();
//
//        while (true) {
//            const next = new Promise((resolve) => setTimeout(resolve, 6));
//            this.update();
//            renderer.render();
//            //const endTime = performance.now();
//            //console.log("Frametime: ", endTime - startTime);
//            //startTime = endTime;
//
//            await next;
//        }
//    }
//}
