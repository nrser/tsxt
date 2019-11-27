import _ from "lodash/fp";

type None = undefined | null;

function isNone(x: any): x is None {
  return x === undefined || x === null;
}

export type StringIterator = IterableIterator<string>;
export type StringGenerator = Generator<string, undefined, never>;

export interface StringIterable {
  [Symbol.iterator](): StringIterator | StringGenerator;
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

  colWidths.forEach( (width) => {
    if (width === null) {
      unfixedColCount += 1;
    } else {
      unfixedWidth -= width;
    }
  });

  if (unfixedWidth < 0) {
    throw new Error( `Fixed columns too big brah` );
  }

  if (unfixedColCount === 0) {
    // NOTE Even using `_.every( _.isNumber, colWidths )` didn't let TS figure
    //      out that `colWidths` is `number[]`, so whatever... just tell it so.
    return colWidths as number[];
  }

  const unfixedColWidth = Math.floor( unfixedWidth / unfixedColCount );
  let remainder = unfixedWidth % unfixedColCount;
  
  return colWidths.map( (width) => {
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


export function* generate(
  iterables: StringIterable[],
  width: None | number,
): StringGenerator {
  const colWidths = iterables.map(
    (iterable) => isFixedWidth(iterable) ? iterable.colWidth : null,
  );

  const renderWidths =
    isNone( width ) ? colWidths : calcRenderWidths( colWidths, width );
    
  return;
}
