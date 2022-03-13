import { CanvasObject } from "./canvasObject";

export class Player extends CanvasObject {
  private position = {
    x: 100,
    y: 100,
  };
  // define how object moves
  private velocity = {
    x: 0,
    y: 0,
  };
  // move acceleration
  private gravity = 0.5;

  // size of object
  private width = 30;
  private height = 30;

  private draw() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
    this.velocity.y += this.gravity;
  }
}
