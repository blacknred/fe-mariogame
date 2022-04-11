import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { Axes } from "./typings";

export interface EnemyOpts extends Omit<CanvasObjectOpts, keyof Axes> {
  score: number;
}

export class Enemy extends CanvasObject {
  score: number;
  hidden = false;

  constructor(opts: EnemyOpts) {
    const { score, ...rest } = opts;
    super({ ...rest, x: -1, y: -1 });

    this.score = score;
  }

  public reset() {
    this.hidden = false;
    super.reset();
  }
}
