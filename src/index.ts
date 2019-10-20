// Imports
// ===========================================================================

import { JSDOM } from 'jsdom';
import _ from 'lodash/fp';
import set from 'lodash/set';
import TurndownService from 'TURNDOWN';


// Definitions
// ===========================================================================

// Types
// ---------------------------------------------------------------------------

export type Props =
  null | Record<string, any>;
  
export type ElementCreator =
  (props: Props, ...children: Node[]) => null | Node;
  
export type Type =
  string | ElementCreator;

/**
 * How we know that [[Tsxt]] is itself (receiving itself triggers the rendering
 * overload).
 */
export interface IsTsxt {
  IS_TSXT: true;
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


// Constants
// ---------------------------------------------------------------------------

/**
 * A [[Document]] object from `.window.document` of a new [[JSDOM]].
 * 
 * Used to create DOM elements.
 */
const DOCUMENT: Document =
  (new JSDOM( `` )).window.document;

/**
 * A default-config [[TurndownService]] for converting DOM nodes to Markdown
 * strings.
 */
const TURNDOWN_SERVICE: TurndownService =
  new TurndownService();


// Functions
// ---------------------------------------------------------------------------

// ### Type Guards ###

function isNode( value: any ): value is Node {
  // TODO   Janky...?
  // 
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const nodeType = _.get( 'nodeType', value );
  return _.isNumber( nodeType ) && nodeType >= 1 && nodeType <= 12;
}

function isElementCreator( value: any ): value is ElementCreator {
  return _.isFunction( value );
}

function isTsxt( value: any ): value is IsTsxt  {
  return _.get( 'IS_TSXT', value ) === true;
}


// ### Creating Elements (DOM Nodes) ###

function toElement( value: any ): Node {
  if (isNode( value )) {
    return value;
  } else if (_.isString( value )) {
    return DOCUMENT.createTextNode( value );
  } else {
    // console.log( `toElement() - toString() fallthrough!` );
    // console.log({ value, isNode: isNode( value ) });
    
    const node = DOCUMENT.createTextNode( value.toString() );
    set( node, Symbol.for( 'TsxtValue' ), value );
    
    return node;
  }
}


function toElements( values: any[] ): Node[] {
  const nodes: Node[] = [];
  
  values.forEach( value => {
    if (_.isArray( value )) {
      nodes.push( ...toElements( value ) );
    } else if (value !== null && value !== undefined) {
      nodes.push( toElement( value ) )
    }
  });
  
  return nodes;
}


function createElement(
  type: string,
  props: Props,
  ...children: any[]
): HTMLElement {
  const element = DOCUMENT.createElement( type );
  
  if (_.isObject( props )) {
    _.each(
      ([name, value]) => element.setAttribute( name, value ),
      _.toPairs( props ),
    );
  }
  
  _.each(
    element.appendChild.bind( element ),
    toElements( children )
  );
  
  return element;
} // createElement()


// ### The Main Interface ###

const Tsxt =
  Object.assign(
    ( type: any, props: Props, ...children: any[] ) => {
      // console.log({ type, props, children });
      
      if (_.isString( type )) {
        return createElement( type, props, ...children );
        
      } else if (isTsxt( type )) {
        return TURNDOWN_SERVICE.turndown(
          createElement( 'div', props, ...children )
        );
        
      } else if (isElementCreator( type )) {
        return type( props, ...toElements( children ) );
        
      } else {
        throw new Error( `Not sure what this 'type' is: ${ type }` );
      }
    },
    {
      IS_TSXT: true,
    },
  ) as ITsxt;


// Exports
// ===========================================================================

export {
  isNode,
  isElementCreator,
  isTsxt,
  toElement,
  toElements,
  createElement,
  Tsxt,
}

export default Tsxt;
