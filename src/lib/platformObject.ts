import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { Platform } from "./platform";
import { Axes } from "./typings";

export interface PlatformObjectOpts
  extends Omit<CanvasObjectOpts, keyof Axes>,
    Partial<Axes> {
  score: number;
}

export class PlatformObject extends CanvasObject {
  /** Scoring */
  score: number;
  /** Platform */
  platform?: Platform;
  /** move direction */
  moveTo: "left" | "right" = "right";

  constructor(opts: PlatformObjectOpts) {
    const { score, ...rest } = opts;
    super({ x: -1, y: -1, ...rest });

    this.score = score;
  }

  public update(ctx: CanvasRenderingContext2D): void {
    super.update(ctx);

    // check moving direction
    if (!this.platform) return;

    this.velocity.x = this.platform.velocity.x;

    if (this.totalX > this.platform.totalX) {
      this.moveTo = "left";
    } else if (this.position.x < this.platform.position.x) {
      this.moveTo = "right";
    }
  }

  /** Move horizontally */

  move() {
    if (this.moveTo === "right") {
      this.velocity.x += 1;
    } else {
      this.velocity.x -= 1;
    }

    return this;
  }
}
