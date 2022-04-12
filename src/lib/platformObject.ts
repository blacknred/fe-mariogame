import { CanvasObject, CanvasObjectOpts } from "./canvasObject";
import { Axes } from "./typings";

export interface PlatformObjectOpts
  extends Omit<CanvasObjectOpts, keyof Axes>,
    Partial<Axes> {
  score: number;
}

export class PlatformObject extends CanvasObject {
  score: number;
  hidden = false;

  constructor(opts: PlatformObjectOpts) {
    const { score, ...rest } = opts;
    super({ x: -1, y: -1, ...rest });

    this.score = score;
  }

  public reset() {
    this.hidden = false;
    super.reset();
  }
}
