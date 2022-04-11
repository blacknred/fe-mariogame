import { CanvasObject } from "./canvasObject";
import { Input } from "./input";
import { Keys } from "./typings";

export class Player extends CanvasObject {
  useInput(input: Input) {
    input.on([Keys.left, Keys.up, Keys.right], this.run.bind(this));
    input.off([Keys.left, Keys.right], this.stand.bind(this));
  }

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

    // move acceleration | stopping
    if (!this.onGround()) {
      this.velocity.y += this.gravity;
    }
  }

  run(key: string) {
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
  }

  stand(key: string) {
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
  }
}
