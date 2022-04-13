import { CanvasObject } from "./canvasObject";
import { Keys } from "./typings";

export class Player extends CanvasObject {
  update(ctx: CanvasRenderingContext2D) {
    // next sprite frame
    if (this.img?.frame != null) {
      this.img.frame!++;
      if (this.img.frame > this.img.maxFrame!) {
        this.img.frame = 0;
      }
    }

    // rerender
    super.update(ctx);

    // step
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // while not on the ground accelerate the downing
    if (!(this.totalY + this.velocity.y >= ctx.canvas.height)) {
      this.velocity.y += this.gravity;
    }
  }

  // own

  intersects(target: CanvasObject) {
    const { width: w, height: h } = target;
    const { x, y } = target.position;

    const dx = x + w / 2 - (this.position.x + this.width / 2);
    const dy = y + h / 2 - (this.position.y + this.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < w / 2 + this.width / 2;
  }

  stands(target: CanvasObject) {
    if (this.totalY > target.position.y) return;
    if (this.totalY + this.velocity.y < target.position.y) return;
    if (this.totalX < target.position.x) return;
    if (this.position.x <= target.totalX) {
      this.velocity.y = 0;
    }
  }

  run = (key: string) => {
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

  stand = (key: string) => {
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
