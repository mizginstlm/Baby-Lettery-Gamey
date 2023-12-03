import * as PIXI from "pixi.js";
import { Application, Graphics } from "pixi.js";
import { initAssets } from "./assets";
import { gsap } from "gsap";
import { CustomEase, PixiPlugin } from "gsap/all";
import Game from "./game";

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const circleSize = 32;

export const app = new Application({
  backgroundColor: 0x000000,
  antialias: true,
  hello: true,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  interactive: true,
  buttonMode: true, //
});

app.ticker.stop();
gsap.ticker.add(() => {
  app.ticker.update();
});

async function init() {
  document.body.appendChild(app.view);
  let assets = await initAssets();
  gsap.registerPlugin(PixiPlugin, CustomEase);
  PixiPlugin.registerPIXI(PIXI);
  const game = new Game();
  app.stage.addChild(game);
  setTimeout(() => {
    games();
  }, 2000);
}

const gravity = 0.02;
var circles = [];
var clickedCircles = [];
var letters = "BCDEFAAAGHIOOOJKLMMNNNOPPEEEQRSSTVUUUWWXYIIIIZ";
var lettersOfCircles = [];
var word = "";
var numberOfBalls = 32;
var theseWordsPops = [
  "TOY",
  "SON",
  "AI",
  "DOL",
  "MEN",
  "NO",
  "HOT",
  "MOM",
  "SON",
  "BOY",
  "WIN",
  "HE",
  "SHE",
  "TEN",
  "MAN",
  "ME",
  "YOU",
  "WEB",
  "TEL",
  "A",
  "Y",
];
var iscross;
async function games() {
  app.renderer.background.color = 0xb197d7;

  for (let index = 0; index < numberOfBalls; index++) {
    var circle = new Graphics();
    var indexx = index * 4;
    circle.beginFill(0xffffff);
    const randomX = Math.random(GAME_WIDTH - circleSize);
    const randomY = Math.random(GAME_HEIGHT - circleSize);
    circle.drawCircle(randomX, randomY, circleSize);
    circle.endFill();

    circle.x = Math.random() * (GAME_WIDTH + circleSize - 1);
    circle.y = (Math.random() * (GAME_HEIGHT + circleSize - 1)) / 2;
    var widthCircle = Math.random() * 100;
    circle.width = widthCircle + 50;
    circle.height = widthCircle + 50;
    app.stage.addChild(circle);
    circle.interactive = true;
    circle.buttonMode = true;
    circles.push(circle);

    const randomLetter = letters.charAt(
      Math.floor(Math.random() * letters.length)
    );

    // Add the letter to the circle
    const texti = new PIXI.Text(randomLetter, {
      fontFamily: "Poppins",
      fontSize: 30,
      fontWeight: "bolder",
      fill: 0xb197d7,
      align: "center",
    });

    texti.x = circle.x - 5; // Adjust the X position
    texti.y = circle.y - 10;
    circle.text = texti.text;
    app.stage.addChild(texti);
    lettersOfCircles.push(texti);
  }

  const inputBackground = new PIXI.Graphics();
  inputBackground.beginFill(0x929090);
  inputBackground.drawRoundedRect(
    GAME_WIDTH / 10,
    (4 * GAME_HEIGHT) / 5,
    400,
    100,
    20
  ); // Adjust position, size, and radius as needed
  inputBackground.endFill();
  app.stage.addChild(inputBackground);

  var inputLetter = new PIXI.Text("  ", {
    fontFamily: "Poppins",
    fontSize: 40,
    fontWeight: "bolder",
    fill: 0xffffff,
    align: "center",
  });

  inputLetter.x = GAME_WIDTH / 6;
  inputLetter.y = (5 * GAME_HEIGHT) / 6;
  app.stage.addChild(inputLetter);
  inputLetter.visible = false;

  var submitItem = new PIXI.Text("", {
    fontFamily: "Poppins",
    fontSize: 40,
    fontWeight: "bolder",
    fill: 0xffffff,
    align: "center",
  });
  function onClick(event) {
    const clickedCircle = event.currentTarget; // Get the clicked circle
    clickedCircle.tint = 0xf3c28f;
    clickedCircles.push(clickedCircle);

    word = word.concat(clickedCircle.text);

    inputLetter.text = word;
    inputLetter.visible = true;

    submitItem.x = (4 * GAME_WIDTH) / 5;
    submitItem.y = (5 * GAME_HEIGHT) / 6 - 2;
    submitItem.interactive = true;
    submitItem.buttonMode = true;

    app.stage.addChild(submitItem);
    var isInclude = theseWordsPops.includes(word);

    if (!isInclude) {
      submitItem.text = "X";
      iscross = true;
      submitItem.on("pointerdown", removeCanceled);
    } else if (isInclude) {
      submitItem.text = "✓";
      submitItem.visible = true;

      iscross = false;
      submitItem.on("pointerdown", removeApproved);
      inputBackground.tint = 0xe2f0c1;
    }
  }

  function removeCanceled() {
    word = "";
    inputLetter.text = "";
    inputLetter.visible = false;
    clickedCircles.forEach((element) => {
      element.tint = 0xffffff;
    });
    submitItem.visible = false;
  }

  function removeApproved() {
    for (const clickedCircle of clickedCircles) {
      // Find the index of the clickedCircle in the circles array
      const index = circles.indexOf(clickedCircle);
      if (index !== -1) {
        // Remove the circle from the stage
        app.stage.removeChild(clickedCircle);

        // Remove the associated text from the stage
        app.stage.removeChild(lettersOfCircles[index]);

        // Remove the circle and text from their respective arrays
        circles.splice(index, 1);
        lettersOfCircles.splice(index, 1);
      }
      inputBackground.tint = 0x929090;
    }

    word = "";

    inputLetter.text = "";
    inputLetter.visible = false;
    clickedCircles.length = 0;
    submitItem.visible = false;
  }

  circles.forEach((circle) => {
    circle.on("pointerdown", onClick);
  });

  function checkCircleCollision(circleA, circleB) {
    const dx = circleB.x - circleA.x;
    const dy = circleB.y - circleA.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Use the sum of the radii for accurate collision detection
    const radiusSum = circleA.width / 2 + circleB.width / 2;

    return distance < radiusSum;
  }

  app.ticker.add(() => {
    for (const circle of circles) {
      circle.accelerationY = circle.accelerationY || 0;
      circle.y += circle.accelerationY;
    }
    for (let i = 0; i < circles.length; i++) {
      const circleA = circles[i];
      for (let j = i + 1; j < circles.length; j++) {
        const circleB = circles[j];
        if (checkCircleCollision(circleA, circleB)) {
          circleA.accelerationY *= -1;
        }
      }
    }
  });

  app.ticker.add(() => {
    //  gravity to circles
    for (const circle of circles) {
      if (500 >= circle.y) {
        circle.accelerationY = circle.accelerationY || 0;
        circle.accelerationY += gravity;
        circle.y += circle.accelerationY;
      } else {
        circle.accelerationY = 0;
        circle.accelerationY += 0;
        circle.y = circle.y;
      }
    }
  });

  app.ticker.add(() => {
    // gravity to circles and move text within the circles
    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const texts = lettersOfCircles[i];
      circle.accelerationY = circle.accelerationY || 0;
      circle.accelerationY += gravity;
      circle.y += circle.accelerationY;
      // Move text within the circle
      texts.x = circle.x - 5;
      texts.y = circle.y - 10;
    }
  });
}

init();
