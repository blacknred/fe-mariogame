import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { Keys } from "./typings";

export class Player extends CanvasObject {
  constructor(protected canvas: HTMLCanvasElement, opts: CanvasObjectOpts) {
    super(canvas, opts);

    this.run = this.run.bind(this);
    this.stand = this.stand.bind(this);

    removeEventListener("keydown", this.run);
    removeEventListener("keyup", this.stand);
    addEventListener("keydown", this.run);
    addEventListener("keyup", this.stand);
  }

  update() {
    // next sprite frame
    if (this.img?.frame != null) {
      this.img.frame!++;
      if (this.img.frame! > this.img.framesQnt!) {
        this.img.frame = 0;
      }
    }

    // rerender
    super.update();

    // step
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // move acceleration | stopping
    if (!this.onGround()) {
      this.velocity.y += this.gravity;
    }
  }

  run(e: KeyboardEvent) {
    switch (e.key) {
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

  stand(e: KeyboardEvent) {
    switch (e.key) {
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
