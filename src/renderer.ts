// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
    Application,
    BlurFilter,
    Container,
    Graphics,
    Rectangle,
    RenderTexture,
    Renderer,
    Sprite,
    Texture,
    TextureStyle,
    TilingSprite,
} from "pixi.js";
import { ColorGradientFilter, PixelateFilter } from "pixi-filters";
import { SpaceViewState } from "./types";
import { game_consts } from "./const";

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

TextureStyle.defaultOptions.scaleMode = "nearest";

function PlayerInfoBar(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bg: Texture,
): RenderComponent<SpaceViewState> {
    const container = new Container();
    const plot = new Graphics();

    plot.lineTo(width - radius, 0)
        .arc(width - radius, radius, radius, Math.PI * 1.5, Math.PI * 0.0, false)
        .lineTo(width, height)
        .lineTo(radius, height)
        .arc(radius, height - radius, radius, Math.PI * 0.5, Math.PI * 1.0, false)
        .lineTo(0, 0)
        .fill({ color: "#111a2180" })
        .closePath();

    const bg_blur = new Container();

    const mask = plot.clone();
    mask.x = x;
    mask.y = y;

    bg_blur.addChild(new Sprite(bg));
    bg_blur.mask = mask;
    bg_blur.addChild(mask);
    bg_blur.filters = [new BlurFilter()];

    container.addChild(bg_blur);
    container.addChild(plot);

    container.filters = new PixelateFilter(get_game_scale());

    const update = (state: SpaceViewState) => {
        container.filters = new PixelateFilter(state.game_scale);
    };

    plot.x = x;
    plot.y = y;

    return {
        container,
        update,
    };
}

function HotBarBox(
    space_from_bottom: number,
    padding_between_boxes: number,
    box_size: number,
    box_radius: number,
    bg_texture: Texture,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index: number,
): RenderComponent<SpaceViewState> {
    const container = new Container();

    const box = new Graphics()
        .lineTo(box_size - box_radius, 0)
        .arc(box_size - box_radius, box_radius, box_radius, Math.PI * 1.5, Math.PI * 0.0, false)
        .lineTo(box_size, box_size)
        .lineTo(box_radius, box_size)
        .arc(box_radius, box_size - box_radius, box_radius, Math.PI * 0.5, Math.PI * 1.0, false)
        .lineTo(0, 0);

    const mask = box.clone();
    const gradient = box.clone();

    {
        const height = get_game_height();
        const center_x = get_game_width() / 2;
        const y = height - (space_from_bottom + box_size);
        const left_x = center_x - padding_between_boxes / 2 - box_size * 5 - padding_between_boxes * 4;
        const x = left_x + index * (padding_between_boxes + box_size);

        mask.position.set(x, y);
        gradient.position.set(x, y);
        gradient.fill({ color: "#11203140" });
    }

    const bg_blur = new Container();
    bg_blur.addChild(new Sprite(bg_texture));
    bg_blur.mask = mask;
    bg_blur.filters = new BlurFilter();
    bg_blur.addChild(mask);

    container.addChild(bg_blur);

    gradient.filters = new ColorGradientFilter({
        type: 1,
        stops: [
            {
                alpha: 1.0,
                color: "#fff",
                offset: 0.0,
            },
            {
                alpha: 0.0,
                color: "#fff",
                offset: 1.0,
            },
        ],
        alpha: 0.2,
    });

    container.addChild(gradient);

    const update = () => {
        const height = get_game_height();
        const center_x = get_game_width() / 2;
        const y = height - (space_from_bottom + box_size);
        const left_x = center_x - padding_between_boxes / 2 - box_size * 5 - padding_between_boxes * 4;
        const x = left_x + index * (box_size + padding_between_boxes);
        mask.position.set(x, y);
        gradient.position.set(x, y);
    };

    return {
        container,
        update,
    };
}

