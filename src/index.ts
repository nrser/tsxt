// Imports
// ===========================================================================


import _ from 'lodash/fp';

// ### Project / Package ###

import {
  Props,
  isCreatorFunction,
  isTsxt,
  ITsxt,
} from './types';

import { Q } from './helpers';
import { Element } from './element';
import * as Markdown from './out/markdown';


// Definitions
// ===========================================================================

/**
 * The main interface: both the function that is assigned to handle JSX *and*
 * a custom JSX element that *renders* it's contents to a Markdown string.
 * 
 */
const Tsxt =
  Object.assign(
    ( type: any, props: Props, ...children: any[] ) => {
      if (_.isString( type )) {
        return Element.create( type, props, ...children );
        
      } else if (isTsxt( type )) {
        return Element.create( 'document', props, ...children );
        
        // if (root.props.has( 'render' )) {
        //   const render = root.props.get( 'render' );
          
        //   switch (render)  {
        //     case 'markdown':
        //       return Markdown.render( root );
        //     default:
        //       throw new Error( Q`Unknown render value: ${ render }` );
        //   }
        // }
        
        // return Markdown.render( root );
        
      } else if (isCreatorFunction( type )) {
        return type( props, ...children );
        
      } else {
        throw new Error( Q`Not sure what this 'type' is: ${ type }` );
      }
    },
    {
      IS_TSXT: true,
      
      md( root: JSX.Element ): string {
        return Markdown.render( root );
      }
    },
  ) as ITsxt;


// Exports
// ===========================================================================

export {
  Element,
  Markdown,
}

export default Tsxt;
