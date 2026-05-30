import { Application, Assets, Sprite, Texture, Ticker } from "pixi.js";
import { OldFilmFilter } from "pixi-filters";
const hall_texture_paths = ["/assets/usa_far.png", "/assets/usa_med.png", "/assets/usa_close.png"];
const interactive_texture_paths = ["/assets/peephole.png", "/assets/clanta.png", "/assets/nameplate.png"];
const interactive_sprite_positions = [
  { x: 725, y: 200 },
  { x: 550, y: 500 },
  { x: 725, y: 350 },
];
const big_nameplate_texture_paths = ["/assets/nameplate_big.png"];

let hall_step = 0;
let big_nameplate_visible = false;
const hall_step_end = hall_texture_paths.length - 1;
const textures = await Assets.load([...hall_texture_paths, ...interactive_texture_paths, ...big_nameplate_texture_paths]);
const video = await Assets.load("/assets/video.mp4");
(async () => {
  // Create a new application
  const app = new Application();

  const oldFilmFilter = new OldFilmFilter({
    sepia: 0.5,
    noise: 0.2,
    scratch: 0.5,
    vignetting: 0.5,
    vignettingAlpha: 0.5,
    vignettingBlur: 0.5

  });
  const ticker = new Ticker();
  ticker.add(() => {
    oldFilmFilter.seed = Math.random() // <-- this line is needed
  })
  app.ticker = ticker;
  ticker.start();
  app.stage.filters = [oldFilmFilter];


  // Initialize the application
  await app.init({ background: "#000000", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // const texture = Texture.from(video);

  const hall_sprite = new Sprite(textures[hall_texture_paths[hall_step]]);
  hall_sprite.anchor.set(0.5);
  hall_sprite.position.set(app.screen.width / 2, app.screen.height / 2);

  const interactive_sprites = interactive_texture_paths.map((path) => {
    const sprite = new Sprite(textures[path]);
    sprite.anchor.set(0.5);
    sprite.position.set(interactive_sprite_positions[interactive_texture_paths.indexOf(path)].x, interactive_sprite_positions[interactive_texture_paths.indexOf(path)].y);
    return sprite;
  });

  const nameplate_sprite = new Sprite(textures[big_nameplate_texture_paths[0]]);
  nameplate_sprite.anchor.set(0.5);
  nameplate_sprite.position.set(app.screen.width / 2, app.screen.height / 2);
  nameplate_sprite.visible = big_nameplate_visible;
  app.stage.addChild(hall_sprite);
  interactive_sprites.forEach((sprite) => {
    sprite.visible = false;
    app.stage.addChild(sprite)

  });

  const walkHallFn = (e) => {
    if (hall_step < hall_step_end) {
      hall_step++;
      hall_sprite.texture = textures[hall_texture_paths[hall_step]];
    }
    if (hall_step == hall_step_end) {
      interactive_sprites.forEach((sprite) => sprite.visible = true);
    }
  }

  const hideNameplateFn = (e) => {
    big_nameplate_visible = !big_nameplate_visible;
    nameplate_sprite.visible = big_nameplate_visible;
  }
  const toggleNameplateFn = (e) => {
    console.log("clack")
    big_nameplate_visible = !big_nameplate_visible;
    nameplate_sprite.visible = big_nameplate_visible;
  }
  hall_sprite.eventMode = 'static';
  hall_sprite.on('pointerdown', walkHallFn);
  interactive_sprites[0].eventMode = 'static';
  interactive_sprites[0].on('pointertap', onPlayVideo);
  interactive_sprites[1].eventMode = 'static';
  interactive_sprites[1].on('pointertap', onClickClanta);
  interactive_sprites[2].eventMode = 'static';
  interactive_sprites[2].on('pointertap', toggleNameplateFn);
  nameplate_sprite.eventMode = 'static';
  nameplate_sprite.on('pointertap', hideNameplateFn);

  app.stage.addChild(nameplate_sprite);

  function onClickClanta() {
    alert("clack")
  }
  function onPlayVideo() {
    const videoSprite = new Sprite(video);

    // Stetch the fullscreen
    videoSprite.width = app.screen.width;
    videoSprite.height = app.screen.height;

    app.stage.addChild(videoSprite);

  }
})();
