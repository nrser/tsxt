import invariant from "invariant";
import _ from "lodash/fp";
import wordwrap from "wordwrap";

type None = undefined | null;

function isNone(x: any): x is None {
  return x === undefined || x === null;
}

// tslint:disable-next-line: class-name
interface N_1Brand {
  readonly N_1BrandID: unique symbol;
}

type N_1 = number & N_1Brand;

function isN_1(x: any): x is N_1 {
  return _.isInteger(x) && x > 0;
}

type PositiveInteger = N_1;

type Optional<T> = None | T;

const is = <T>(x: Optional<T>): x is T => !isNone(x);

export type StringGenerator = Generator<string, void, never>;
export type StringIterator = IterableIterator<string> | StringGenerator;

export interface StringIterable {
  [Symbol.iterator](): StringIterator;
}

export interface FixedLength {
  length: number;
}

export function isFixedLength(x: any): x is FixedLength {
  return _.has(x, "length") &&
    _.isInteger(x.length) &&
    x.length >= 0;
}

export interface FixedWidth {
  colWidth: number;
}

export function isFixedWidth(x: any): x is FixedWidth {
  return _.has(x, "colWidth") &&
    _.isInteger(x.colWidth) &&
    x.colWidth >= 0;
}


export function calcRenderWidths(
  colWidths: Array<null | number>,
  totalWidth: number,
): number[] {
  let unfixedWidth = totalWidth;
  let unfixedColCount = 0;

  colWidths.forEach((width) => {
    if (width === null) {
      unfixedColCount += 1;
    } else {
      unfixedWidth -= width;
    }
  });

  if (unfixedWidth < 0) {
    throw new Error(`Fixed columns too big brah`);
  }

  if (unfixedColCount === 0) {
    // NOTE Even using `_.every( _.isNumber, colWidths )` didn't let TS figure
    //      out that `colWidths` is `number[]`, so whatever... just tell it so.
    return colWidths as number[];
  }

  const unfixedColWidth = Math.floor(unfixedWidth / unfixedColCount);
  let remainder = unfixedWidth % unfixedColCount;

  return colWidths.map((width) => {
    if (width === null) {
      if (remainder > 0) {
        remainder -= 1;
        return 1 + unfixedColWidth;
      } else {
        return unfixedColWidth;
      }
    } else {
      return width;
    }
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
  maxWidth?: Optional<PositiveInteger>,
): StringGenerator {
  if (is(maxWidth)) { str = wordwrap(maxWidth)(str); }
  yield* splitLines(str);
}


function* iterateNonStringLines(
  iterable: StringIterable,
  maxWidth?: Optional<PositiveInteger>,
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
  maxWidth?: Optional<PositiveInteger>,
): StringGenerator {
  if (_.isString(iterable)) {
    yield* iterateStringLines(iterable, maxWidth);
  } else {
    yield* iterateNonStringLines(iterable, maxWidth);
  }
}


export function* generate(
  iterables: StringIterable[],
  width: None | number,
): StringGenerator {
  const colWidths = iterables.map((iterable) =>
    isFixedWidth(iterable) ? iterable.colWidth : null);

  const renderWidths =
    isNone(width) ? colWidths : calcRenderWidths(colWidths, width);

  const fixedLengthIterators = [] as StringIterator[];

  const iterators = iterables.map((iterable) => {
    const iterator = iterable[Symbol.iterator]();

    if (isFixedLength(iterable)) {
      fixedLengthIterators.push(iterator);
    }

    return iterator;
  });

  return;
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
