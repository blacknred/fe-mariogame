import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { PlatformObject } from "./platformObject";

export interface PlatformOpts extends CanvasObjectOpts {
  enemies?: PlatformObject[];
  gifts?: PlatformObject[];
}

export class Platform extends CanvasObject {
  enemies: PlatformObject[] = [];
  gifts: PlatformObject[] = [];
  isLast = false;

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

    this.enemies.forEach((item) => {
      if (item.hidden) return;
      item.update(ctx);

      if (item.totalX > this.totalX) {
        item.direction = "left";
      } else if (item.position.x < this.position.x) {
        item.direction = "right";
      }

      // enemies move from edge to edge
      if (item.direction === "right") {
        item.velocity.x = 1;
      } else {
        item.velocity.x = -1;
      }
    });

    this.gifts.forEach((item) => {
      if (item.hidden) return;
      item.update(ctx);
    });
  }

  public reset() {
    super.reset();

    this.enemies.forEach((item) => item.reset());
    this.gifts.forEach((item) => item.reset());
  }

  // own

  private mapPosition(item: PlatformObject) {
    const { x, y } = item.position;
    const { height } = item;

    if (x === -1) item.position.x = this.position.x;
    if (y === -1) item.position.y = this.position.y - height;
    return item;
  }

  get "position.x"() {
    return this.position.x;
  }

  set "position.x"(x: number) {
    this.position.x = x;

    this.gifts.forEach((item) => {
      item.position.x = x;
    });

    this.enemies.forEach((item) => {
      item.position.x = x;
    });
  }
}
