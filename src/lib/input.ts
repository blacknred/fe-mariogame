import { Keys } from "./typings";

export class Input {
  private keys = new Set<string>();
  private clickables = new Map<EventTarget, string>();
  private handlers = {
    up: new Map<string, (key: string) => void>(),
    down: new Map<string, (key: string) => void>(),
  };

  private touchY = 0;

  constructor(private targets: KeyboardEvent["key"][]) {
    this.addKey = this.addKey.bind(this);
    this.removeKey = this.removeKey.bind(this);

    this.addTouch = this.addTouch.bind(this);
    this.removeTouch = this.removeTouch.bind(this);
    this.touchMove = this.touchMove.bind(this);

    window.addEventListener("keydown", this.addKey);
    window.addEventListener("keyup", this.removeKey);
    window.addEventListener("mousedown", this.addKey);
    window.addEventListener("mouseup", this.removeKey);

    window.addEventListener("touchstart", this.addTouch);
    window.addEventListener("touchmove", this.touchMove);
    window.addEventListener("touchend", this.removeTouch);
  }

  /** Key accessor */

  has(key: KeyboardEvent["key"]) {
    return this.keys.has(key);
  }

  /** Add handler fires for key on press */

  on(key: string | string[], cb: (key: string) => void) {
    this.addHandler("down", key, cb);
  }

  /** Add handler fires for key on release */

  off(key: string | string[], cb: (key: string) => void) {
    this.addHandler("up", key, cb);
  }

  /** Add mouse input */

  mouse(element: HTMLElement, key: string) {
    if (this.targets.includes(key)) {
      this.clickables.set(element, key);
    }
  }

  // internals

  private getKey(e: KeyboardEvent | MouseEvent) {
    if (e instanceof KeyboardEvent) {
      return e.key;
    }

    if (e.target && this.clickables.has(e.target)) {
      return this.clickables.get(e.target);
    }

    return null;
  }

  private addKey(e: KeyboardEvent | MouseEvent) {
    const key = this.getKey(e);
    if (!key) return;

    if (this.targets.includes(key)) {
      this.keys.add(key);
    }

    if (this.handlers.down.has(key)) {
      this.handlers.down.get(key)?.(key);
    }
  }

  private removeKey(e: KeyboardEvent | MouseEvent) {
    const key = this.getKey(e);
    if (!key) return;

    this.keys.delete(key);

    if (this.handlers.up.has(key)) {
      this.handlers.up.get(key)?.(key);
    }
  }

  private addHandler(
    target: "down" | "up",
    key: string | string[],
    cb: (key: string) => void
  ) {
    const keys = Array.isArray(key) ? key : [key];

    for (let key of keys) {
      if (this.targets.includes(key)) {
        this.handlers[target].set(key, cb);
      }
    }
  }

  //

  private addTouch(e: TouchEvent) {
    this.touchY = e.changedTouches[0].pageY;
  }
  private touchMove(e: TouchEvent) {
    const distance = e.changedTouches[0].pageY - this.touchY;
    if (distance < -30 && !this.keys.has(Keys.swipeUp)) {
      // swipe up
      this.keys.add(Keys.swipeUp);
    } else if (distance > 30 && !this.keys.has(Keys.swipeDown)) {
      // swipe down
      this.keys.add(Keys.swipeDown);
    }
  }
  private removeTouch(e: TouchEvent) {
    this.keys.delete(Keys.swipeDown);
    this.keys.delete(Keys.swipeUp);
  }
}
