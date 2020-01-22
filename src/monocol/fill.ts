import { as, pFor } from "../helpers";
import { isN_0, isN_1, N_0, N_1 } from "../types";

import { DONE_RESULT, EOL_RESULT, NEWLINE, SPACE } from "./constants";
import { Block, isIterator, Line, StringSource } from "./types";

import Linerator from "./linerator";

const p = pFor("Fill");

export class Fill implements Block {
  
  public readonly height: N_0;
  public readonly width: N_0;
  
  protected _isDone: boolean = false;
  protected readonly generator: undefined | Generator<string, void>;
  protected readonly iterator: Iterator<string>;
  protected readonly line: undefined | Line;
  
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
    
    this.width = as(isN_0, width);
    this.height = as(isN_0, height);
    
    if (this.height > 0) {
      this.generator = this.generateStrings();
      this.line = new Linerator(this.nextString.bind(this));
    }
  }
  
  public [Symbol.iterator](): this { return this; }
  
  public next(): IteratorResult<Line, void> {
    if (this.generator === undefined || this.line === undefined) {
      p(`#next() called on zero area fill`,
        {width: this.width, height: this.height});
      return EOL_RESULT;
    }
    
    if (this._isDone) {
      p(`Line is done!`);
      return DONE_RESULT;
    }
    
    p(`Not totally done, yielding Line`);
    return { done: false, value: this.line };
  }
  
  public nextString(): IteratorResult<string, void> {
    if (this.generator === undefined) {
      p(`#next() called on zero area fill`,
        {width: this.width, height: this.height});
      return EOL_RESULT;
    }
    
    if (this._isDone) {
      p(`is done, returning DONE`);
      return DONE_RESULT;
    }
    
    const result = this.generator.next();
    
    p(`Generator result`, result);
    
    if (result.done) {
      p(`Generator done, returning DONE`);
      return DONE_RESULT;
    }
    
    // [[generator]] yields `\n` to indicate a line break, but we want to
    // return that the line is done.
    if (result.value === NEWLINE) {
      p(`Received "\\n", yielding EOL`);
      return EOL_RESULT;
    }
    
    p(`Received content, yielding`, result.value);
    
    // Need this cast 'cause the preceding `null` check doesn't cause TS to 
    // reduce `IteratorResult<string | null, void>` to 
    // `IteratorResult<string, void>`. So I do it myself.
    return result as IteratorResult<string, void>;
  }
  
  protected *generateStrings(): Generator<string, void> {
    for (let line = 1; line <= this.height; line++) {
      p(`Starting line ${line}`);
      
      let budget: number = this.width;
      
      while (budget > 0) {
        const result = this.iterator.next();
        
        p(`Iterating`, {width: this.width, budget, result});
        
        if (result.done) {
          yield SPACE.repeat(budget);
          budget = 0;
        } else if (result.value.length < budget) {
          yield result.value;
          budget -= result.value.length;
        } else {
          yield result.value.slice(0, budget);
          budget = 0;
        }
      }
      
      // Shitty "last newline" issue... need to flag that we're done *before*
      // handing control back with the final `yield` so that the [[Fill]] can
      // tell we're done *before* yielding us 
      if (line === this.height) {
        p(`Setting _isDone`);
        this._isDone = true;
      }
      
      p(`Ending line ${line}`);
      yield NEWLINE;
    } // for line in height
    
    // this._isDone = true;
  } // #*generate
  
} // class Fill

export default Fill;
