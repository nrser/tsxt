// Imports
// ===========================================================================


import _                from 'lodash/fp';

// ### Project / Package ###

import {
  Props,
  isElementCreator,
  isTsxt,
  ITsxt,
} from './types';

import { createElement  } from './immutable';
import { render } from './out/markdown';


// Definitions
// ===========================================================================

/**
 * The main interface: both the function that is assigned to handle JSX *and*
 * a custom JSX element that *renders* it's contents to a Markdown string.
 * 
 */
// const Tsxt =
//   Object.assign(
//     ( type: any, props: Props, ...children: any[] ) => {
//       // console.log({ type, props, children });
      
//       if (_.isString( type )) {
//         return createElement( type, props, ...children );
        
//       } else if (isTsxt( type )) {
//         return TURNDOWN_SERVICE.turndown(
//           createElement( 'div', props, ...children )
//         );
        
//       } else if (isElementCreator( type )) {
//         return type( props, ...toElements( children ) );
        
//       } else {
//         throw new Error( `Not sure what this 'type' is: ${ type }` );
//       }
//     },
//     {
//       IS_TSXT: true,
//     },
//   ) as ITsxt;


/**
 * The main interface: both the function that is assigned to handle JSX *and*
 * a custom JSX element that *renders* it's contents to a Markdown string.
 * 
 */
const Tsxt =
  Object.assign(
    ( type: any, props: Props, ...children: any[] ) => {
      if (_.isString( type )) {
        return createElement( type, props, ...children );
        
      } else if (isTsxt( type )) {
        const root = createElement( 'div', props, ...children );
        return render( root );
        
      } else if (isElementCreator( type )) {
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

export default Tsxt;
