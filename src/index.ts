import { Keys } from "./lib/typings";
import { Player, Platform, Input } from "./lib";
import platformImg from "./sprites/platform.png";
import './style.css'

window.addEventListener("load", function () {
  // create canvas
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 576;
  const el = document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  // init
  let scrollOffset = 0;

  const input = new Input(Object.values(Keys));

  const player = new Player(canvas, {
    x: 100,
    y: 100,
  });

  const platform1 = new Platform(canvas, {
    img: platformImg,
    x: -1,
    y: 470,
  });
  const platforms = [
    platform1,
    new Platform(canvas, {
      img: platformImg,
      x: platform1.width - 2,
      y: 470,
    }),
  ];

  this.addEventListener("keydown", (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
      case " ":
        player.velocity.y -= 20;
        break;
      default:
    }
  });

  // run
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // update
    platforms.forEach((platform) => {
      platform.update();
    });
    player.update();

    // horizontal move
    if (input.has(Keys.right) && player.position.x < 400) {
      player.velocity.x = 5;
    } else if (input.has(Keys.left) && player.position.x > 100) {
      player.velocity.x = -5;
    } else {
      player.velocity.x = 0;

      if (input.has(Keys.right)) {
        scrollOffset += 5;
        platforms.forEach((platform) => {
          platform.position.x -= 5;
        });
      } else if (input.has(Keys.left)) {
        scrollOffset -= 5;
        platforms.forEach((platform) => {
          platform.position.x += 5;
        });
      }
    }

    // collision detection
    platforms.forEach((platform) => {
      if (
        player.totalY <= platform.position.y &&
        player.totalY + player.velocity.y >= platform.position.y &&
        player.totalX >= platform.position.x &&
        player.position.x <= platform.position.x + platform.width
      ) {
        player.velocity.y = 0;
      }
    });
  }

  animate();
});
