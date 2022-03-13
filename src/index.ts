import { Keys } from "./lib/typings";
import { Player, Platform, Input, Decoration } from "./lib";
import platformImg from "./sprites/platform.png";
import hillsImg from "./sprites/hills.png";
import bgImg from "./sprites/bg.png";
import "./style.css";

window.addEventListener("load", function () {
  // create canvas
  const canvas = document.body.appendChild(document.createElement("canvas"));
  const ctx = canvas.getContext("2d")!;
  canvas.width = 1024;
  canvas.height = 576;

  // scoring
  let scrollOffset = 0;

  // input handler
  const input = new Input(Object.values(Keys));

  // player
  const player = new Player(canvas, {
    x: 100,
    y: 100,
  });
  this.addEventListener("keydown", (e: KeyboardEvent) => {
    switch (e.key) {
      case Keys.up:
      case Keys.space:
        player.velocity.y -= 20;
        break;
      default:
    }
  });

  // decorations
  const decorations = [
    new Decoration(canvas, {
      img: bgImg,
      x: -1,
      y: -1,
    }),
    new Decoration(canvas, {
      img: hillsImg,
      x: -1,
      y: -1,
    }),
  ];

  // platforms
  const platforms = [
    new Platform(canvas, {
      img: platformImg,
      x: -1,
      y: 470,
    }),
    new Platform(canvas, {
      img: platformImg,
      x: 578,
      y: 470,
    }),
  ];

  /** Game engine */

  function animate() {
    // recursive running
    requestAnimationFrame(animate);

    // clear all at first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render decorations
    decorations.forEach((decoration) => {
      decoration.update();
    });

    // render platforms
    platforms.forEach((platform) => {
      platform.update();
    });

    // render player
    player.update();

    // player moves horizontally only within 300px
    if (input.has(Keys.right) && player.position.x < 400) {
      player.velocity.x = 5;
    } else if (input.has(Keys.left) && player.position.x > 100) {
      player.velocity.x = -5;
    } else {
      player.velocity.x = 0;

      // while player stands
      if (input.has(Keys.right)) {
        // enlarge scoring
        scrollOffset += 5;

        // scroll platforms
        platforms.forEach((platform) => {
          platform.position.x -= 5;
        });

        // scroll decorations with parallax due the smaller step
        decorations.forEach((decoration) => {
          decoration.position.x -= 2;
        });
      } else if (input.has(Keys.left)) {
        // reduce scoring
        scrollOffset -= 5;

        // scroll platforms
        platforms.forEach((platform) => {
          platform.position.x += 5;
        });

        // scroll decorations with parallax due the smaller step
        decorations.forEach((decoration) => {
          decoration.position.x += 2;
        });
      }
    }

    // collision detection
    platforms.forEach((platform) => {
      if (
        player.totalY <= platform.position.y &&
        player.totalY + player.velocity.y >= platform.position.y &&
        player.totalX >= platform.position.x &&
        player.position.x <= platform.totalX
      ) {
        player.velocity.y = 0;
      }
    });
  }

  // Run
  animate();
});
