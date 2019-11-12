// Imports
// ===========================================================================


import I8               from 'immutable';
import _                from 'lodash/fp';
import TurndownService  from 'TURNDOWN';

// ### Project / Package ###

import {
  Props,
  isElementCreator,
  isTsxt,
  ITsxt,
} from './types';

import {
  createElement,
  toElements,
} from './dom';

import {
  createElement as I8CreateElement,
} from './immutable';

import { Traverse } from './immutable/traverse';

// Definitions
// ===========================================================================

// Constants
// ---------------------------------------------------------------------------

/**
 * A default-config [[TurndownService]] for converting DOM nodes to Markdown
 * strings.
 */
const TURNDOWN_SERVICE: TurndownService =
  new TurndownService();


// Functions
// ---------------------------------------------------------------------------

/**
 * The main interface: both the function that is assigned to handle JSX *and*
 * a custom JSX element that *renders* it's contents to a Markdown string.
 * 
 */
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


/**
 * The main interface: both the function that is assigned to handle JSX *and*
 * a custom JSX element that *renders* it's contents to a Markdown string.
 * 
 */
const I8Tsxt =
  Object.assign(
    ( type: any, props: Props, ...children: any[] ) => {
      if (_.isString( type )) {
        return I8CreateElement( type, props, ...children );
        
      } else if (isTsxt( type )) {
        const root = I8CreateElement( 'div', props, ...children );
        const traverse = Traverse.for( root, I8.List<number>() );
        
        return TURNDOWN_SERVICE.turndown( traverse as any );
        
      } else if (isElementCreator( type )) {
        // return type( props, ...children );
        throw new Error( `Not implemented` );
        
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

export default I8Tsxt;
