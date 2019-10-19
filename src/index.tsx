// Imports
// ===========================================================================

import { JSDOM } from 'jsdom';
import { is as jsdomIsNode } from 'jsdom/lib/jsdom/living/generated/node';
import _ from 'lodash/fp';
import TurndownService from 'turndown';


// Definitions
// ===========================================================================

const document = (new JSDOM( `` )).window.document;
const turndown = new TurndownService();


function isNode( value: any ): value is Node {
  return jsdomIsNode( value );
}


function toElement( value: any ): Node {
  if (isNode( value )) {
    return value;
  } else if (_.isString( value )) {
    return document.createTextNode( value );
  } else {
    return document.createTextNode( value.toString() );
  }
}


function createElement(
  type: 'tsxt',
  props: null | Record<string, any>,
  ...children: any[]
): string;

function createElement(
  type: string,
  props: null | Record<string, any>,
  ...children: any[]
): HTMLElement;

function createElement( type, props, ...children ) {
  const element = document.createElement( type );
  
  if (_.isObject( props )) {
    _.each(
      ([name, value]) => element.setAttribute( name, value ),
      _.toPairs( props ),
    );
  }
  
  _.each( child => element.appendChild( toElement( child ) ), children );
  
  if (type === 'tsxt') {
    return turndown.turndown( element );
  } else {
    return element;
  }
} // createElement()


// Exports
// ===========================================================================

export {
  createElement,
}

