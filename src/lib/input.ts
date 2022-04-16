import { InputCb, Keys } from "./typings";

export class Input {
  static instance: Input;
  private keys = new Set<string>();
  private clickables = new Map<EventTarget, string>();
  private handlers = {
    up: new Map<string, InputCb[]>(),
    down: new Map<string, InputCb[]>(),
  };

  private constructor(private targets: KeyboardEvent["key"][]) {
    this.addKey = this.addKey.bind(this);
    this.removeKey = this.removeKey.bind(this);

    window.addEventListener("keydown", this.addKey);
    window.addEventListener("keyup", this.removeKey);
    window.addEventListener("mousedown", this.addKey);
    window.addEventListener("mouseup", this.removeKey);
    window.addEventListener("touchstart", this.addKey);
    window.addEventListener("touchend", this.removeKey);
    // window.addEventListener("touchmove", this.coroutine(this.touchHandler));
  }

  static getInstance() {
    if (!Input.instance) {
      Input.instance = new Input(Object.values(Keys));
    }

    return Input.instance;
  }

  /** Key accessor */

  has(key: KeyboardEvent["key"]) {
    return this.keys.has(key);
  }

  /** Add handler fires for key on press */

  on(key: string | string[], cb: InputCb) {
    this.addHandler("down", key, cb);
  }

  /** Add handler fires for key on release */

  off(key: string | string[], cb: InputCb) {
    this.addHandler("up", key, cb);
  }

  /** Add mouse input */

  click(element: HTMLElement, key: string) {
    if (this.targets.includes(key)) {
      this.clickables.set(element, key);
    }
  }

  // internals

  private getKey(e: KeyboardEvent | MouseEvent | TouchEvent) {
    if (e instanceof KeyboardEvent) {
      return e.key;
    }

    if (e.target && this.clickables.has(e.target)) {
      return this.clickables.get(e.target);
    }

    return null;
  }

  private addKey(e: KeyboardEvent | MouseEvent | TouchEvent) {
    const key = this.getKey(e);
    if (!key) return;

    if (this.targets.includes(key)) {
      this.keys.add(key);
    }

    if (this.handlers.down.has(key)) {
      this.handlers.down.get(key)?.forEach((cb) => cb(key));
    }
  }

  private removeKey(e: KeyboardEvent | MouseEvent | TouchEvent) {
    const key = this.getKey(e);
    if (!key) return;

    this.keys.delete(key);

    if (this.handlers.up.has(key)) {
      this.handlers.up.get(key)?.forEach((cb) => cb(key));
    }
  }

  private addHandler(
    target: "down" | "up",
    key: string | string[],
    cb: InputCb
  ) {
    const keys = Array.isArray(key) ? key : [key];

    for (let key of keys) {
      if (this.targets.includes(key)) {
        const handlers = this.handlers[target].get(key) || [];
        this.handlers[target].set(key, handlers.concat(cb));
      }
    }
  }

  // coroutine(fn: () => Generator<undefined, void, TouchEvent>) {
  //   let o = fn();
  //   o.next();
  //   return function (x: TouchEvent) {
  //     o.next(x);
  //   };
  // }

  // *touchHandler() {
  //   let e: TouchEvent;
  //   let y: number;

  //   while ((e = yield)) {
  //     if (e.type == "touchdown") {
  //       y = e.changedTouches[0].pageY;

  //       while ((e = yield)) {
  //         if (e.type == "touchup") {
  //           this.keys.delete(Keys.up);
  //           this.keys.delete(Keys.down);
  //         }
  //         if (e.type == "touchmove") {
  //           const distance = e.changedTouches[0].pageY - y;
  //           if (distance < -30 && !this.keys.has(Keys.up)) {
  //             // swipe up
  //             this.keys.add(Keys.up);
  //           } else if (distance > 30 && !this.keys.has(Keys.down)) {
  //             // swipe down
  //             this.keys.add(Keys.down);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}
