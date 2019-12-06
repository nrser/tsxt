/**
 * Test Helpers
 * ===========================================================================
 * 
 * Yeah um this stuff helps you with your tests.
 */

import _ from "lodash/fp";

import Matchers from "expect/build/matchers";
import "jest";

import "jest-extended";
import ExtMatchers from "jest-extended/dist/matchers";

import * as JMU from "jest-matcher-utils";


export type ComposeFn = () => any;

function callWith<TArgs extends unknown[], TReturn>(
  ...args: TArgs
): (f: (...args: TArgs) => TReturn) => TReturn {
  return f => f(...args);
}


export function isCustomMatcherResult(
  value: any,
): value is jest.CustomMatcherResult {
  return (
    _.isObject(value) &&
    _.isBoolean(_.get("pass", value)) &&
    _.any(
      callWith(_.get("message", value)),
      [_.isString, _.isFunction],
    )
  );
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

  } else if (_.isEmpty(rest) &&
    (_.isString(result) || _.isFunction(result))) {

    // console.log( `composeMatchers() - forming result` );
    // console.log( _.isFunction( result ) ? result() : result );

    return { pass: true, message: result };

  } else if (isCustomMatcherResult(result)) {
    if (_.isEmpty(rest) || !_.get("pass", result)) { return result; }

    return composeMatchers(...rest);

  } else {
    throw new Error(`Um can't handle result ${result}`);
  }
} // composeMatchers()


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

      return { message: `Good job`, pass: true };
    },
  );
} // toBeIterator()


// function toIterate(
//   this: jest.MatcherUtils,
//   received: any,
//   ...values: any[]
// ): jest.CustomMatcherResult {
//   return composeMatchers(
//     () => ExtMatchers.toBeObject.call(this, received),
//   );
// }


expect.extend({
  toBeIterator,
  toEqualLines,
});