function HotBar(
    space_from_bottom: number,
    padding_between_boxes: number,
    box_size: number,
    box_radius: number,
    bg_texture: Texture,
): RenderComponent<SpaceViewState> {
    const boxes: RenderComponent<SpaceViewState>[] = [];
    const container = new Container();

    for (let i = 0; i < 10; i++) {
        boxes.push(HotBarBox(space_from_bottom, padding_between_boxes, box_size, box_radius, bg_texture, i));
        container.addChild(boxes[i].container);
    }

    container.filters = new PixelateFilter(get_game_scale());

    const update = (state: SpaceViewState) => {
        boxes.forEach((box) => {
            box.update(state);
        });
        container.filters = new PixelateFilter(get_game_scale());
    };

    return {
        container,
        update,
    };
}

function Compass(
    center_distance: number,
    compass_radius: number,
    shadow_radius: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    bg_texture: Texture,
): RenderComponent<SpaceViewState> {
    const container = new Container();
    const height = get_game_height();

    const x = center_distance - shadow_radius;
    const y = height - center_distance - shadow_radius;

    const texture = new Texture({
        source: bg_texture.source,
        frame: new Rectangle(x, y, shadow_radius * 2, shadow_radius * 2),
    });

    //bg_texture.height

    const outer_circle = new Graphics();
    outer_circle.circle(center_distance, height - center_distance, shadow_radius);
    outer_circle.texture(texture);
    outer_circle.position.set(x, y);

    outer_circle.filters = [
        new ColorGradientFilter({
            type: 1,
            stops: [
                {
                    alpha: 1.0,
                    color: "#000",
                    offset: 0.0,
                },
                {
                    alpha: 1.0,
                    color: "#000",
                    offset: 0.8,
                },
                {
                    alpha: 0.0,
                    color: "#000",
                    offset: 0.9,
                },
                {
                    alpha: 0.0,
                    color: "#000",
                    offset: 1.0,
                },
            ],
            alpha: 1.0,
        }),
    ];

    container.addChild(outer_circle);

    const inner_circle = new Graphics();
    inner_circle.circle(center_distance, height - center_distance, compass_radius).fill({ color: "#101a3020" });
    inner_circle.filters = new ColorGradientFilter({
        type: 1,
        stops: [
            {
                alpha: 0.0,
                color: "#000",
                offset: 0.0,
            },
            {
                alpha: 0.0,
                color: "#000",
                offset: 0.9,
            },
            {
                alpha: 1.0,
                color: "#fff",
                offset: 1.0,
            },
        ],
        alpha: 0.3,
    });

    container.addChild(inner_circle);

    const update = () => {};

    return {
        container,
        update,
    };
}

function ScalerContainer(): RenderComponent<SpaceViewState> {
    const container = new Container();

    container.scale.set(Math.ceil(window.innerWidth / game_consts.max_pixel_width));

    const update = (state: SpaceViewState) => {
        container.scale.set(state.game_scale);
    };

    return {
        container,
        update,
    };
}

function Player(): RenderComponent<SpaceViewState> {
    const texture = Texture.from("assets/player.png");
    const sprite = new Sprite(texture);

    const screen_width = get_game_width();
    const screen_height = get_game_height();

    sprite.anchor.set(0.5);
    sprite.x = screen_width / 2;
    sprite.y = screen_height / 2;

    const update = (state: SpaceViewState) => {
        sprite.rotation = -(state.player.direction - Math.PI * 1.5);
        sprite.x = state.game_width / 2;
        sprite.y = state.game_height / 2;
    };

    return {
        container: sprite,
        update,
    };
}

