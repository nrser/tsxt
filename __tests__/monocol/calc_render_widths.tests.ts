import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import { calcRenderWidths } from "../../lib/monocol";

describe(`calcRenderWidths()`, () => {
  it(`handles the empty case`, () => {
    expect(
      calcRenderWidths([], 80),
    ).toEqual([]);
  });

  it(`handles the all integers`, () => {
    expect(
      calcRenderWidths([1, 2, 3], 80),
    ).toEqual([1, 2, 3]);
  });

  it(`handles the [null] case`, () => {
    expect(
      calcRenderWidths([null], 80),
    ).toEqual([80]);
  });

  it(`splits evenly when divisible between all nulls`, () => {
    expect(
      calcRenderWidths([null, null], 80),
    ).toEqual([40, 40]);

    expect(
      calcRenderWidths([null, null, null], 99),
    ).toEqual([33, 33, 33]);

    expect(
      calcRenderWidths([null, null, null, null], 100),
    ).toEqual([25, 25, 25, 25]);
  });

  it(`splits spreads remainder between all nulls`, () => {
    expect(
      calcRenderWidths([null, null], 81),
    ).toEqual([41, 40]);

    expect(
      calcRenderWidths([null, null, null], 32),
    ).toEqual([11, 11, 10]);

    expect(
      calcRenderWidths([null, null, null, null], 42),
    ).toEqual([11, 11, 10, 10]);
  });

  it(`does fancy-pants stuff`, () => {
    expect(
      calcRenderWidths([10, null, 10], 80),
    ).toEqual([10, 60, 10]);

    expect(
      calcRenderWidths([10, null, 10, null, 10], 80),
    ).toEqual([10, 25, 10, 25, 10]);

    expect(
      calcRenderWidths([10, null, 10, null, 10], (10 * 3) + (25 * 2) + 1),
    ).toEqual([10, 26, 10, 25, 10]);

    expect(
      calcRenderWidths([10, null, null, null, 10], (10 * 2) + (20 * 3) + 2),
    ).toEqual([10, 21, 21, 20, 10]);
  });

});
