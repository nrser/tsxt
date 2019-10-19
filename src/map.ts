// Imports
// ===========================================================================

// ### Deps ###

import _ from  'lodash/fp';
import invariant from 'invariant';

// ### Project / Package ###

import {
  toElement,
  createElement,
  Props
} from './index';


// Definitions
// ===========================================================================

function transformNode( k: any, v: any, node: Node ): Node {
  if (node.nodeType === node.TEXT_NODE) {
    const value = _.get( Symbol.for( 'TsxtValue' ), node );
    
    if (_.isFunction( value )) {
      return toElement( value.call( null, k, v ) );
    } else {
      return node.cloneNode();
    }
  } else {   
    const newNode = node.cloneNode();
    
    while( newNode.firstChild ) {
      newNode.removeChild( newNode.firstChild );
    }
    
    node.childNodes.forEach( (oldNode) => {
      newNode.appendChild( transformNode( k, v, oldNode ) );
    });
    
    return newNode;
  }
}  // transformNode()


function Map( props: Props, ...children: Node[] ): null | HTMLElement {
  if (props === null) {
    invariant( true, `Tsxt.map requires an \`object\` attribute` );
    return null;
  }
  
  const object = props.object;
  
  if (!_.isObject( object )) {
    invariant( true,  `Tsxt.map[object] must be in Object, got ${ object }` );
    return null;
  }
  
  return createElement(
    'div',
    null,
    ..._.pipe(
      _.toPairs,
      _.map(( [k, v] ) =>
          _.map( child =>
            transformNode( k, v, child ), children ) ),
      _.flatten,
    )( object )
  )
}


// Exports
// ===========================================================================

export default Map;
