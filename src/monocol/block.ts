
export interface Line extends IterableIterator<string> {
  [Symbol.iterator](): this;
  
  next(): IteratorResult<string, void>;
}

export interface Block extends IterableIterator<Line> {
  [Symbol.iterator](): this;
  
  next(): IteratorResult<Line, void>;
}
