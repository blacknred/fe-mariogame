import { CanvasObject, CanvasObjectOpts } from "./canvasObject";

export interface GiftOpts extends CanvasObjectOpts {
  score: number;
}

export class Gift extends CanvasObject {
  score: number;
  hidden = false;

  constructor(opts: GiftOpts) {
    const { score, ...rest } = opts;
    super(rest);

    this.score = score;
  }

  public reset() {
    this.hidden = false;
    super.reset();
  }
}
