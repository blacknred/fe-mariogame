import { Player } from "./lib";

window.addEventListener("load", function () {
  // create canvas
  const canvas = document.createElement("canvas");
  canvas.width = this.window.innerWidth - 20;
  canvas.height = window.innerHeight - 20;
  const el = document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  // init
  const player = new Player(canvas);

  // input
  this.addEventListener("keydown", (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        break;
      case "ArrowUp":
        player.velocity.y -= 20;
        break;
      case "ArrowLeft":
        player.velocity.x = -5;
        break;
      case "ArrowRight":
        player.velocity.x = 5;
        break;
      case "Enter":
        break;
      default:
    }
  });

  this.addEventListener("keyup", (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        break;
      case "ArrowUp":
        break;
      case "ArrowLeft":
        player.velocity.x = 0;
        break;
      case "ArrowRight":
        player.velocity.x = 0;
        break;
      case "Enter":
        break;
      default:
    }
  });

  // run
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
  }
  animate();
});
