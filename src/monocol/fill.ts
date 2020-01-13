import { as, pFor } from "../helpers";
import { isN_0, isN_1, N_0, N_1 } from "../types";

import { DONE_RESULT, EOL_RESULT, SPACE } from "./constants";
import { Block, isIterator, Line, StringSource } from "./types";

import FillLine from "./fill_line";

const p = pFor("Fill");

export class Fill implements Block {
  
  public readonly height: N_0;
  public readonly width: N_0;
  
  protected readonly fillLine: undefined | FillLine;
  protected readonly iterator: Iterator<string>;
  
  constructor(
    src: StringSource,
    width: number,
    height: number,
  ) {
    if (isIterator<string>(src)) {
      this.iterator = src;
    } else {
      this.iterator = src[Symbol.iterator]();
    }
    
    this.width = as<N_0>(isN_0, width);
    this.height = as<N_0>(isN_0, height);
    
    if (this.height > 0) {
      this.fillLine =
        new FillLine(this.iterator, this.width, as<N_1>(isN_1, this.height));
    }
  }
  
  public [Symbol.iterator](): this { return this; }
  
  public next(): IteratorResult<Line, void> {
    if (this.fillLine === undefined) {
      p(`#next() called on zero area fill`,
        {width: this.width, height: this.height});
      return EOL_RESULT;
    }
    
    if (this.fillLine.hasYieldedAllTokens) {
      p(`Has yielded all tokens!`);
      return EOL_RESULT;
    }
    
    p(`Not totally done, yielding Line`);
    return { done: false, value: this.fillLine };
  }
  
} // class Fill

export default Fill;
