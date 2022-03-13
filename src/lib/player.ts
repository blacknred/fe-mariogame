import { CanvasObject } from "./canvasObject";

export class Player extends CanvasObject {
  width = 66;
  height = 150;

  cropWidth = 177;

  update() {
    // next sprite frame
    this.imgFrame++;
    if (this.imgFrame > 29) this.imgFrame = 0;

    // rerender
    this.draw();

    // step
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // move acceleration | stopping
    if (!this.onGround()) {
      this.velocity.y += this.gravity;
    }
  }

  draw() {
    const { x, y } = this.position;

    const crop = [
      this.cropWidth * this.imgFrame,
      0,
      this.cropWidth,
      this.img!.height,
    ] as const;
    this.ctx.drawImage(this.img!, ...crop, x, y, this.width, this.height);
  }
}
