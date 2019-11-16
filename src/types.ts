// Imports
// ===========================================================================

import _ from 'lodash/fp';
import { Element } from './element';


// Definitions
// ===========================================================================

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
