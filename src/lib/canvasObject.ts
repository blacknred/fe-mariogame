export abstract class CanvasObject {
  ctx: CanvasRenderingContext2D;

  constructor(protected canvas: HTMLCanvasElement) {
    this.ctx = this.canvas.getContext('2d')!;
  }
}
