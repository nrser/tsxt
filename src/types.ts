// Imports
// ===========================================================================

import _ from 'lodash/fp';


// Definitions
// ===========================================================================

export type Props = null | Record<string, any>;
  
export type ElementCreator =
  (props: Props, ...children: Node[]) => null | Node;
  
export function isElementCreator( value: any ): value is ElementCreator {
  return _.isFunction( value );
}
  
export type Type = string | ElementCreator;

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
  ( type: IsTsxt, props: Props, ...children: any[] ): string;
  
  /**
   * The common form - creates [[HTMLElement]] nodes by proxying to
   * [[createElement]].
   */
  ( type: Type, props: Props, ...children: any[] ): HTMLElement;
  
  /**
   * The IDFK form :/
   * 
   * FIXME  It *needs* this to type check `<Tsxt>...</Tsxt>`
   *       
   *        Maybe has something to do with the intrinsic JSX types?
   */
  ( type: any, props: Props, ...children: any[] ): never;
  
} // interface ITsxt