import invariant from "invariant";
import _ from "lodash/fp";
import print from "print";

import { p } from "../helpers";
import { N_0 } from "../types";

import Line from "./line";


/**
 * Line iterator over [[string]] values. Tries to only slice the [[source]]
 * string (never concatenations), and to slice as few times as possible.
 */
export class StringLine extends Line {
  
  public static readonly ELLIPSIS = "…";
  public static readonly NEWLINE: "\n";
  
  protected static readonly NEWLINE_REGEXP = /\s*\n+\s*/mg;
  
  public static makeRegExp(colWidth: N_0): RegExp {
    return new RegExp(
      `\\s*`
      + `(?:(.{1,${colWidth}})(?:\\s+|$))|`
      + `(?:(.{${colWidth - StringLine.ELLIPSIS.length}})\\S*\\s+)`,
      "msy",
    );
  }
  
  protected readonly generator: Generator<string | null, void>;
  protected readonly regExp: RegExp;
  
  constructor(source: string, colWidth: N_0) {
    super(source, colWidth);
    
    this.regExp = StringLine.makeRegExp(this.colWidth);
    this.generator = this.generate();
  }
  
  protected get str(): string {
    return this.source as string;
  }
  
  public get isTotallyDone(): boolean {
    p(`Checking done`, {
      _isTotallyDone: this._isTotallyDone,
      lastIndex: this.regExp.lastIndex,
      strLength: this.str.length,
    });
    
    return this._isTotallyDone;
  }
  
  public next(): IteratorResult<string, void> {
    // Continuing to call [[next]] on a "totally done" [[Line]] just returns 
    // newlines, allowing iterating code to just keep going on lines for as long
    // as it needs without any special logic - it will just keep printing empty
    // lines, which is what it wants to be doing.
    if (this._isTotallyDone) { return Line.EOL_RESULT; }
    
    const result = this.generator.next();
    
    // Should never be called when the generator is done because
    // [[isTotallyDone]] should catch it first
    if (result.done) {
      // invariant(`StringLine#generator#next() called when done`);
      
      // Not much else would make sense to do...
      return Line.EOL_RESULT;
    }
    
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
  
  /**
   * The meat of it - creates a generator that yields the strings and newlines.
   * 
   * Called once at construction, with the iterator assigned to [[generator]],
   * which is then used by [[next]] when it's called.
   * 
   * Basically, it was just easier to write this way - the generator handles 
   * state for us that we would otherwise need to keep track of between [[next]]
   * calls.
   * 
   * It's still a tricky little mess that was written with a likely ill-advised
   * focus on "performance", so read the comments carefully.
   */
  protected *generate(): Generator<string, void> {
    while (!this._isTotallyDone) {
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
      
      p("match", match);
      
      let str: string = match[1] || match[2];
      
      p(`str`, str);
      
      // This is a presumably *faster* way of testing `str !== ""` or
      // `str.length > 0` by (ab)using JavaScript's wonky truthiness, where the
      // empty string is `false` in a boolean sense. 
      if (str) {
        if (StringLine.NEWLINE_REGEXP.test(str)) {
          // if (/\n+$/mg.test(str)) { str = str.trimRight(); }
          
          const parts = str.split(StringLine.NEWLINE_REGEXP);
          
          p("split parts", {parts, length: parts.length});
          
          for (let i = 0, l = parts.length; i < l; i++) {
            if (i > 0) {
              p(`yielding ' '`);
              // yield Line.SPACE;
              yield " ";
            }
            if (parts[i]) {
              p(`yielding parts[${i}]`, parts[i]);
              yield parts[i];
            }
          }
        } else {
          p(`yielding str`, str);
          yield str;
        }
        
        if (match[3]) { yield StringLine.ELLIPSIS; }
      } // if str
      
      // If group (2) matched, it is the string of consecutive newlines at the 
      // end of the match, omitting the first in the sequence of "\n".
      // 
      // Example: if the matched portion of the source ends with "\n\n\n", then
      //          `match[2]` is "\n\n".
      // 
      // Hence the length of `match[2]` is the number of newlines we want to
      // yield *in addition* to the single one we always will yield... which is
      // what this code does.
      // if (match[2]) {
      //   for (const n of match[2]) { yield StringLine.NEWLINE; }
      // }
      
      // This is the really wonk-o part... in *most* cases, we want to yield a
      // newline -'cause a line is done - but in the case when it's the *only*
      // thing left to do for the whole [[source]], we actually need to stop
      // iteration of the [[Lines]] object containing this instance instead,
      // before it yields this object again as a "new line", because once a "new
      // line" has been yielded, there is nothing that can be done except to 
      // make it empty, resulting in an extra newline at the end.
      // 
      // This is accomplished by testing if the entire string has been consumed
      // and flagging this object as "totally done" in that case, which is then
      // checked in [[Lines.next]] before yielding this as a "new line".
      // 
      // Or, at least that's how I *think* it works. This code was a result of 
      // fiddle/re-factoring cycles to get the test results desired.
      if (this.regExp.lastIndex === this.str.length) {
        p(`Setting _isTotallyDone`);
        this._isTotallyDone = true;
      } else {
        yield StringLine.NEWLINE;
      }
      
    } // while match
  } // #*generate()
  
} // class StringLine


export default StringLine;
