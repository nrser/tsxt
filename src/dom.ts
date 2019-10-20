/**
 * The original Document Object Model (DOM)-based solution, where
 * [[createElement]] really *does* create an actual DOM node using the
 * [['jsdom']] package.
 * 
 * Which worked! And had the especially nice nicety of feeding strait in to
 * [['turndown']], which expects either an HTML string (to parse into a DOM
 * node) *or* a DOM node itself. Actually turndown led me to 
 * JSDOM - that's what it uses to parse HTML in NodeJS.
 * 
 * But I want to explore other options... which essentially means rolling one
 * myself. JSDOM seems super overkill for what this lib needs right now,
 * and possibly has security implications I don't even want to think about given
 * it's scope seems to extend to being a headless browser of sorts.
 * 
 * Besides the fact that turndown depends on JSDOM, turndown's parse-n-DOM model
 * is not really ideal for us, and a preliminary look led me to believe that
 * it's a significant amount of their code.
 */

// Imports
// ===========================================================================

// ### Deps ###

import _ from 'lodash/fp';
import { JSDOM } from 'jsdom';
import set from 'lodash/set';
import invariant from 'invariant';

// ### Project / Package ###

import {
  Props,
} from './types';

import { Q } from './helpers';


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


// Functions
// ---------------------------------------------------------------------------

// ### Type Guards ###

export function isNode( value: any ): value is Node {
  // TODO   Janky...?
  // 
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
  const nodeType = _.get( 'nodeType', value );
  return _.isNumber( nodeType ) && nodeType >= 1 && nodeType <= 12;
}


// ### Creating Elements (DOM Nodes) ###

export function toElement( value: any ): Node {
  if (isNode( value )) {
    return value;
  } else if (_.isString( value )) {
    return DOCUMENT.createTextNode( value );
  } else {
    invariant( !_.isNull( value ),
      Q`Should *not* pass ${ null } to ${ `toElement()` }, filter it ` +
      Q`first or use ${ `toElements()` }`
    );
    
    invariant( !_.isNull( value ),
      Q`Should *not* pass ${ undefined } to ${ `toElement()` }, filter it ` +
      Q`first or use ${ `toElements()` }`
    );
    
    const node = DOCUMENT.createTextNode( value.toString() );
    set( node, Symbol.for( 'TsxtValue' ), value );
    
    return node;
  }
}


export function toElements( values: any[] ): Node[] {
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


export function createElement(
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