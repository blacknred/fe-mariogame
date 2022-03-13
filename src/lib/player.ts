import { CanvasObject } from "./canvasObject";

export class Player extends CanvasObject {
  width = 30;
  height = 30;

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
