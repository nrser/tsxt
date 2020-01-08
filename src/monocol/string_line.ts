import invariant from "invariant";
import _ from "lodash/fp";
import print from "print";

import { N_0 } from "../types";

import Line from "./line";


/**
 * Line iterator over [[string]] values. Tries to only slice the [[source]]
 * string (never concatenations), and to slice as few times as possible.
 */
export class StringLine extends Line {
  
  public static makeRegExp(colWidth: N_0): RegExp {
    return new RegExp(
      `\\s*` +
      `(?:(.{0,${colWidth}})\\n(\\n+))|` +
      `(?:(.{1,${colWidth}})(?:\\s|\\n|$))`,
      "sym",
    );
  }
  
  protected static readonly NEWLINE: "\n";
  protected static readonly NEWLINE_REGEXP = /\n/mg;
  
  protected readonly regExp: RegExp;
  protected readonly generator: Generator<string | null, void>;
  
  constructor(source: string, colWidth: N_0) {
    super(source, colWidth);
    
    this.regExp = StringLine.makeRegExp(this.colWidth);
    this.generator = this.generate();
  }
  
  protected get str(): string {
    return this.source as string;
  }
  
  /**
   * The [[source]] is "totally done" when the [[regExp]] has executed to the 
   * end of the string.
   */
  public get isTotallyDone(): boolean {
    return this.regExp.lastIndex === this.str.length;
  }
  
  public next(): IteratorResult<string, void> {
    // Continuing to call [[next]] on a "totally done" [[Line]] just returns 
    // newlines, allowing iterating code to just keep going on lines for as long
    // as it needs without any special logic - it will just keep printing empty
    // lines, which is what it wants to be doing.
    if (this.isTotallyDone) { return Line.EOL_RESULT; }
    
    const result = this.generator.next();
    
    // Should never be called when the generator is done because
    // [[isTotallyDone]] should catch it first
    if (result.done) {
      invariant(`StringLine#generator#next() called when done`);
      
      // Not much else would make sense to do...
      return Line.EOL_RESULT;
    }
    
    // [[generator]] yields `\n` to indicate a line break, but we want to
    // return that the line is done.
    if (result.value === StringLine.NEWLINE) { return Line.EOL_RESULT; }
    
    // Need this cast 'cause the preceding `null` check doesn't cause TS to 
    // reduce `IteratorResult<string | null, void>` to 
    // `IteratorResult<string, void>`. So I do it myself.
    return result as IteratorResult<string, void>;
  } // #next()
  
  /**
   * The meat of it - creates a generator that yields the strings and newlines.
   * 
   * Called once at construction, with the iterator assigned to [[generator]],
   * which is then used by [[next]] when it's called.
   * 
   * Basically, it was just easier to write this way - the generator handles 
   * state for us that we would otherwise need to keep track of between [[next]]
   * calls.
   */
  protected *generate(): Generator<string, void> {
    while (!this.isTotallyDone) {
      const match = this.regExp.exec(this.str);
      
      // Always want to match... if it failed, it means we have a case where 
      // the [[regExp]] broke down.
      if (match === null) {
        const context = {
          lastIndex: this.regExp.lastIndex,
          "str[lastIndex...]": this.str.slice(this.regExp.lastIndex),
        };
        
        throw new Error(`Match FAILED!\n${ print(context) }`);
      }
      
      const str: string = match[1] || match[3];
      
      if (str.length > 0) {
        if (StringLine.NEWLINE_REGEXP.test(str)) {
          const parts = str.split(StringLine.NEWLINE_REGEXP);
          
          for (let i = 0, l = parts.length; i++; i < l) {
            if (i > 0) { yield Line.SPACE; }
            yield parts[i];
          }
        } else {
          yield str;
        }
        
        yield StringLine.NEWLINE;
      }
      
      if (match[2]) {
        for (const n of match[2]) { yield StringLine.NEWLINE; }
      }
    } // while match
  } // #*generate()
  
} // class StringLine


export default StringLine;
