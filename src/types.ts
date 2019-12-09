// Imports
// ===========================================================================

import _ from 'lodash/fp';
import { Element } from './element';


// Definitions
// ===========================================================================

export type IsFn<T> = (x: any) => x is T;

export type None = undefined | null;

export function isNone(x: any): x is None {
  return x === undefined || x === null;
}

export const is = <T>(x: Optional<T>): x is T => !isNone(x);

// tslint:disable-next-line: class-name
interface N_0Brand { readonly N_0BrandID: unique symbol; }

// tslint:disable-next-line: class-name
interface N_1Brand { readonly N_1BrandID: unique symbol; }

export type N_0 = number & N_0Brand;
export type N_1 = number & N_1Brand;

export function isN_0(x: any): x is N_0 { return _.isInteger(x) && x >= 0; }
export function isN_1(x: any): x is N_1 { return _.isInteger(x) && x > 0; }

export type Optional<T> = None | T;


export type Props = null | Record<string, any>;

/**
 * Expected signature for functions found in the JSX tree, which are called
 * to produce document nodes.
 */
export type CreatorFunction =
  (props: Props, ...children: any[]) => any;
  
export function isCreatorFunction( value: any ): value is CreatorFunction {
  return _.isFunction( value ) && value.length === 1;
}
  
export type Type = string | CreatorFunction;

/**
 * How we know that [[Tsxt]] is itself (receiving itself triggers the rendering
 * overload).
 */
export interface IsTsxt {
  IS_TSXT: true;
}

export function isTsxt( value: any ): value is IsTsxt  {
  return _.get( 'IS_TSXT', value ) === true;
}

export interface ITsxt extends IsTsxt {
  /**
   * The render form - when passed *itself* the [[Tsxt]] function renders the
   * elements and returns a string.
   */
  ( type: IsTsxt, props: Props, ...children: any[] ): string | Element;
  
  ( type: string, props: Props, ...children: any[] ): Element;
  
  /**
   * The common form - creates [[Element]] nodes by proxying to
   * [[createElement]].
   */
  ( type: CreatorFunction, props: Props, ...children: any[] ): Element;
  
  /**
   * The IDFK form :/
   * 
   * FIXME  It *needs* this to type check `<Tsxt>...</Tsxt>`
   *       
   *        Maybe has something to do with the intrinsic JSX types?
   */
  ( type: any, props: Props, ...children: any[] ): Element;
  
  md( root: JSX.Element ): string;
} // interface ITsxt
