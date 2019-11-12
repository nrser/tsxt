// // Imports
// // ===========================================================================

// // ### Deps ###

// import _ from  'lodash/fp';
// import invariant from 'invariant';

// // ### Project / Package ###

// import {
//   Props,
// } from './types';

// import { Q } from './helpers';

// import {
//   toElement,
//   createElement,
// } from './dom';


// // Definitions
// // ===========================================================================

// function transformNode( k: any, v: any, node: Node ): Node {
//   if (node.nodeType === node.TEXT_NODE) {
//     const value = _.get( Symbol.for( 'TsxtValue' ), node );
    
//     if (_.isFunction( value )) {
//       return toElement( value.call( null, k, v ) );
//     } else {
//       return node.cloneNode();
//     }
//   } else {   
//     const newNode = node.cloneNode();
    
//     while( newNode.firstChild ) {
//       newNode.removeChild( newNode.firstChild );
//     }
    
//     node.childNodes.forEach( (oldNode) => {
//       newNode.appendChild( transformNode( k, v, oldNode ) );
//     });
    
//     return newNode;
//   }
// }  // transformNode()


// function Map( props: Props, ...children: Node[] ): null | Element {
//   if (props === null) {
//     invariant( false, Q`Tsxt.map requires an ${`object`} attribute` );
//     return null;
//   }
  
//   const object = props.object;
  
//   if (!_.isObject( object )) {
//     invariant( false, Q`Tsxt.map[object] must be in Object, got ${ object }` );
//     return null;
//   }
  
//   return createElement(
//     'div',
//     null,
//     ..._.pipe(
//       _.toPairs,
//       _.map(( [k, v] ) =>
//           _.map( child =>
//             transformNode( k, v, child ), children ) ),
//       _.flatten,
//     )( object )
//   )
// } // Map()


// // Exports
// // ===========================================================================

// export default Map;
