import { Assets } from "pixi.js";

export async function importAssets() {
    await Promise.all([
        Assets.load("assets/pointer.png"),
        Assets.load("assets/player.png"),
        Assets.load("assets/sun.png"),
        Assets.load("assets/starfield.png"),
        Assets.load("assets/starfield-colorful.png"),
        Assets.load("assets/bgs/1024/Starfields/Starfield_01-1024x1024.png"),
        Assets.load("assets/bgs/1024/Purple Nebula/Purple_Nebula_01-1024x1024.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Airless/Airless_01-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Airless/Airless_02-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Airless/Airless_03-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Airless/Airless_04-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Airless/Airless_05-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Arid/Arid_01-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Arid/Arid_02-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Arid/Arid_03-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Arid/Arid_04-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Arid/Arid_05-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Oasis/Oasis_01-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Oasis/Oasis_02-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Oasis/Oasis_03-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Oasis/Oasis_04-128x128.png"),
        Assets.load("assets/planets/128/Unshaded Solid/Oasis/Oasis_05-128x128.png"),
    ]);
}
