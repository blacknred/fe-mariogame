import { Axes, Size, Sprite } from "./typings";

export interface CanvasObjectOpts extends Axes, Partial<Size> {
  imgs?: (string | (Omit<Sprite, "img"> & { img: string }))[];
}

export abstract class CanvasObject {
  // object size
  public width = 0;
  public height = 0;

  // start point to drawing
  private initialPosition: Axes;
  public position: Axes;

  // direction & speed of object move
  public velocity: Axes = { x: 0, y: 0 };

  // move speed & acceleration
  public speed = 10;
  protected gravity = 1.5;

  // sprite
  protected img?: Sprite;
  protected imgList?: Sprite[];

  constructor(opts: CanvasObjectOpts) {
    const { imgs, width, height, ...position } = opts;

    this.initialPosition = { ...position };
    this.position = position;

    if (imgs) {
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

  get totalY() {
    return this.position.y + this.height;
  }

  get totalX() {
    return this.position.x + this.width;
  }

  private draw(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position;

    if (this.img) {
      const { img, frame, cropWidth } = this.img;

      if (cropWidth && frame) {
        const crop = [cropWidth * frame, 0, cropWidth, img.height] as const;

        ctx.drawImage(img, ...crop, x, y, this.width, this.height);
      } else {
        ctx.drawImage(img, x, y, this.width, this.height);
      }
    } else {
      ctx.fillRect(x, y, this.width, this.height);
    }
  }

  public update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
  }

  public reset() {
    this.velocity = { x: 0, y: 0 };
    this.position = { ...this.initialPosition };
    
    if (this.imgList?.length) {
      this.img = this.imgList[0];
    }
  }
}
