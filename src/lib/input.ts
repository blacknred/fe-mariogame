export class Input {
  private keys = new Set();
  private handlers = {
    up: new Map(),
    down: new Map(),
  };

  constructor(private targets: KeyboardEvent["key"][]) {
    this.addKey = this.addKey.bind(this);
    this.removeKey = this.removeKey.bind(this);

    window.addEventListener("keydown", this.addKey);
    window.addEventListener("keyup", this.removeKey);
  }

  private addKey(e: KeyboardEvent) {
    if (this.targets.includes(e.key)) {
      this.keys.add(e.key);
    }

    if (this.handlers.down.has(e.key)) {
      this.handlers.down.get(e.key)?.(e.key);
    }
  }

  private removeKey(e: KeyboardEvent) {
    this.keys.delete(e.key);

    if (this.handlers.up.has(e.key)) {
      this.handlers.up.get(e.key)?.(e.key);
    }
  }

  has(key: KeyboardEvent["key"]) {
    return this.keys.has(key);
  }

  on(key: string, cb: (key?: string) => void) {
    if (this.targets.includes(key)) {
      this.handlers.down.set(key, cb);
    }
  }

  off(key: string, cb: (key?: string) => void) {
    if (this.targets.includes(key)) {
      this.handlers.up.set(key, cb);
    }
  }
}
