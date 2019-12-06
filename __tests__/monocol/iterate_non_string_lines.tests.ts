import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import { __tests__ } from "../../lib/monocol";
const iterateNonStringLines = __tests__.iterateNonStringLines;

function iter(str: Iterable<string>) {
  return str[Symbol.iterator]();
}

describe(`iterateNonStringLines()`, () => {
  it(`does basic shit 'cause it a basic function`, () => {
    expect(iterateNonStringLines(iter("a\nb\nc")))
      .toIterate(["a", "b", "c"]);
    
    expect(iterateNonStringLines(iter("a")))
      .toIterate(["a"]);
      
    expect(iterateNonStringLines(iter("")))
      .toIterate([]);
      
    expect(iterateNonStringLines(iter("a\nb\nc\n")))
      .toIterate(["a", "b", "c"]);
      
    expect(iterateNonStringLines(iter("\n")))
      .toIterate([""]);
      
    expect(iterateNonStringLines(iter("\n\n")))
      .toIterate(["", ""]);
  });
  
  it(`word wraps`, () => {
    expect(
      iterateNonStringLines(
        iter(
          `Wrap text using a more sophisticated algorithm such as the Knuth ` +
          `and Plass TeX algorithm. If your language provides this, you get ` +
          `easy extra credit, but you must reference documentation ` +
          `indicating that the algorithm is something better than a simple ` +
          `minimimum length algorithm.`,
        ),
        42,
      ),
    ).toIterate([
      `Wrap text using a more sophisticated`,
      `algorithm such as the Knuth and Plass TeX`,
      `algorithm. If your language provides`,
      `this, you get easy extra credit, but you`,
      `must reference documentation indicating`,
      `that the algorithm is something better`,
      `than a simple minimimum length algorithm.`,
    ]);
  });

});
