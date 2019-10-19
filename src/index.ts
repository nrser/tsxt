// Imports
// ===========================================================================

import { JSDOM } from 'jsdom';
// import { is as jsdomIsNode } from 'jsdom/lib/jsdom/living/generated/node';
import _ from 'lodash/fp';
import TurndownService from 'TURNDOWN';


// Types
// ---------------------------------------------------------------------------

export type Attrs = null | Record<string, any>;

export type ElementCreator = (attrs: Attrs, ...children: Node[]) => Node
export type Type = string | ElementCreator;


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
    console.log({ value, isNode: isNode( value ) });
    return DOCUMENT.createTextNode( value.toString() );
  }
}


function createElement(
  type: 'tsxt',
  attrs: Attrs,
  ...children: any[]
): string;

function createElement(
  type: string,
  attrs: Attrs,
  ...children: any[]
): HTMLElement;

function createElement( type: Type, attrs: Attrs, ...children: any[] ) {
  if (_.isFunction( type )) {
    return type( attrs, ..._.map( toElement, children ) );
  }
  
  const element = DOCUMENT.createElement( type );
  
  if (_.isObject( attrs )) {
    _.each(
      ([name, value]) => element.setAttribute( name, value ),
      _.toPairs( attrs ),
    );
  }
  
  _.each( child => element.appendChild( toElement( child ) ), children );
  
  if (type === 'tsxt') {
    return TURNDOWN_SERVICE.turndown( element );
  } else {
    return element;
  }
} // createElement()


// Exports
// ===========================================================================

export {
  isNode,
  toElement,
  createElement,
}

export default createElement;

