import _ from "lodash/fp";

import { isN_0 } from "../types";

export interface Line extends IterableIterator<string> {
  // isDone: boolean;
  
  [Symbol.iterator](): this;
  
  next(): IteratorResult<string, void>;
}

export interface Block extends IterableIterator<Line> {
  [Symbol.iterator](): this;
  
  next(): IteratorResult<Line, void>;
}

export type StringGenerator = Generator<string, void, any>;
export type StringIterator = IterableIterator<string> | StringGenerator;

export type LineGenerator = Generator<StringGenerator, void, any>;

export interface StringIterable {
  [Symbol.iterator](): StringIterator;
}

export type StringSource = string | StringIterable | StringIterator;

export interface FixedLength {
  length: number;
}

export function isFixedLength(x: any): x is FixedLength {
  return _.has("length", x) && isN_0(x.length);
    // _.isInteger(x.length) &&
    // x.length >= 0;
}

export interface FixedWidth {
  colWidth: number;
}

export function isFixedWidth(x: any): x is FixedWidth {
  return _.has("colWidth", x) && isN_0(x.colWidth);
    // _.isInteger(x.colWidth) &&
    // x.colWidth >= 0;
}

export function isIterator<T>(x: any): x is Iterator<T> {
  return (
    _.has("next", x) &&
    _.isFunction(x.next)
  );
}
