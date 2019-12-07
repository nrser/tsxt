import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";
import { w } from "./monocol_test_helpers";

import { calcRenderWidths } from "../../lib/monocol";


describe(`calcRenderWidths()`, () => {
  it(`handles the empty case`, () => {
    expect(
      calcRenderWidths([], 80),
    ).toEqual([]);
  });

  it(`handles the all integers`, () => {
    expect(
      calcRenderWidths([w(1), w(2), w(3)], 80),
    ).toEqual([1, 2, 3]);
  });

  it(`handles the [null] case`, () => {
    expect(
      calcRenderWidths(["blah"], 80),
    ).toEqual([80]);
  });

  it(`splits evenly when divisible between all nulls`, () => {
    expect(
      calcRenderWidths(["a", "b"], 80),
    ).toEqual([40, 40]);

    expect(
      calcRenderWidths(["a", "b", "c"], 99),
    ).toEqual([33, 33, 33]);

    expect(
      calcRenderWidths(["a", "b", "c", "d"], 100),
    ).toEqual([25, 25, 25, 25]);
  });

  it(`splits spreads remainder between all nulls`, () => {
    expect(
      calcRenderWidths(["a", "b"], 81),
    ).toEqual([41, 40]);

    expect(
      calcRenderWidths(["a", "b", "c"], 32),
    ).toEqual([11, 11, 10]);

    expect(
      calcRenderWidths(["a", "b", "c", "d"], 42),
    ).toEqual([11, 11, 10, 10]);
  });

  it(`does fancy-pants stuff`, () => {
    expect(
      calcRenderWidths([w(10), "blah", w(10)], 80),
    ).toEqual([10, 60, 10]);

    expect(
      calcRenderWidths([w(10), "left", w(10), "right", w(10)], 80),
    ).toEqual([10, 25, 10, 25, 10]);

    expect(
      calcRenderWidths(
        [w(10), "left", w(10), "right", w(10)],
        (10 * 3) + (25 * 2) + 1
      ),
    ).toEqual([10, 26, 10, 25, 10]);

    expect(
      calcRenderWidths(
        [w(10), "left", "center", "right", w(10)],
        (10 * 2) + (20 * 3) + 2
      ),
    ).toEqual([10, 21, 21, 20, 10]);
  });

});
