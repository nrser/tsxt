import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";
import { FixedWidthIterable } from "./monocol_test_helpers";

import { isFixedWidth } from "../../lib/monocol/types";


describe(`isFixedWidth()`, () => {
  it(`works on my test class`, () => {
    const fwi = new FixedWidthIterable("abc");
    expect(isFixedWidth(fwi)).toBe(true);
  });
});
