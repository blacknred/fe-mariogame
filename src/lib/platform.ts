import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { PlatformObject } from "./platformObject";

export interface PlatformOpts extends CanvasObjectOpts {
  enemies?: PlatformObject[];
  gifts?: PlatformObject[];
}

class PlatformObjectCollection extends Array<PlatformObject> {
  *[Symbol.iterator]() {
    var i = 0;
    while (i < this.length) {
      if (this[i++].hidden) continue;
      else yield this[i++];
    }
  }
}

export class Platform extends CanvasObject {
  enemies = new PlatformObjectCollection();
  gifts = new PlatformObjectCollection();
  isLast = false;

  constructor(opts: PlatformOpts) {
    const { enemies, gifts, ...rest } = opts;
    super(rest);

    if (enemies) {
      this.enemies.push(...enemies.map(this.setChild.bind(this)));
    }

    if (gifts) {
      this.gifts.push(...gifts.map(this.setChild.bind(this)));
    }
  }

  public update(ctx: CanvasRenderingContext2D): void {
    // hide non viewport platform
    const { width: w } = ctx.canvas;
    const { x } = this.position;
    this.hidden = 0 - x >= w || x - 0 >= w;

    super.update(ctx);

    // update gifts & enemies
    this.gifts.forEach((item) => item.update(ctx));
    this.enemies.forEach((item) => item.move().update(ctx));
  }

  public reset() {
    super.reset();

    // reset gifts & enemies
    this.gifts.forEach((item) => item.reset());
    this.enemies.forEach((item) => item.reset());
  }

  /** Child setting */

  private setChild(item: PlatformObject) {
    const { x, y } = item.position;
    const { height } = item;

    if (x === -1) {
      item._position.x = this.position.x;
      item.position.x = this.position.x;
    }

    if (y === -1) {
      item._position.y = this.position.y - height;
      item.position.y = this.position.y - height;
    }

    item.platform = this;
    return item;
  }
}
