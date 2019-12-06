import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import { __tests__ } from "../../lib/monocol";
const iterateStringLines = __tests__.iterateStringLines;

describe(`iterateStringLines()`, () => {
  it(`does basic shit 'cause it a basic function`, () => {
    expect(iterateStringLines("a\nb\nc"))
      .toIterate(["a", "b", "c"]);
    
    expect(iterateStringLines("a"))
      .toIterate(["a"]);
      
    expect(iterateStringLines(""))
      .toIterate([]);
      
    expect(iterateStringLines("a\nb\nc\n"))
      .toIterate(["a", "b", "c"]);
      
    expect(iterateStringLines("\n"))
      .toIterate([""]);
      
    expect(iterateStringLines("\n\n"))
      .toIterate(["", ""]);
  });
  
  it(`word wraps`, () => {
    expect(
      iterateStringLines(
        `Wrap text using a more sophisticated algorithm such as the Knuth ` +
        `and Plass TeX algorithm. If your language provides this, you get ` +
        `easy extra credit, but you must reference documentation indicating ` +
        `that the algorithm is something better than a simple minimimum ` +
        `length algorithm.`,
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
