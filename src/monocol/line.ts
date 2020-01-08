import invariant from "invariant";
import _ from "lodash/fp";
import print from "print";

import { as, assertIs } from "../helpers";

import {
  is,
  isN_0,
  isN_1,
  isNone,
  N_0,
  Optional,
} from "../types";

import {
  isFixedLength,
  isFixedWidth,
  isIterator,
  LineGenerator,
  StringGenerator,
  StringIterable,
  StringIterator,
} from "./types";


type LineSource = string | StringIterable | StringIterator;


export class Line implements IterableIterator<string> {
  
  protected static readonly SPACE: " ";
  
  protected static readonly EOL_RESULT: IteratorReturnResult<void> =
    Object.freeze({ done: true, value: undefined });
  
  protected static readonly SPACE_RESULT: IteratorYieldResult<string> =
      Object.freeze({ done: false, value: Line.SPACE });
  
  protected _isTotallyDone: boolean = false;
  protected yieldedColCount: N_0 = 0 as N_0;
  protected paragraphSplitMode: boolean = false;
  protected peekChar: string | undefined;
  
  protected iterator: Iterator<string>;
  
  /**
   * Anything already read from the [[iterator]] but not yet yielded. Must be 
   * yielded *before* anything new from the iterator.
   */
  protected yieldBuffer: string = "";
  
  /**
   * Anything already read from the [[iterator]] but not yet processed. Must be
   * processed - yielded, moved to the [[yieldBuffer]], or discarded - before 
   * processing anything new from the iterator.
   */
  protected processBuffer: string = "";

  constructor(
    protected readonly source: LineSource,
    public readonly colWidth: N_0,
  ) {
    if (isIterator<string>(this.source)) {
      this.iterator = this.source;
    } else {
      this.iterator = this.source[Symbol.iterator]();
    }
  }
  
  public get isTotallyDone(): boolean { return this._isTotallyDone; }

  public [Symbol.iterator](): this { return this; }
  
  public next(): IteratorResult<string, void> {
    const nextChar = this.nextChar();
    
    if (nextChar.done) {
      this._isTotallyDone = true;
      return Line.EOL_RESULT;
    }

    if (nextChar.value === "\n") {
      if (this.paragraphSplitMode) {
        return Line.EOL_RESULT;
      }
      
      const nextNextChar = this.nextChar();
      
      if (nextNextChar.done) {
        // This is a final newline *without* a blank line at the end.
        // 
        // Finish everything:
        // 
        this._isTotallyDone = true;
        return Line.EOL_RESULT;
      }
      
      if (nextNextChar.value === "\n") {
        // This is a double-newline case, which means a paragraph break, so...
        // 
        // 1.   This line is done.
        // 2.   The next line needs to be blank.
        
        this.peekChar = nextNextChar.value;
        this.paragraphSplitMode = true;
        
        return Line.EOL_RESULT;
      }
      
      // It's just a "cosmetic" newline, which we replace with a space when
      // wrapping
      return Line.SPACE_RESULT;
      
    } else {
      this.paragraphSplitMode = false;
    }

    return { done: false, value: nextChar.value };
  } // next()
  
  protected nextChar(): IteratorResult<string, any> {
    if (this.peekChar) {
      const char = this.peekChar;
      this.peekChar = undefined;
      return { done: false, value: char };
    }
    
    return this.iterator.next();
  } // nextChar()
  
} // class Line

export default Line;
