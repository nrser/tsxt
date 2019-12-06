/**
 * Test Helpers
 * ===========================================================================
 * 
 * Yeah um this stuff helps you with your tests.
 */

import _ from "lodash/fp";
import print from "print";

import Matchers from "expect/build/matchers";
import "jest";

import { ExpectationResult } from "expect/build/types";
import "jest-extended";
import ExtMatchers from "jest-extended/dist/matchers";

// import * as JMU from "jest-matcher-utils";


export type ComposeFn = () => any;


function p(x: any): string {
  return `\n\n${print(x)}\n\n`;
}


export function isCustomMatcherMessage(x: any): x is () => string {
  return _.isFunction(x) && x.length === 0;
}


export function isCustomMatcherResult(x: any): x is jest.CustomMatcherResult {
  return (
    _.isObject(x) &&
    _.isBoolean(_.get("pass", x)) &&
    isCustomMatcherMessage(_.get("message", x))
  );
}


export function isIterator<T = unknown>(x: any): x is Iterator<T> {
  if (!_.isObject(x)) { return false; }
  
  const next = _.get("next", x);
  
  return _.isFunction(next) && (next.length === 0 || next.length === 1);
}


function pass(...messages: string[]): jest.CustomMatcherResult {
  return {
    message: () => messages.join(" "),
    pass: true,
  };
}


function fail(...messages: string[]): jest.CustomMatcherResult {
  return {
    message: () => messages.join(" "),
    pass: false,
  };
}


export function composeMatchers(
  ...fns: ComposeFn[]
): jest.CustomMatcherResult {
  if (_.isEmpty(fns)) {
    throw new Error(
      `Arguments can not be empty - must provide at least one function`,
    );
  }

  const [fn, ...rest] = fns;
  const result = fn();

  if (_.isUndefined(result)) {
    // An undefined result just means keep going; it's used for things like 
    // conditional 
    return composeMatchers(...rest);

  } else if (_.isArray(result)) {
    return composeMatchers(...result, ...rest);

  } else if (
    _.isEmpty(rest) &&
    (_.isString(result) || isCustomMatcherMessage(result))
  ) {
    return {
      message: _.isString(result) ? () => result : result,
      pass: true,
    };

  } else if (isCustomMatcherResult(result)) {
    if (_.isEmpty(rest) || !_.get("pass", result)) { return result; }

    return composeMatchers(...rest);

  } else {
    throw new Error(`Um can't handle result:${p(result)}`);
  }
} // composeMatchers()


function getResult(
  this: jest.MatcherUtils,
  matcher:
    (this: jest.MatcherUtils, receiver: any, ...args: unknown[]) =>
      ExpectationResult,
  receiver: any,
  ...args: unknown[]
): jest.CustomMatcherResult {
  const expResult: ExpectationResult = matcher.call(this, receiver, ...args);
  
  if (isCustomMatcherResult(expResult)) {
    return expResult;
  }
  
  throw new Error(
    `Can't yet handle matchers that return anything but ` +
    `jest.CustomMatcherResult / SyncExpectationResult\n\n` +
    `So basically, no async matchers that return promises. Sorry.\n\n` +
    `Found this guy:` +
    p(expResult),
  );
}


function toEqualLines(
  this: jest.MatcherUtils,
  received: any,
  ...lines: string[]
): jest.CustomMatcherResult {
  return composeMatchers(
    () => ExtMatchers.toBeString.call(this, received),
    () => Matchers.toEqual.call(this, received, lines.join("\n")),
  );
} // toEqualLines()


function toBeIterator(
  this: jest.MatcherUtils,
  received: any,
): jest.CustomMatcherResult {
  return composeMatchers(
    () => ExtMatchers.toBeObject.call(this, received),
    () => Matchers.toHaveProperty.call(this, received, "next"),
    
    () => {
      const next = _.get("next", received);

      if (!_.isFunction(next)) {
        return fail(`Received object missing \`next()\` function`);
      }

      // MDN clearly says the `next()` of the iterator is a
      // "zero arguments function" [1][].
      // 
      // But, on inspection, generators - which are said to conform to the
      // iterator protocol [2][] - have a `next()` function of length `1`;
      // they accept a single `value` to provide as the result of the 
      //  associated `yield` call.
      // 
      // 1: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#Is_a_generator_object_an_iterator_or_an_iterable
      // 2: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
      // 
      if (next.length !== 0 && next.length !== 1) {
        return fail(
          `Received object's \`next()\` should take 0 or 1 arguments,`,
          `found length ${next.length}`,
        );
      }

      return pass(`Looks like a fine ITERATOR to me!`);
    },
  );
} // toBeIterator()


function toIterate(
  this: jest.MatcherUtils,
  received: any,
  values: any[],
  {andBeDone = true}: {andBeDone?: boolean} = {},
): jest.CustomMatcherResult {
  return composeMatchers(
    () => toBeIterator.call(this, received),
    
    () => {
      if (!isIterator(received)) {
        throw new Error(`Should have been caught up there!`);
      }
      
      for (let i = 0; i < values.length; i++) {
        const result = received.next();
        
        if (result.done) {
          return fail(
            `Expected iterator to produce`,
            p(values),
            `but it finished`,
            i > 0
              ? `after only ${i} iterations (at ${print(values[i - 1])})`
              : `immediately`,
          );
        }
        
        const matchResult =
          getResult.call(this, Matchers.toEqual, result.value, values[i]);
        
        if (!matchResult.pass) {
          return fail(
            `Expected iterator to produce`,
            p(values),
            `but entry ${i + 1} was`,
            p(result.value),
          );
        }
        
      } // for values
      
      if (andBeDone) {
        const result = received.next();
        
        if (!result.done) {
          return fail(
            `Expected iterator to be done after`,
            p(values),
            `but it kept going, producing`,
            p(result.value),
          );
        }
      }
      
      return pass(`Got 'em all! Good iterator!`);
    },
  );
} // toIterate()


expect.extend({
  toBeIterator,
  toEqualLines,
  toIterate,
});

