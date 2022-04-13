import { Decoration, Input, Platform, Player } from "./lib";
import { Keys } from "./lib/typings";

export class Game {
  // input
  private input: Input;

  // canvas
  private ctx: CanvasRenderingContext2D;

  // state
  private isPaused = false;
  private state: "idle" | "win" | "lose" = "idle";
  private score = 0;

  constructor(
    private decorations: Decoration[],
    private platforms: Platform[],
    private player: Player
  ) {
    // input
    this.input = Input.getInstance();

    // find last platform
    [...this.platforms].sort((a, b) => b.totalX - a.totalX)[0].isLast = true;

    // canvas
    this.ctx = document.body
      .appendChild(document.createElement("canvas"))
      .getContext("2d")!;
    this.ctx.canvas.width = document.body.clientWidth;
    this.ctx.canvas.height = document.body.clientHeight;
    this.ctx.font = "22px Helvetica";
    this.ctx.fillStyle = "white";

    // game controls
    this.input.on(Keys.pause, this.pause.bind(this));
    const header = document.body.appendChild(document.createElement("div"));
    header.classList.add("control", "top");
    header
      .appendChild(document.createElement("span"))
      .addEventListener("click", this.pause.bind(this));
    header
      .appendChild(document.createElement("span"))
      .addEventListener("click", this.fullScreen.bind(this));

    // move controls
    this.input.on([Keys.left, Keys.up, Keys.right], this.player.run);
    this.input.off([Keys.left, Keys.right], this.player.stand);
    const bottom = document.body.appendChild(document.createElement("div"));
    bottom.classList.add("control", "move");
    this.input.click(
      bottom.appendChild(document.createElement("span")),
      Keys.left
    );
    this.input.click(
      bottom.appendChild(document.createElement("span")),
      Keys.up
    );
    this.input.click(
      bottom.appendChild(document.createElement("span")),
      Keys.right
    );
  }

  private reset() {
    this.state = "idle";
    this.score = 0;

    this.decorations.forEach((decoration) => decoration.reset());
    this.platforms.forEach((platform) => platform.reset());
    this.player.reset();
  }

  private pause() {
    if (this.state === "idle") {
      this.isPaused = !this.isPaused;
    }
  }

  private fullScreen() {
    if (!document.fullscreenElement) {
      document.body.requestFullscreen().catch(console.log);
    } else {
      document.exitFullscreen();
    }
  }

  private displayScore() {
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Score: ${this.score}`, 20, 50);
  }

  private displayStatus() {
    const width = this.ctx.canvas.width / 2;
    this.ctx.textAlign = "center";

    if (this.isPaused) {
      const message = "Paused, press pause button or Esc to back to game";
      this.ctx.fillText(message, width, 200);
      return;
    }

    if (this.state === "idle") return;

    const text = this.state === "lose" ? "GAME OVER" : "YOU WIN";
    this.ctx.fillText(text, width, 200);
    this.ctx.fillText(`You scored ${this.score}`, width, 240);
    this.ctx.fillText(`Press Enter to try again!`, width, 280);
  }

  private animate = () => {
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
    this.displayScore();
  };

  start() {
    this.animate();
  }

  // main game logic

  private render() {
    const { width: totalW, height: totalH } = this.ctx.canvas;

    // clear canvas
    this.ctx.clearRect(0, 0, totalW, totalH);

    // render decorations
    this.decorations.forEach((decoration) => {
      // decoration moves with parallax(speed reduced twice)
      if (this.input.has(Keys.right)) {
        decoration.position.x -= decoration.speed * 0.5;
      } else if (this.input.has(Keys.left)) {
        decoration.position.x += decoration.speed * 0.5;
      }

      decoration.update(this.ctx);
    });

    // render platforms
    this.platforms.forEach((platform) => {
      const { x } = platform.position;

      // platform moves
      if (this.input.has(Keys.right)) {
        platform["position.x"] -= platform.speed;
      } else if (this.input.has(Keys.left)) {
        platform["position.x"] += platform.speed;
      }

      // work only with platforms in viewport
      if (this.player.position.x - x > totalW) return;
      if (x - this.player.position.x > totalW) return;

      platform.update(this.ctx);

      // work only with current platform

      // player is hold on the platform
      this.player.stands(platform);

      // check win: player reached end of the last platform
      if (platform.isLast && platform.position.x < 0) {
        this.state = "win";
      }

      platform.enemies.forEach((enemy) => {
        // ckeck lose: player touched enemy
        if (this.player.intersects(enemy)) {
          enemy.hidden = true;
          this.state = "lose";
        }
      });

      platform.gifts.forEach((gift) => {
        // scoring: player touched gift
        if (this.player.intersects(gift)) {
          gift.hidden = true;
          this.score += gift.score;
        }
      });
    });

    // render player
    this.player.update(this.ctx);

    // check lose: player fell from a platform
    if (this.player.position.y > totalH) {
      this.state = "lose";
    }
  }
}
