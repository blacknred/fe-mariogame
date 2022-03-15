import { Decoration, Input, Player } from ".";
import { Keys } from "./typings";

export class Game {
  // scoring
  scrollOffset = 0;
  ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private input: Input,
    private player: Player,
    private platforms: Decoration[],
    private decorations: Decoration[]
  ) {
    this.ctx = canvas.getContext("2d")!;

    this.animate = this.animate.bind(this);
  }

  private animate() {
    // recursive running
    requestAnimationFrame(this.animate);

    // clear all at first
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // render decorations
    this.decorations.forEach((decoration) => {
      decoration.update();
    });

    // render platforms
    this.platforms.forEach((platform) => {
      platform.update();
    });

    // render player
    this.player.update();

    // player moves horizontally only within 300px
    if (this.input.has(Keys.right) && this.player.position.x < 400) {
      this.player.velocity.x = this.player.speed;
    } else if (
      this.input.has(Keys.left) &&
      (this.player.position.x > 100 ||
        (this.scrollOffset === 0 && this.player.position.x > 0))
    ) {
      this.player.velocity.x = -this.player.speed;
    } else {
      this.player.velocity.x = 0;

      // while player stands
      if (this.input.has(Keys.right)) {
        // enlarge scoring
        this.scrollOffset += this.player.speed;

        // scroll platforms
        this.platforms.forEach((platform) => {
          platform.position.x -= this.player.speed;
        });

        // scroll decorations with parallax due the smaller step
        this.decorations.forEach((decoration) => {
          decoration.position.x -= this.player.speed * 0.5;
        });
      } else if (this.input.has(Keys.left) && this.scrollOffset > 0) {
        // reduce scoring
        this.scrollOffset -= this.player.speed;

        // scroll platforms
        this.platforms.forEach((platform) => {
          platform.position.x += this.player.speed;
        });

        // scroll decorations with parallax due the smaller step
        this.decorations.forEach((decoration) => {
          decoration.position.x += this.player.speed * 0.5;
        });
      }
    }

    // collision detection
    this.platforms.forEach((platform) => {
      if (
        this.player.totalY <= platform.position.y &&
        this.player.totalY + this.player.velocity.y >= platform.position.y &&
        this.player.totalX >= platform.position.x &&
        this.player.position.x <= platform.totalX
      ) {
        this.player.velocity.y = 0;
      }
    });

    // detect win
    if (this.scrollOffset > 2000) {
      console.log("you are win");
      return;
    }

    // restart on lose
    if (this.player.position.y > this.canvas.height) {
      this.decorations.forEach((decoration) => {
        decoration.reset();
      });

      this.platforms.forEach((platform) => {
        platform.reset();
      });

      this.player.reset();
    }
  }

  run() {
    this.animate();
  }
}
