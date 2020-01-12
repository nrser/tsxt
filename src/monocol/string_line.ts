import invariant from "invariant";
import _ from "lodash/fp";
import print from "print";

import { p } from "../helpers";
import { N_0 } from "../types";

import Line from "./line";


export class StringLine extends Line {
  
  public static readonly ELLIPSIS = "…";
  public static readonly NEWLINE = "\n";
  public static readonly SPACE = " ";
  
  public static makeTokenRegExp(): RegExp {
    return /\s*(\S+)\s*/msy;
  }
  
  protected _isSrcDone: boolean = false;
  protected readonly generator: Generator<string, void> = this.generate();
  protected readonly regExp: RegExp = /\s*(\S+)\s*/msy;
  
  constructor(
    protected readonly src: string,
    public readonly colWidth: N_0,
  ) {
    super(src, colWidth);
  }
  
  public get isTotallyDone(): boolean { return this._isSrcDone; }
  
  public next(): IteratorResult<string, void> {
    // Continuing to call [[next]] on a "totally done" [[Line]] just returns 
    // newlines, allowing iterating code to just keep going on lines for as long
    // as it needs without any special logic - it will just keep printing empty
    // lines, which is what it wants to be doing.
    if (this._isSrcDone) { return Line.EOL_RESULT; }
    
    const result = this.generator.next();
    
    if (result.done) { return Line.EOL_RESULT; }
    
    // [[generator]] yields `\n` to indicate a line break, but we want to
    // return that the line is done.
    if (result.value === StringLine.NEWLINE) {
      p(`Received "\\n", yielding EOL`, result);
      return Line.EOL_RESULT;
    }
    
    p(`Received content, yielding`, result.value);
    
    // Need this cast 'cause the preceding `null` check doesn't cause TS to 
    // reduce `IteratorResult<string | null, void>` to 
    // `IteratorResult<string, void>`. So I do it myself.
    return result as IteratorResult<string, void>;
  } // #next()
  
  protected *generate(): Generator<string, void> {
    let budget: number = this.colWidth;
    
    while (!this._isSrcDone) {
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
        if (budget !== this.colWidth) { yield StringLine.SPACE; }
        yield token;
        budget -= (token.length + 1);
        
      } else if (token.length > this.colWidth) {
        // Token alone is longer than column width; needs to be truncated
        if (budget !== this.colWidth) { yield StringLine.NEWLINE; }
        yield token.slice(0, this.colWidth - StringLine.ELLIPSIS.length);
        yield StringLine.ELLIPSIS;
        // ...and we're out of width
        budget = 0;
        
      } else {
        // The token pushes us over the width limit, so yield a new line and 
        // then the token.
        yield StringLine.NEWLINE;
        yield token;
        budget = this.colWidth - token.length;
      }
      
      if (this.regExp.lastIndex === this.src.length) {
        p(`Setting _isSrcDone`);
        this._isSrcDone = true;
      }
      
    } // while !this._isSrcDone
  } // #*generate
  
}

export default StringLine;
