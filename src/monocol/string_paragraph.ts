import invariant from "invariant";
import _ from "lodash/fp";
import print from "print";

import { pFor } from "../helpers";
import { N_0 } from "../types";

import {
  DONE_RESULT,
  ELLIPSIS,
  EOL_RESULT,
  NEWLINE,
  SPACE,
} from "./constants";

import { Line } from "./types";


const p = pFor("StringParagraph");

export class StringParagraph implements Line {
  
  protected _hasYieldedAllTokens: boolean = false;
  protected readonly generator: Generator<string, void> = this.generate();
  protected readonly regExp: RegExp = /\s*(\S+)\s*/msy;
  
  constructor(
    protected readonly src: string,
    public readonly colWidth: N_0,
  ) {
  }
  
  public get hasYieldedAllTokens(): boolean {
    return this._hasYieldedAllTokens;
  }
  
  public [Symbol.iterator](): this { return this; }
  
  public next(): IteratorResult<string, void> {
    // Continuing to call [[next]] on a "totally done" [[Line]] just returns 
    // newlines, allowing iterating code to just keep going on lines for as long
    // as it needs without any special logic - it will just keep printing empty
    // lines, which is what it wants to be doing.
    if (this._hasYieldedAllTokens) { return DONE_RESULT; }
    
    const result = this.generator.next();
    
    if (result.done) { return DONE_RESULT; }
    
    // [[generator]] yields `\n` to indicate a line break, but we want to
    // return that the line is done.
    if (result.value === NEWLINE) {
      p(`Received "\\n", yielding EOL`, result);
      return EOL_RESULT;
    }
    
    p(`Received content, yielding`, result.value);
    
    // Need this cast 'cause the preceding `null` check doesn't cause TS to 
    // reduce `IteratorResult<string | null, void>` to 
    // `IteratorResult<string, void>`. So I do it myself.
    return result as IteratorResult<string, void>;
  } // #next()
  
  protected *generate(): Generator<string, void> {
    let budget: number = this.colWidth;
    
    while (!this._hasYieldedAllTokens) {
      const match = this.regExp.exec(this.src);
      
      // Always want to match... if it failed, it means we have a case where 
      // the [[regExp]] broke down.
      if (match === null) {
        const context = {
          lastIndex: this.regExp.lastIndex,
          "str[lastIndex...]": this.src.slice(this.regExp.lastIndex),
        };
        
        throw new Error(`Match FAILED!\n${ print(context) }`);
      }
      
      p("match", match);
      
      const token: string = match[1];
      
      if (token.length < budget) {
        // We can fit it on the current line
        if (budget !== this.colWidth) { yield SPACE; }
        yield token;
        budget -= (token.length + 1);
        
      } else if (token.length > this.colWidth) {
        // Token alone is longer than column width; needs to be truncated
        if (budget !== this.colWidth) { yield NEWLINE; }
        yield token.slice(0, this.colWidth - ELLIPSIS.length);
        yield ELLIPSIS;
        // ...and we're out of width
        budget = 0;
        
      } else {
        // The token pushes us over the width limit, so yield a new line and 
        // then the token.
        yield NEWLINE;
        yield token;
        budget = this.colWidth - token.length;
      }
      
      if (this.regExp.lastIndex === this.src.length) {
        p(`Setting _hasYieldedAllTokens`);
        this._hasYieldedAllTokens = true;
      }
      
    } // while !this._hasYieldedAllTokens
  } // #*generate
  
}

export default StringParagraph;
