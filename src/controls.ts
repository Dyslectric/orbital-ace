export type CameraControls = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
};

export type HotbarControls = {
    next: boolean;
    prev: boolean;
    selectedChange: boolean;
    selection: number;
};

export type GameControls = {
    camera: CameraControls;
    hotbar: HotbarControls;
    mouse: { x: number; y: number };
    changeViewMode: boolean;
};

export function initGameControls(): GameControls {
    const controls = {
        camera: {
            up: false,
            down: false,
            left: false,
            right: false,
        },
        hotbar: {
            prev: false,
            next: false,
            selectedChange: false,
            selection: 0,
        },
        mouse: { x: 0, y: 0 },
        changeViewMode: false,
    };

    addControlListeners(controls);

    return controls;
}

function addCameraControls(camera: CameraControls) {
    document.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                camera.up = true;
                event.preventDefault();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                camera.down = true;
                event.preventDefault();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                camera.left = true;
                event.preventDefault();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                camera.right = true;
                event.preventDefault();
                break;
        }
    });

    document.addEventListener("keyup", (event) => {
        switch (event.key) {
            case "ArrowUp":
            case "w":
            case "W":
                camera.up = false;
                event.preventDefault();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                camera.down = false;
                event.preventDefault();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                camera.left = false;
                event.preventDefault();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                camera.right = false;
                event.preventDefault();
                break;
        }
    });
}

function addHotbarControls(controls: HotbarControls) {
    document.addEventListener("wheel", (event) => {
        if (event.deltaY > 0) {
            controls.next = true;
        } else {
            controls.prev = true;
        }
    });

    document.addEventListener("keypress", (event) => {
        switch (event.key) {
            case "1":
                controls.selectedChange = true;
                controls.selection = 0;
                break;
            case "2":
                controls.selectedChange = true;
                controls.selection = 1;
                break;
            case "3":
                controls.selectedChange = true;
                controls.selection = 2;
                break;
            case "4":
                controls.selectedChange = true;
                controls.selection = 3;
                break;
            case "5":
                controls.selectedChange = true;
                controls.selection = 4;
                break;
            case "6":
                controls.selectedChange = true;
                controls.selection = 5;
                break;
            case "7":
                controls.selectedChange = true;
                controls.selection = 6;
                break;
            case "8":
                controls.selectedChange = true;
                controls.selection = 7;
                break;
            case "9":
                controls.selectedChange = true;
                controls.selection = 8;
                break;
            case "0":
                controls.selectedChange = true;
                controls.selection = 9;
                break;
        }
    });
}

function addMouseControls(controls: { x: number; y: number }) {
    document.addEventListener("mousemove", (moveEvent) => {
        controls.x = moveEvent.clientX;
        controls.y = moveEvent.clientY;
    });
}

function addControlListeners(controls: GameControls) {
    addCameraControls(controls.camera);
    addHotbarControls(controls.hotbar);
    addMouseControls(controls.mouse);

    document.addEventListener("keypress", (event) => {
        if (event.key == "m") {
            controls.changeViewMode = true;
        }
    });
}
