import _ from "lodash/fp";
import print from "print";

import { as, p } from "../helpers";
import { isN_0, N_0 } from "../types";

import StringParagraph from "./string_paragraph";
import { Block, Line, StringSource } from "./types";


export class Paragraph implements Block {
  
  public readonly colWidth: N_0;
  protected line: Line;

  constructor(
    protected readonly src: StringSource,
    colWidth: number,
  ) {
    this.colWidth = as<N_0>(isN_0, colWidth);
    
    if (_.isString(src)) {
      this.line = new StringParagraph(src, as<N_0>(isN_0, colWidth));
    } else {
      throw new Error(`TODO - handle iterable Paragraph sources`);
    }
  }

  public [Symbol.iterator](): this { return this; }

  public next(): IteratorResult<Line, void> {
    p(`Iterating Lines...`);
    
    if (this.line.hasYieldedAllTokens) {
      p(`Has yielded all tokens?!`);
      return { done: true, value: undefined };
    }
    
    p(`Not totally done, yielding Line`);
    return { done: false, value: this.line };
  }
  
} // class Lines

export default Paragraph;
