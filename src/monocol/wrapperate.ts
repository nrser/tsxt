import invariant from "invariant";
import _ from "lodash/fp";
import print from "print";

import { as, assertIs } from "../helpers";

import {
  is,
  isN_0,
  isN_1,
  isNone,
  N_0,
  Optional,
} from "../types";

import {
  isFixedLength,
  isFixedWidth,
  isIterator,
  LineGenerator,
  StringGenerator,
  StringIterable,
  StringIterator,
} from "./types";

import Line from "./line";
import StringLine from "./string_line";


export class Lines implements IterableIterator<Line> {
  protected line: Line;

  constructor(
    protected readonly text: string,
    colWidth: number,
  ) {
    this.line = new StringLine(text, as<N_0>(isN_0, colWidth));
  }

  public [Symbol.iterator]() { return this; }
  
  public get colWidth(): N_0 { return this.line.colWidth; }

  public next(): IteratorResult<Line, void> {
    if (this.line.isTotallyDone) {
      return { done: true, value: undefined };
    }

    return { done: false, value: this.line };
  }
}

