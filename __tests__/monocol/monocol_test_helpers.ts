import "jest";
import "jest-extended";
import _ from "lodash/fp";
// import { loadYAML } from "../../test_helpers";
import print from "print";

import {
  FixedLength,
  FixedWidth,
  StringIterable,
  StringIterator,
} from "../../lib/monocol/types";

import { as, p } from "../../lib/helpers";
import Paragraph from "../../lib/monocol/paragraph";
import { IsFn, isN_0, N_0 } from "../../lib/types";

interface TestCase {
  colWidth?: N_0;
  desc: string;
  expected: string;
  source: string;
}

interface Test {
  colWidth?: N_0;
  desc: string;
  it: TestCase[];
}

export interface TestData {
  colWidth?: N_0;
  tests: Test[];
  values?: { [name: string]: any };
}

function hasA<T>(name: string, is: IsFn<T>, x: any): boolean {
  return _.isObject(x) && _.has(name, x) && is(_.get(name, x));
}

function mayHaveA<T>(name: string, is: IsFn<T>, x: any): boolean {
  return _.isObject(x) && (_.has(name, x) ? is(_.get(name, x)) : true);
}

function hasArrayOf<T>(
  name: string,
  is: IsFn<T>,
  x: any,
): boolean {
  return hasA(name, _.isArray, x) && _.every(is, _.get(name, x));
}

function isTestCase(x: any): x is TestCase {
  return (
    _.every(
      n => hasA(n, _.isString, x),
      ["desc", "expected", "source"],
    )
    && mayHaveA("colWidth", isN_0, x)
  );
}

function isTest(x: any): x is Test {
  return (
    hasA("desc", _.isString, x)
    && hasArrayOf("it", isTestCase, x)
    && mayHaveA("colWidth", isN_0, x)
  );
}

function isTestData(x: any): x is TestData {
  return (
    mayHaveA("colWidth", isN_0, x)
    && mayHaveA("values", _.isObject, x)
    && hasArrayOf("tests", isTest, x)
  );
}


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

export function renderLines(paragraph: Paragraph): string {
  let str = "";
  
  let n = 1;
  
  for (const line of paragraph) {
    let lineStr = "";
    for (const s of line) {
      lineStr += s;
    }
    p(`Rendering line ${n}`, lineStr);
    n += 1;
    str += `${ lineStr }\n`;
  }
  
  if (!str.endsWith("\n")) { str += "\n"; }
  
  return str;
}

export function runTestData(
  data: any,
  block?: (paragraph: Paragraph) => void,
): void {
  const testData = as(isTestData, data);
  // const values = testData.values;
  
  testData.tests.forEach(test => {
    describe(test.desc, () => {
      test.it.forEach(testCase => {
        const colWidth =
          as(isN_0, testCase.colWidth || test.colWidth || testData.colWidth);
          
        const paragraph = new Paragraph(testCase.source, colWidth);
        
        it(testCase.desc, () => {
          if (block) { block(paragraph); }
          expect(renderLines(paragraph)).toEqual(testCase.expected);
        });
      });
    });
  });
}
