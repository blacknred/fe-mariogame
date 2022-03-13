import { Player } from "./lib";

window.addEventListener("load", function () {
  // create canvas
  const canvas = document.createElement("canvas");
  canvas.width = this.window.innerWidth;
  canvas.height = window.innerHeight;
  const el = document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  // init
  const player = new Player(ctx);

  // run
  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update()
  }
  animate()
});
