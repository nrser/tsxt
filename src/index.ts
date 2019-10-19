// Imports
// ===========================================================================

import { JSDOM } from 'jsdom';
import _ from 'lodash/fp';
import TurndownService from 'TURNDOWN';
import { type } from 'os';


// Types
// ---------------------------------------------------------------------------

export type Attrs           = null | Record<string, any>;
export type ElementCreator  = (attrs: Attrs, ...children: Node[]) => Node;
export type Type            = string | ElementCreator;

export interface IsTsxt {
  IS_TSXT: true;
}

export interface ITsxt extends IsTsxt {
  ( type: IsTsxt, attrs: Attrs, ...children: any[] ): string;
  ( type: Type, attrs: Attrs, ...children: any[] ): HTMLElement;
  
  // FIXME  It *needs* this to type check `<Tsxt>...</Tsxt>`
  //        
  //        Maybe has something to do with the intrinsic JSX types?
  //        
  ( type: any, attrs: Attrs, ...children: any[] ): never; 
}

// Definitions
// ===========================================================================

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

function isNode( value: any ): value is Node {
  // TODO   Janky...?
  // 
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const nodeType = _.get( 'nodeType', value );
  return _.isNumber( nodeType ) && nodeType >= 1 && nodeType <= 12;
}


function toElement( value: any ): Node {
  if (isNode( value )) {
    return value;
  } else if (_.isString( value )) {
    return DOCUMENT.createTextNode( value );
  } else {
    // console.log( `toElement() - toString() fallthrough!` );
    // console.log({ value, isNode: isNode( value ) });
    
    return DOCUMENT.createTextNode( value.toString() );
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
  attrs: Attrs,
  ...children: any[]
): HTMLElement {
  const element = DOCUMENT.createElement( type );
  
  if (_.isObject( attrs )) {
    _.each(
      ([name, value]) => element.setAttribute( name, value ),
      _.toPairs( attrs ),
    );
  }
  
  _.each(
    element.appendChild.bind( element ),
    toElements( children )
  );
  
  return element;
} // createElement()


function isTsxt( value: any ): value is IsTsxt  {
  return _.get( 'IS_TSXT', value ) === true;
}


function isElementCreator( value: any ): value is ElementCreator {
  return _.isFunction( value );
}


const Tsxt =
  Object.assign(
    ( type: any, attrs: Attrs, ...children: any[] ) => {
      // console.log({ type, attrs, children });
      
      if (_.isString( type )) {
        return createElement( type, attrs, ...children );
        
      } else if (isTsxt( type )) {
        return TURNDOWN_SERVICE.turndown(
          createElement( 'div', attrs, ...children )
        );
        
      } else if (isElementCreator( type )) {
        return type( attrs, ...toElements( children ) );
        
      } else {
        throw new Error( `Not sure what this 'type' is: ${ type }` );
      }
    },
    { IS_TSXT: true },
  ) as ITsxt;


// Exports
// ===========================================================================

export {
  isNode,
  toElement,
  createElement,
  Tsxt,
}

export default Tsxt;

