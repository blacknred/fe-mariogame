import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { Keys } from "./typings";

export class Player extends CanvasObject {
  constructor(protected canvas: HTMLCanvasElement, opts: CanvasObjectOpts) {
    super(canvas, opts);

    addEventListener("keydown", this.run.bind(this));
    addEventListener("keyup", this.stand.bind(this));

    // this.input?.on(Keys.up, () => {
    //   this.velocity.y -= 20;
    // });

    // this.input?.on(Keys.space, () => {
    //   this.velocity.y -= 20;
    // });

    // this.input?.on(Keys.right, () => {
    //   this.img = this.imgList![2];
    //   this.width = this.img.maxWidth!;
    // });

    // this.input?.onUp(Keys.right, () => {
    //   this.img = this.imgList![0];
    //   this.width = this.img.maxWidth!;
    // });

    // this.input?.on(Keys.left, () => {
    //   this.img = this.imgList![3];
    //   this.width = this.img.maxWidth!;
    // });

    // this.input?.onUp(Keys.left, () => {
    //   this.img = this.imgList![1];
    //   this.width = this.img.maxWidth!;
    // });
  }

  update() {
    // next sprite frame
    if (this.img?.frame != null) {
      this.img.frame!++;
      if (this.img.frame > this.img.maxFrame!) {
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
