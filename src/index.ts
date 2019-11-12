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

import { Element } from './element';
import { render } from './out/markdown';


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
        const root = Element.create( 'div', props, ...children );
        return render( root );
        
      } else if (isCreatorFunction( type )) {
        return type( props, ...children );
        
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
  Element,
}

export default Tsxt;
