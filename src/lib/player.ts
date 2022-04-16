import { CanvasObject } from "./canvasObject";
import { Keys } from "./typings";

export class Player extends CanvasObject {
  update(ctx: CanvasRenderingContext2D) {
    super.update(ctx);

    // while not on the ground accelerate the downing
    if (!(this.totalY + this.velocity.y >= ctx.canvas.height)) {
      this.velocity.y += this.gravity;
    }
  }

  /** Check if player intersects another CanvasObject */

  intersects(target: CanvasObject) {
    const { width: w, height: h } = target;
    const { x, y } = target.position;

    const dx = x + w / 1.8 - (this.position.x + this.width / 1.8);
    const dy = y + h / 1.8 - (this.position.y + this.height / 1.8);
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < w / 1.8 + this.width / 1.8;
  }

  /** Check if player stands on platform */

  standsOn(target: CanvasObject) {
    if (this.totalY > target.position.y) return;
    if (this.totalY + this.velocity.y < target.position.y) return;
    if (this.totalX < target.position.x) return;
    if (this.position.x > target.totalX) return;

    this.velocity.y = 0;
    return true;
  }

  /** Moving */

  move = (key: string) => {
    switch (key) {
      case Keys.up:
      case Keys.space:
        this.velocity.y -= 20;
        break;
      case Keys.right:
        this.img = this.imgList![2];
        this.width = this.img.maxWidth!;
        break;
      case Keys.left:
        this.img = this.imgList![3];
        this.width = this.img.maxWidth!;
        break;
      default:
    }
  };

  /** Standing */

  idle = (key?: string) => {
    switch (key) {
      case Keys.right:
        this.img = this.imgList![0];
        this.width = this.img.maxWidth!;
        break;
      case Keys.left:
        this.img = this.imgList![1];
        this.width = this.img.maxWidth!;
        break;
      default:
    }
  };
}
