// Imports
// ===========================================================================

// ### Deps ###

import I8 from 'immutable';
import _ from 'lodash/fp';
import {
  Option,
  Some,
  some,
  none,
  isSome,
  map,
  mapNullable,
  fromNullable,
  getOrElse,
  filterMap,
} from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable'

// ### Project / Package ###

import { Element } from './element';
import { findFirstOf, findLastOf } from '../helpers';

import { Traverse, Path, ExpandedPath } from './traverse';


// Definitions
// ===========================================================================

export class ChildElementTraverse extends Traverse {
  
  constructor( root: Element, path: Path ) {
    if (path.size === 0) {
      throw new Error( `child traverse may not point to the root` );
    }
    
    super( root, path );
    
    if (!Element.is( this.value  )) {
      throw new Error( `value at path must be an Element` );
    }
  }
  
  get element(): Some<Element> {
    return some( this.value ) as Some<Element>;
  }
  
  get children(): Some<I8.List<any>> {
    return some( Element.children( this.element.value ) ) as Some<I8.List<any>>;
  }
  
  up(): Some<Traverse>;
  up( depth: 1 ): Some<Traverse>;
  up( depth: number = 1 ): Option<Traverse> {
    return this.path.size < depth
      ? none
      : this.slicePath( 0, this.path.size - depth );
  }
  
  get parentElement(): Some<Element> {
    return pipe(
      this.getIn( this.path.slice( 0, -1 ) ),
      mapNullable( parent => Element.is( parent ) ? parent : null ),
    ) as Some<Element>;
  }
  
  get index(): Some<number> {
    return some( this.path.last() ) as Some<number>;
  }
  
} // class Traverse


export default ChildElementTraverse;