function Background(): RenderComponent<SpaceViewState> {
    const width = get_game_width();
    const height = get_game_height();
    const textures = {
        bg0: Texture.from("assets/bg_0.png"),
        bg1: Texture.from("assets/bg_1.png"),
        bg2: Texture.from("assets/bg_2.png"),
        bg3: Texture.from("assets/bg_3.png"),
    };
    const sprites = {
        bg0: new TilingSprite({
            texture: textures.bg0,
            width,
            height,
        }),
        bg1: new TilingSprite({
            texture: textures.bg1,
            width,
            height,
        }),
        bg2: new TilingSprite({
            texture: textures.bg2,
            width,
            height,
        }),
        bg3: new TilingSprite({
            texture: textures.bg3,
            width,
            height,
        }),
    };
    const container = new Container();

    container.addChild(sprites.bg0);
    container.addChild(sprites.bg1);
    container.addChild(sprites.bg2);
    container.addChild(sprites.bg3);

    const update = (state: SpaceViewState) => {
        const width = get_game_width();
        const height = get_game_height();

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

        sprites.bg0.width = width;
        sprites.bg0.height = height;
        sprites.bg1.width = width;
        sprites.bg1.height = height;
        sprites.bg2.width = width;
        sprites.bg2.height = height;
        sprites.bg3.width = width;
        sprites.bg3.height = height;

        sprites.bg1.tilePosition.x = bg_1_scroll.x;
        sprites.bg1.tilePosition.y = bg_1_scroll.y;
        sprites.bg2.tilePosition.x = bg_2_scroll.x;
        sprites.bg2.tilePosition.y = bg_2_scroll.y;
        sprites.bg3.tilePosition.x = bg_3_scroll.x;
        sprites.bg3.tilePosition.y = bg_3_scroll.y;
    };

    return {
        container,
        update,
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SpaceView(renderer: Renderer) {
    const container = new Container();

    const scaler = ScalerContainer();
    container.addChild(scaler.container);

    const bg = Background();
    scaler.container.addChild(bg.container);

    const player = Player();
    scaler.container.addChild(player.container);

    const bg_texture = RenderTexture.create({
        width: 2048,
        height: 2048,
        scaleMode: "nearest",
    });

    renderer.render({
        container: bg.container,
        target: bg_texture,
    });

    const main_bar = PlayerInfoBar(20, 20, 200, 40, 12, bg_texture);
    scaler.container.addChild(main_bar.container);

    const sub_bar: RenderComponent<SpaceViewState>[] = [];
    //const sub_bar_1 = PlayerInfoBar(20, 70, 150, 30, 12, bg_texture);

    for (let i = 0; i < 5; i++) {
        const bar = PlayerInfoBar(20, 20 + 40 + 10 + (10 + 30) * i, 150, 30, 12, bg_texture);
        sub_bar.push(bar);
        scaler.container.addChild(bar.container);
    }

    const hot_bar = HotBar(16, 10, 28, 12, bg_texture);
    scaler.container.addChild(hot_bar.container);

    const compass = Compass(120, 50, 65, bg_texture);
    scaler.container.addChild(compass.container);

    const update = (state: SpaceViewState) => {
        bg.update(state);

        renderer.render({
            container: bg.container,
            target: bg_texture,
        });

        scaler.update(state);
        player.update(state);
        main_bar.update(state);

        sub_bar.forEach((bar) => {
            bar.update(state);
        });

        hot_bar.update(state);
    };

    return {
        container,
        update,
    };
}

// Define the structure of the component
interface RenderComponent<S> {
    container: Container;
    update: (state: S) => void;
}

class RenderComponentInstance<S> {
    private subcomponents: RenderComponentInstance<S>[];
    container: Container;
    private cb: (state: S) => void;

    addComponent(component: RenderComponent<S>): RenderComponentInstance<S> {
        this.container.addChild(component.container);
        const component_instance = new RenderComponentInstance<S>(component);
        this.subcomponents.push(component_instance);
        return component_instance;
    }

    update(state: S) {
        this.cb(state);
        this.subcomponents.forEach((component) => {
            component.cb(state);
        });
    }

    constructor(component: RenderComponent<S>) {
        this.subcomponents = [];
        this.container = component.container;
        this.cb = component.update;
    }
}

// Define the class that holds the array of components
export class SpaceViewRenderer {
    private components: RenderComponentInstance<SpaceViewState>[];
    private container: Container;

    constructor(app: Application) {
        this.components = [];
        this.container = new Container();
        this.addComponent(SpaceView(app.renderer));
        app.stage.addChild(this.container);
    }

    // Method to add a component
    addComponent(component: RenderComponent<SpaceViewState>) {
        const instance = new RenderComponentInstance<SpaceViewState>(component);
        this.components.push(instance);
        this.container.addChild(component.container);
        return instance;
    }

    // Method to update all components with a given state
    update(state: SpaceViewState): void {
        this.components.forEach((component) => {
            component.update(state);
        });
    }
}
