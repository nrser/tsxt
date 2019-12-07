import {
  FixedLength,
  FixedWidth,
  StringIterable,
  StringIterator,
} from "../../lib/monocol";

export class FixedWidthIterable
  implements StringIterable, FixedWidth, FixedLength {
  
  public readonly colWidth: number;
  public readonly length: number;
  
  constructor(
    public readonly str: string,
  ) {
    this.colWidth = this.str.length;
    this.length = this.str.length;
  }
  
  public [Symbol.iterator](): StringIterator {
    return this.str[Symbol.iterator]();
  }
}

export function w(n: number): FixedWidthIterable {
  return new FixedWidthIterable("*".repeat(n));
}
