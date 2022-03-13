import { CanvasObject } from "./canvasObject";

export class Player extends CanvasObject {
  // size of object
  private width = 30;
  private height = 30;

  // start point to draw
  private position = {
    x: 100,
    y: 100,
  };

  // direction & speed of object move
  velocity = {
    x: 0,
    y: 0,
  };

  // move acceleration
  private gravity = 0.5;

  private draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  private onGround() {
    return (
      this.position.y + this.height + this.velocity.y >= this.canvas.height
    );
  }

  update() {
    // rerender
    this.draw();
    // step
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // move acceleration | stopping
    if (this.onGround()) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += this.gravity;
    }
  }
}
