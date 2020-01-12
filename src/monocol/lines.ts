import _ from "lodash/fp";
import print from "print";

import { as, p } from "../helpers";
import { isN_0, N_0 } from "../types";

import Line from "./line";
import StringLine from "./string_line";


export class Lines implements IterableIterator<Line> {
  
  public get colWidth(): N_0 { return this.line.colWidth; }
  protected line: Line;

  constructor(
    protected readonly text: string,
    colWidth: number,
  ) {
    this.line = new StringLine(text, as<N_0>(isN_0, colWidth));
  }

  public [Symbol.iterator]() { return this; }

  public next(): IteratorResult<Line, void> {
    p(`Iterating Lines...`);
    
    if (this.line.isTotallyDone) {
      p(`Totally done!`);
      return { done: true, value: undefined };
    }
    
    p(`Not totally done, yielding Line`);
    return { done: false, value: this.line };
  }
  
} // class Lines

export default Lines;
