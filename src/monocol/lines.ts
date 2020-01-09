import _ from "lodash/fp";
import print from "print";

import { as } from "../helpers";
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
    if (this.line.isTotallyDone) {
      return { done: true, value: undefined };
    }

    return { done: false, value: this.line };
  }
  
  public toArray(): string[] {
    const array = [];
    let str: string;
    
    for (const line of this) {
      str = "";
      for (const part of line) {
        str += part;
      }
      array.push(str);
    }
    
    return array;
  }
  
} // class Lines

export default Lines;
