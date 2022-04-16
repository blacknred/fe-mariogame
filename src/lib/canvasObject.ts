import { Axes, Size, Sprite } from "./typings";

export interface CanvasObjectOpts extends Axes, Partial<Size> {
  imgs?: (string | (Omit<Sprite, "img"> & { img: string }))[];
}

export abstract class CanvasObject {
  /**  Size */
  public width = 0;
  public height = 0;
  /** Start point */
  public position: Axes;
  public _position: Axes;
  // direction & speed of object move
  public velocity: Axes = { x: 0, y: 0 };
  /** Move speed */
  public speed = 10;
  /** Move acceleration */
  protected gravity = 1.5;
  /** Active image */
  protected img?: Sprite;
  /** Image list */
  protected imgList?: Sprite[];// [idle, move]
  /** Visibility */
  public hidden = false;

  constructor(opts: CanvasObjectOpts) {
    const { imgs, width, height, ...position } = opts;

    this._position = position;
    this.position = { ...this._position };

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

  /** Total height */

  get totalY() {
    return this.position.y + this.height;
  }

  /** Total width */

  get totalX() {
    return this.position.x + this.width;
  }

  /** Canvas drawing */

  private draw(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position;

    if (!this.img) {
      // draw rectangle
      ctx.fillRect(x, y, this.width, this.height);
      return;
    }

    const { img, frame, cropWidth, maxFrame } = this.img;

    // next sprite frame
    if (frame != null) {
      if (++this.img.frame! === maxFrame!) {
        this.img.frame = 0;
      }
    }

    if (cropWidth && frame != null) {
      // draw image per frame
      const crop = [cropWidth * frame, 0, cropWidth, img.height] as const;
      ctx.drawImage(img, ...crop, x, y, this.width, this.height);
    } else {
      // draw whole image
      ctx.drawImage(img, x, y, this.width, this.height);
    }
  }

  /** Updating */

  public update(ctx: CanvasRenderingContext2D) {
    // update position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (!this.hidden) {
      this.draw(ctx);
    }
  }

  /** Resetting */

  public reset() {
    this.hidden = false;
    this.velocity = { x: 0, y: 0 };
    this.position = { ...this._position };

    if (this.imgList?.length) {
      this.img = this.imgList[0];
    }
  }

  /** Move right */

  public moveRight() {
    this.velocity.x = this.speed;
  }

  /** Move left */

  public moveLeft() {
    this.velocity.x = -this.speed;
  }

  /** Idle */

  public idle() {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
}
