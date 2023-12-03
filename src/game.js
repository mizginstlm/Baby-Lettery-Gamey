import gsap, { Power0, random } from "gsap";
import { Container, Sprite, Graphics } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH, ballSize } from ".";
import * as PIXI from "pixi.js";
import { app } from "./index";

export default class Game extends Container {
  constructor() {
    super();

    this.init();
  }

  async init() {
    let sprite = Sprite.from("logo");
    sprite.anchor.set(0.5);
    sprite.scale.set(0.5);
    this.addChild(sprite);
    sprite.x = GAME_WIDTH * 0.5;
    sprite.y = GAME_HEIGHT * 0.5;

    gsap.to(sprite, {
      pixi: {
        scale: 0.6,
      },
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.easeInOut",
    });
    setTimeout(() => {
      // Change the background color to a different color (e.g., blue)
      this.removeChild(sprite);
    }, 2000);
  }
}
