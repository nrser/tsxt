import { EOL_RESULT } from "./constants";
import { Block, Line } from "./types";

export class Column implements Block {
  protected readonly generator: Generator<Line, void> = this.generate();
  
  constructor(
    public readonly blocks: Block[],
  ) {
  }
  
  public [Symbol.iterator](): this { return this; }
  
  public next(): IteratorResult<Line, void> {
    return this.generator.next();
  }
  
  protected *generate(): Generator<Line, void> {
    for (const block of this.blocks) {
      for (const line of block) { yield line; }
    }
  }
}

export default Column;
