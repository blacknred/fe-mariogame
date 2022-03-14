import { Axes, Size, Sprite } from "./typings";

export interface CanvasObjectOpts extends Axes, Partial<Size> {
  imgs?: (string | (Omit<Sprite, "img"> & { img: string }))[];
}
export abstract class CanvasObject {
  // canvas ref
  protected ctx: CanvasRenderingContext2D;

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

  // move speed & acceleration
  public speed = 10;
  protected gravity = 1.5;

  // img
  protected img?: Sprite;
  protected imgList?: Sprite[];

  constructor(protected canvas: HTMLCanvasElement, opts: CanvasObjectOpts) {
    const { imgs, width, height, ...position } = opts;

    this.ctx = this.canvas.getContext("2d")!;
    this.position = position;

    if (Array.isArray(imgs)) {
      this.imgList = imgs.map((img) => {
        const image = new Image();

        if (typeof img !== "string") {
          image.src = img.img;
          return { ...img, img: image, frame: 0 };
        } else {
          image.src = img;
          return { img: image };
        }
      });

      this.img = this.imgList[0];
    }

    this.width = width || this.img?.img.width || this.width;
    this.height = height || this.img?.img.height || this.height;
  }

  protected draw() {
    const { x, y } = this.position;

    if (this.img) {
      const { img, frame, cropWidth } = this.img;

      if (cropWidth && frame) {
        const crop = [cropWidth * frame, 0, cropWidth, img.height] as const;

        this.ctx.drawImage(img, ...crop, x, y, this.width, this.height);
      } else {
        this.ctx.drawImage(img, x, y, this.width, this.height);
      }
    } else {
      this.ctx.fillRect(x, y, this.width, this.height);
    }
  }

  public abstract update(): void;

  // extras

  get totalY() {
    return this.position.y + this.height;
  }

  get totalX() {
    return this.position.x + this.width;
  }

  protected onGround() {
    return this.totalY + this.velocity.y >= this.canvas.height;
  }
}
