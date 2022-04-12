import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { PlatformObject } from "./platformObject";
import { Axes } from "./typings";

export interface PlatformOpts extends CanvasObjectOpts {
  enemies?: PlatformObject[];
  gifts?: PlatformObject[];
}

export class Platform extends CanvasObject {
  enemies: PlatformObject[] = [];
  gifts: PlatformObject[] = [];

  constructor(opts: PlatformOpts) {
    const { enemies, gifts, ...rest } = opts;
    super(rest);

    if (enemies) {
      this.enemies = enemies.map(this.mapPosition.bind(this));
    }

    if (gifts) {
      this.gifts = gifts.map(this.mapPosition.bind(this));
    }
  }

  public update(ctx: CanvasRenderingContext2D): void {
    super.update(ctx);

    this.enemies.forEach((enemy) => {
      if (enemy.totalX < this.totalX) {
        enemy.position.x += 1;
      } else {
        enemy.position.x -= 1;
      }

      // enemy.update(ctx);
    });
  }

  public reset() {
    super.reset();

    this.enemies.forEach((enemy) => enemy.reset());
    this.gifts.forEach((gift) => gift.reset());
  }

  // own

  private mapPosition(item: PlatformObject) {
    const { x, y } = item.position;
    const { height } = item;

    if (x === -1) item.position.x = this.totalX - item.width;
    if (y === -1) item.position.y = this.position.y - height;
    return item;
  }

  get "position.x"() {
    return this.position.x;
  }

  set "position.x"(x: number) {
    this.position.x = x;

    this.gifts.forEach((gift) => {
      gift.position.x = x;
    });
  }
}
