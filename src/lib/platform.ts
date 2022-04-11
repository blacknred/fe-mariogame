import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { Enemy } from "./enemy";

export interface PlatformOpts extends CanvasObjectOpts {
  enemies?: Enemy[];
}

export class Platform extends CanvasObject {
  enemies: Enemy[] = [];

  constructor(opts: PlatformOpts) {
    const { enemies, ...rest } = opts;
    super(rest);

    this.enemies = enemies || this.enemies;
  }

  public update(ctx: CanvasRenderingContext2D): void {
    super.update(ctx);

    this.enemies.forEach((enemy) => {
      // enemy.position.y = this.position.y;
      if (
        enemy.position.x < this.totalX ||
        enemy.position.x < this.position.x
      ) {
        enemy.position.x += 10;
      } else {
        enemy.position.x -= 10;
      }

      enemy.update(ctx);
    });
  }
}
