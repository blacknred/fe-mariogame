export enum Keys {
  down = "ArrowDown",
  up = "ArrowUp",
  left = "ArrowLeft",
  right = "ArrowRight",
  enter = "Enter",
  pause = "Escape",
  space = " ",
}

export type Axes = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Sprite = {
  img: HTMLImageElement;
  cropWidth?: number;
  frame?: number;
  maxFrame?: number;
  maxWidth?: number;
};
