import invariant from "invariant";
import _ from "lodash/fp";
import wordwrap from "wordwrap";
import { as, assertIs } from "./helpers";
import {
  is,
  isN_0,
  isN_1,
  isNone,
  N_0,
  Optional,
} from "./types";


export type StringGenerator = Generator<string, void, never>;
export type StringIterator = IterableIterator<string> | StringGenerator;

export interface StringIterable {
  [Symbol.iterator](): StringIterator;
}

export interface FixedLength {
  length: number;
}

export function isFixedLength(x: any): x is FixedLength {
  return _.has("length", x) &&
    _.isInteger(x.length) &&
    x.length >= 0;
}

export interface FixedWidth {
  colWidth: number;
}

export function isFixedWidth(x: any): x is FixedWidth {
  return _.has("colWidth", x) &&
    _.isInteger(x.colWidth) &&
    x.colWidth >= 0;
}

interface Col {
  iterator: StringIterator;
  next: IteratorResult<string, void>;
  width: Optional<N_0>;
}


function calcUnboundedRenderWidths(
  iterables: StringIterable[],
): Array<null | N_0> {
  return iterables.map(iterable => {
    if (isFixedWidth(iterable)) {
      // Fixed width columns are simple displayed as their width
      return as(isN_0, iterable.colWidth);

    } else if (isFixedLength(iterable)) {
      // Fixed length (but *not* width) columns are let run wild - no width
      return null;

    } else {
      // And for columns that don't have any width *or* length bounds we would 
      // have no idea how wide to make them, so collapse them to 0 width
      return as(isN_0, 0);
    }
  });
}


export function calcRenderWidths(
  iterables: StringIterable[],
  totalWidth: Optional<number>,
): Array<N_0 | null> {
  const colWidths = calcUnboundedRenderWidths(iterables);

  if (isNone(totalWidth)) { return colWidths; }

  assertIs(isN_0, totalWidth);

  let unfixedWidth: number = totalWidth;
  let unfixedColCount: number = 0;

  colWidths.forEach(width => {
    if (width === null) {
      unfixedColCount += 1;
    } else {
      unfixedWidth -= width;
    }
  });

  if (unfixedWidth < 0) {
    throw new Error(`TODO: Fixed columns overflow total width big brah`);
  }

  if (unfixedColCount === 0) {
    // NOTE Even using `_.every( _.isNumber, colWidths )` didn't let TS figure
    //      out that `colWidths` is `N_0[]`, so whatever... just tell it so.
    return colWidths.map(x => as(isN_0, x));
  }

  const unfixedColWidth = Math.floor(unfixedWidth / unfixedColCount);
  let remainder = unfixedWidth % unfixedColCount;

  return colWidths.map(width => {
    if (width === null) {
      if (remainder > 0) {
        remainder -= 1;
        return as(isN_0, 1 + unfixedColWidth);
      } else {
        return as(isN_0, unfixedColWidth);
      }
    }

    return width;
  });
}


function splitLines(str: string): string[] {
  // Empty string → empty array (*no* lines)
  if (_.isEmpty(str)) { return []; }

  const lines = str.split("\n");

  // If the last character is a newline drop the final '' entry 
  if (str.endsWith("\n")) { lines.pop(); }

  return lines;
}


function* iterateStringLines(
  str: string,
  maxWidth?: Optional<N_0>,
): StringGenerator {
  if (is(maxWidth)) { str = wordwrap(maxWidth)(str); }
  yield* splitLines(str);
}


function* iterateNonStringLines(
  iterable: StringIterable,
  maxWidth?: Optional<N_0>,
): StringGenerator {
  // NOTE to self: this sucks. You did bad. Stupid fuck.

  const iterator = iterable[Symbol.iterator]();
  let next = iterator.next();
  let buffer: string = "";

  // Outer-most loop just keeps going unless the iterator runs dry, which
  // might be never
  while (!next.done) {
    buffer += next.value;

    if (next.value.includes("\n")) {
      if (next.value.endsWith("\n")) {
        yield* iterateStringLines(buffer, maxWidth);
        buffer = "";
      } else {
        // Ok, screwy 'cause we have some hangin'
        const lines = buffer.trimRight().split("\n");
        buffer = (lines.pop() || "").trimLeft();
        yield* lines;
      }
    }

    if (maxWidth && buffer.length > maxWidth) {
      const minTrim = buffer.length - maxWidth;
      const match = buffer.match(new RegExp(`^(.*)\\s(.{${minTrim},})$`));

      if (match === null) {
        // Busted, fuck it..?
        yield buffer.slice(0, maxWidth).trimRight();
        buffer = buffer.slice(maxWidth).trimLeft();
      } else {
        yield match[1].trimRight();
        buffer = match[2].trimLeft();
      }
    }

    next = iterator.next();
  } // while !next.done

  if (!_.isEmpty(buffer)) {
    yield buffer;
  }
} // iterateNonStringLines()


export function* iterateLines(
  iterable: StringIterable,
  maxWidth?: Optional<N_0>,
): StringGenerator {
  if (_.isString(iterable)) {
    yield* iterateStringLines(iterable, maxWidth);
  } else {
    yield* iterateNonStringLines(iterable, maxWidth);
  }
}

const SPACE = " ";

export function* genFill(
  length: number,
  char: string = SPACE,
): StringGenerator {
  for (let n = 0; n < length; n++) { yield char; }
}


export function* generate(
  iterables: StringIterable[],
  width: Optional<number>,
): StringGenerator {
  if (!isNone(width)) { assertIs(isN_0, width); }

  const fixedLengthCols: Col[] = [];

  const cols: Col[] =
    _.pipe(
      () => iterables,

      _.zip(calcRenderWidths(iterables, width)),

      _.reject(([renderWidth, iterable]) => renderWidth === 0),

      _.map(([renderWidth, iterable]) => {
        const iterator = iterateLines(iterable as StringIterable, renderWidth);

        const col = {
          iterator,
          next: iterator.next(),
          width: renderWidth,
        };

        if (isFixedLength(iterable)) { fixedLengthCols.push(col); }

        return col;
      }),
    )();

  while (_.any(b => !b.next.done, fixedLengthCols)) {
    const line = cols.reduce(
      (buffer, col) => {
        if (col.next.done) {
          if (isN_1(col.width)) { buffer += SPACE.repeat(col.width); }
  
        } else {
          buffer += col.next.value;
  
          if (isN_0(col.width)) {
            buffer += SPACE.repeat(col.width - col.next.value.length);
          }
  
          col.next = col.iterator.next();
        }
        
        return buffer;
      },
      "",
    );
    
    yield line;
  }
}


// Testing
// ===========================================================================
// 
// Hackery of sorts to expose private functions to only Jest.
// 

// tslint:disable-next-line: variable-name
export let __tests__: any;

if (process.env.JEST_WORKER_ID) {
  __tests__ = {
    iterateNonStringLines,
    iterateStringLines,
    splitLines,
  };
}
