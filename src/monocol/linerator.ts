import { Line } from "./types";

class Linerator implements Line {
  constructor(
    public readonly next: () => IteratorResult<string, void>,
  ) {
  }
  
  public [Symbol.iterator](): this { return this; }
}

export default Linerator;
