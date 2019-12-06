import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import { __tests__ } from "../../lib/monocol";
const iterateStringLines = __tests__.iterateStringLines;

describe(`iterateStringLines()`, () => {
  it(`does basic shit 'cause it a basic function`, () => {
    const gen = iterateStringLines("a\nb\nc");
    
    expect(gen).toBeIterator();
    // expect(gen).toBeObject();
    // expect(gen).toHaveProperty("next");
    
    const first = gen.next();
    expect(first).toHaveProperty("done", false);
    expect(first).toHaveProperty("value", "a");
  });
});
