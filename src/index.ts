import { Player, Platform, Input } from "./lib";
import { Keys } from "./lib/typings";

window.addEventListener("load", function () {
  // create canvas
  const canvas = document.createElement("canvas");
  canvas.width = this.window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  const el = document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  // init
  const input = new Input(Object.values(Keys));
  const player = new Player(canvas, {
    x: 100,
    y: 100,
  });
  const platforms = [
    new Platform(canvas, {
      x: 200,
      y: 100,
    }),
    new Platform(canvas, {
      x: 500,
      y: 200,
    }),
  ];

  this.addEventListener("keydown", (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
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
    player.update();
    platforms.forEach((platform) => {
      platform.update();
    });

    // horizontal move
    if (input.has(Keys.right) && player.position.x < 400) {
      player.velocity.x = 5;
    } else if (input.has(Keys.left) && player.position.x > 100) {
      player.velocity.x = -5;
    } else {
      player.velocity.x = 0;

      if (input.has(Keys.right)) {
        platforms.forEach((platform) => {
          platform.position.x -= 5;
        });
      } else if (input.has(Keys.left)) {
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
