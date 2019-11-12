// Imports
// ===========================================================================

// ### Deps ###

import _ from  'lodash/fp';
import invariant from 'invariant';
import I8 from 'immutable';

// ### Project / Package ###

import {
  Props,
} from './types';

import { Q } from './helpers';

import { Element } from './element';


// Definitions
// ===========================================================================

function transformNode( key: string, value: any, node: any ): any {
  if (Element.is( node )) {
    return node.updateIn(
      [ 'props', 'children' ],
      (children: I8.List<any>) =>
        children.map( child => transformNode( key, value, child ) )
    );
  } else if (_.isFunction( node )) {
    return node.call( undefined, key, value );
  } else {
    return node;
  }
}  // transformNode()


function Map( props: Props, ...children: any[] ): any {
  if (props === null) {
    invariant( false, Q`Tsxt.map requires an ${`object`} attribute` );
    return null;
  }
  
  const object = props.object;
  
  if (!_.isObject( object )) {
    invariant( false, Q`Tsxt.map[object] must be in Object, got ${ object }` );
    return null;
  }
  
  return _.pipe(
    _.toPairs,
    _.map(( [key, value] ) =>
      _.map( child => transformNode( key, value, child ), children ) ),
  )( object );
} // Map()


// Exports
// ===========================================================================

export default Map;
