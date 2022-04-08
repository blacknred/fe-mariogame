import { Decoration, Input, Player } from "./lib";
import { Keys } from "./lib/typings";

export class Game {
  // canvas context
  ctx: CanvasRenderingContext2D;

  // state
  isPaused = false;
  state: "idle" | "win" | "lose" = "idle";
  score = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private input: Input,
    private player: Player,
    private platforms: Decoration[],
    private decorations: Decoration[]
  ) {
    this.ctx = canvas.getContext("2d")!;

    this.animate = this.animate.bind(this);
    this.input.on(Keys.pause, this.pause.bind(this));
  }

  private pause() {
    if (this.state === "idle") {
      this.isPaused = !this.isPaused;
    }
  }

  private move() {
    // player & decorations move logic
    if (this.input.has(Keys.right) && this.player.position.x < 400) {
      // player can move horizontally before he reaches 400px
      this.player.velocity.x = this.player.speed;
    } else if (
      this.input.has(Keys.left) &&
      this.player.position.x > 10
      // || (this.scrollOffset === 0 && this.player.position.x > 0))
    ) {
      // he cannot returns back more than 10px
      this.player.velocity.x = -this.player.speed;
    } else {
      // when player reached 400 px he stands and decorations start move(parallax)
      this.player.velocity.x = 0;

      if (this.input.has(Keys.right)) {
        // enlarge scoring
        this.score += this.player.speed;

        // scroll platforms
        this.platforms.forEach((platform) => {
          platform.position.x -= this.player.speed;
        });

        // scroll decorations with parallax due the smaller step
        this.decorations.forEach((decoration) => {
          decoration.position.x -= this.player.speed * 0.5;
        });
      } else if (this.input.has(Keys.left) /*&& this.scrollOffset > 0*/) {
        // reduce scoring
        this.score -= this.player.speed;

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

    // platform logic: player is holded on platform
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
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.decorations.forEach((decoration) => {
      decoration.update();
    });

    this.platforms.forEach((platform) => {
      platform.update();
    });

    this.player.update();
  }

  private displayStatus() {
    this.ctx.textAlign = "left";
    this.ctx.fillStyle = "black";
    this.ctx.font = "22px Helvetica";
    this.ctx.fillText(`Score: ${this.score}`, 20, 50);
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${this.score}`, 23, 53);

    const width = this.canvas.width / 2;
    this.ctx.textAlign = "center";

    if (this.isPaused) {
      this.ctx.fillText("Paused, press Esc to back to game", width, 200);
      return;
    }

    if (this.state === "idle") return;

    const text = this.state === "lose" ? "GAME OVER" : "YOU WIN";
    this.ctx.fillText(text, width, 200);
    this.ctx.fillText(`You scored ${this.score}`, width, 240);
    this.ctx.fillText(`Press Enter to try again!`, width, 280);
  }

  private animate() {
    // recursive running
    requestAnimationFrame(this.animate);
    this.displayStatus();

    // on pause
    if (this.isPaused) return;

    // on restart
    if (this.state === "lose" || this.state === "win") {
      if (!this.input.has(Keys.enter)) return;
      this.reset();
    }

    // render
    this.render();

    // move handler
    this.move();

    // detect win: reach end of the last platform
    if (this.platforms[this.platforms.length - 1].position.x < 0) {
      this.state = "win";
    }

    // detect lose: fell from platform or touched by enemy
    if (this.player.position.y > this.canvas.height) {
      this.state = "lose";
    }
  }

  private reset() {
    this.state = "idle";
    this.score = 0;

    this.decorations.forEach((decoration) => {
      decoration.reset();
    });

    this.platforms.forEach((platform) => {
      platform.reset();
    });

    this.player.reset();
  }

  start() {
    this.animate();
  }
}
