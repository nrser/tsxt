/**
 * Test Helpers
 * ===========================================================================
 * 
 * Yeah um this stuff helps you with your tests.
 */
/// <reference types="jest" />
 
import _ from 'lodash/fp';

import 'jest';
import Matchers from 'expect/build/matchers';

import 'jest-extended';
import ExtMatchers from 'jest-extended/dist/matchers';

import * as JMU from 'jest-matcher-utils';


export type ComposeFn = () => any;


export function isCustomMatcherResult(
  value: any
): value is jest.CustomMatcherResult {
  return  _.isObject( value ) &&
          _.has( 'pass', value ) &&
          _.has( 'message', value);
}


export function composeMatchers(
  ...fns: ComposeFn[]
): jest.CustomMatcherResult {
  if (_.isEmpty( fns )) {
    throw new Error(
      `Arguments can not be empty - must provide at least one function`
    );
  }
  
  const [fn, ...rest] = fns;
  const result = fn();
  
  if (_.isUndefined( result )) {
    // An undefined result just means keep going; it's used for things like 
    // conditional 
    return composeMatchers( ...rest );
    
  } else if( _.isArray( result ) ) {
    return composeMatchers( ...result, ...rest );
    
  } else if( _.isEmpty( rest ) &&
            (_.isString( result ) || _.isFunction( result )) ) {
      
    // console.log( `composeMatchers() - forming result` );
    // console.log( _.isFunction( result ) ? result() : result );
              
    return { pass: true, message: result };
    
  } else if( isCustomMatcherResult( result ) ) {
    if (_.isEmpty( rest ) || !_.get( 'pass', result )) { return result }
    
    return composeMatchers( ...rest );
    
  } else {
    throw new Error( `Um can't handle result ${ result }` );
  }
} // composeMatchers()


function toEqualLines(
  this: jest.MatcherUtils,
  received: any,
  ...lines: string[]
): jest.CustomMatcherResult {
  return composeMatchers(
    () => ExtMatchers.toBeString.call( this, received ),
    () => Matchers.toEqual.call( this, received, lines.join( "\n" ) ),
  );
}


expect.extend({
  toEqualLines,
});

