import { Axes } from "./typings";

export abstract class CanvasObject {
  // canvas & img ref
  private ctx: CanvasRenderingContext2D;
  private img?: HTMLImageElement;

  // object size
  public width = 0;
  public height = 0;

  // start point to drawing
  public position: Axes;

  // direction & speed of object move
  public velocity: Axes = {
    x: 0,
    y: 0,
  };

  // move acceleration
  protected gravity = 1.5;

  constructor(
    protected canvas: HTMLCanvasElement,
    opts: Axes & { img?: string }
  ) {
    const { img, ...position } = opts;

    this.ctx = this.canvas.getContext("2d")!;
    this.position = position;

    if (img) {
      this.img = new Image();
      this.img.src = img;

      this.width = this.img.width;
      this.height = this.img.height;
    }
  }

  protected draw() {
    const { x, y } = this.position;
    
    if (this.img) {
      this.ctx.drawImage(this.img, x, y);
    } else {
      this.ctx.fillRect(x, y, this.width, this.height);
    }
  }

  abstract update(): void;
}
