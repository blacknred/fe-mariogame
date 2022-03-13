export class Input {
  private keys = new Set();

  constructor(private targets: KeyboardEvent["key"][]) {
    this.addKey = this.addKey.bind(this);
    this.removeKey = this.removeKey.bind(this);

    window.addEventListener("keydown", this.addKey);
    window.addEventListener("keyup", this.removeKey);
  }

  has(key: KeyboardEvent["key"]) {
    return this.keys.has(key);
  }

  private addKey(e: KeyboardEvent) {
    if (this.targets.includes(e.key)) {
      this.keys.add(e.key);
    }
  }

  private removeKey(e: KeyboardEvent) {
    this.keys.delete(e.key);
  }
}
