import { Decoration, Enemy, Gift, Input, Platform, Player } from "./lib";
import { Keys } from "./lib/typings";

export class Game {
  // input
  private input: Input;

  // canvas
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // state
  private isPaused = false;
  private state: "idle" | "win" | "lose" = "idle";
  private score = 0;

  constructor(
    private decorations: Decoration[],
    private platforms: Platform[],
    private gifts: Gift[],
    private player: Player
  ) {
    // input
    this.input = new Input(Object.values(Keys));

    // bindings
    this.animate = this.animate.bind(this);

    // canvas
    this.canvas = document.body.appendChild(document.createElement("canvas"));
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.font = "22px Helvetica";
    this.ctx.fillStyle = "white";

    // game control block
    this.input.on(Keys.pause, this.pause.bind(this));
    const topCtrl = document.body.appendChild(document.createElement("div"));
    topCtrl.classList.add("control", "top");
    topCtrl
      .appendChild(document.createElement("span"))
      .addEventListener("click", this.pause.bind(this));
    topCtrl
      .appendChild(document.createElement("span"))
      .addEventListener("click", this.fullScreen.bind(this));

    // move control block
    this.player.useInput(this.input);
    const moveCtrl = document.body.appendChild(document.createElement("div"));
    moveCtrl.classList.add("control", "move");
    this.input.mouse(
      moveCtrl.appendChild(document.createElement("span")),
      Keys.left
    );
    this.input.mouse(
      moveCtrl.appendChild(document.createElement("span")),
      Keys.up
    );
    this.input.mouse(
      moveCtrl.appendChild(document.createElement("span")),
      Keys.right
    );
  }

  private render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const { width: pwidth, height: pheight } = this.player;
    const { x: px, y: py } = this.player.position;

    // put in order
    this.decorations.forEach((decoration) => decoration.update(this.ctx));

    this.platforms.forEach((platform) => {
      platform.update(this.ctx);
    });

    this.gifts.forEach((gift) => {
      if (gift.hidden) return;

      gift.update(this.ctx);
      const { width, height, score } = gift;
      const { x, y } = gift.position;

      const dx = x + width / 1.8 - (px + pwidth / 1.8);
      const dy = y + height / 1.8 - (py + pheight / 1.8);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < width / 2 + pwidth / 2) {
        gift.hidden = true;
        this.score += score;
      }
    });

    this.player.update(this.ctx);
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
    this.displayScore();

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

    this.decorations.forEach((decoration) => decoration.reset());
    this.platforms.forEach((platform) => platform.reset());
    this.gifts.forEach((gift) => gift.reset());
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
    const width = this.canvas.width / 2;
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

  start() {
    this.animate();
  }

  // TODO: can be refactored to canvasObject?

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
        // scroll platforms
        this.platforms.forEach((platform) => {
          platform.position.x -= this.player.speed;
        });

        // scroll gifts
        this.gifts.forEach((gift) => {
          gift.position.x -= this.player.speed;
        });

        // scroll decorations with parallax due the smaller step
        this.decorations.forEach((decoration) => {
          decoration.position.x -= this.player.speed * 0.5;
        });
      } else if (this.input.has(Keys.left) /*&& this.scrollOffset > 0*/) {
        // scroll platforms
        this.platforms.forEach((platform) => {
          platform.position.x += this.player.speed;
        });

        // scroll gifts
        this.gifts.forEach((gift) => {
          gift.position.x += this.player.speed;
        });

        // scroll decorations with parallax due the smaller step
        this.decorations.forEach((decoration) => {
          decoration.position.x += this.player.speed * 0.5;
        });
      }
    }

    // platform logic: player on platform
    this.platforms.forEach((platform) => {
      if (this.player.totalY > platform.position.y) return;
      if (this.player.totalY + this.player.velocity.y < platform.position.y)
        return;
      if (this.player.totalX < platform.position.x) return;
      if (this.player.position.x <= platform.totalX) {
        this.player.velocity.y = 0;
      }
    });
  }
}
