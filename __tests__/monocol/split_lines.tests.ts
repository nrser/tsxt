import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import { __tests__ } from "../../lib/monocol";
const splitLines = __tests__.splitLines;

describe(`splitLines()`, () => {
  it(`splits... lines. When last character is *not* \\n`, () => {
    expect(splitLines("a\nb\nc")).toEqual(["a", "b", "c"]);
  });

  it(`drops the last "" element when last character is \\n`, () => {
    expect(splitLines("a\nb\nc\n")).toEqual(["a", "b", "c"]);
    expect(splitLines("\n")).toEqual([""]);
    expect(splitLines("\n\n")).toEqual(["", ""]);
  });

  it(`maps the empty string "" to an empty array []`, () => {
    expect(splitLines("")).toEqual([]);
  });
});
