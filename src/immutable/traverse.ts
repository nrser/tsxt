// Imports
// ===========================================================================

// ### Deps ###

import I8 from 'immutable';
import _ from 'lodash/fp';
import {
  Option,
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


// Definitions
// ===========================================================================

// export namespace Path {
//   export type Segment = number;
// }

// export type Path = Path.Segment[];

export type Path = I8.List<number>;
export type ExpandedPath = ('props' | 'children' | number)[];


export class Traverse {
  
  static *expandPathItr( path: Path ) {
    // Can't really use `forEach` in generator so good ol' for loop
    for (let i  = 0; i < path.size; i++) {
      yield 'props';
      yield 'children';
      
      // This is dumb... since we're looping over the list bounds `index` will
      // **always** be a number but TS can't understand that (or I don't know
      // how to make it).
      const index = path.get( i );
      if (index) { yield index };
    }
  }
  
  static expandPath( path: Path ): ExpandedPath {
    return Array.from( this.expandPathItr( path ) );
  }
  
  readonly root: Element;
  readonly path: Path;
  readonly value: any;
  
  constructor( root: Element, path: Path ) {
    const expandedPath = Traverse.expandPath( path );
    
    if (!root.hasIn( expandedPath )) {
      throw new Error( `path ${ path } not in root ${ root }` );
    }
    
    this.value = root.getIn( expandedPath );;
    this.root = root;
    this.path = path;
  }
  
  get element(): Option<Element> {
    return Element.is( this.value ) ? some( this.value ) : none;
  }
  
  get children(): Option<I8.List<any>> {
    return map( Element.children )( this.element );
  }
  
  hasIn( path: Path ): boolean {
    return this.root.hasIn( Traverse.expandPath( path ) );
  }
  
  setPath( path: Path ): Option<Traverse> {
    return this.hasIn( path ) ? some(new Traverse( this.root, path )) : none;
  }
  
  updatePath(
    index: number,
    updater: (value: number) => number
  ): Option<Traverse> {
    return this.setPath( this.path.update( index, updater ) );
  }
  
  pushPath(
    ...values: number[]
  ): Option<Traverse> {
    return this.setPath( this.path.push( ...values ) );
  }
  
  slicePath(
    begin?: undefined | number,
    end?: undefined | number,
  ): Option<Traverse> {
    return this.setPath( this.path.slice( begin, end ) );
  }
  
  getIn( path: Path ): Option<any> {
    return this.hasIn( path )
      ? some( this.root.getIn( Traverse.expandPath( path ) ) )
      : none;
  }
  
  up( depth: number = 1 ): Option<Traverse> {
    return this.path.size < depth
      ? none
      : this.slicePath( 0, this.path.size - depth );
  }
  
  down( ...indexes: number[] ): Option<Traverse>{
    return this.pushPath( ...indexes );
  }
  
  hasPrev( nodes: number = 1 ): boolean {
    return this.hasIn( this.path.update( -1, i => 1 - nodes ) );
  }
  
  hasNext( nodes: number = 1 ): boolean {
    return this.hasIn( this.path.update( -1, i => 1 + nodes ) );
  }
  
  prev( nodes: number = 1 ): Option<Traverse>{
    return this.updatePath( -1, i => i - nodes );
  }
  
  next( nodes: number = 1 ): Option<Traverse>{
    return this.updatePath( -1, i => i + nodes );
  }
  
  get firstChild(): Option<any> {
    return this.getIn( this.path.push( 0 ) );
  }
  
  get lastChild(): Option<any> {
    if (!Element.is( this.value )) {
      return none;
    }
    
    const childrenSize = this.value.props.get( 'children' ).size;
    
    return childrenSize > 0
      ? some( this.getIn( this.path.push( childrenSize - 1 ) ) )
      : none;
  }
  
  get previousSibling(): Option<any> {
    return this.getIn( this.path.update( -1, i => i - 1 ) );
  }
  
  get nextSibling(): Option<any> {
    return this.getIn( this.path.update( -1, i => i + 1 ) );
  }
  
  get parentElement(): Option<Element> {
    return pipe(
      this.getIn( this.path.slice( 0, -1 ) ),
      mapNullable( parent => Element.is( parent ) ? parent : null ),
    );
  }
  
  get rootElement(): Element {
    return this.root;
  }
  
  get childElements(): I8.List<Element> {
    return pipe(
      this.children,
      map( children => children.filter( Element.is ) ),
      getOrElse( () => I8.List<Element>() ),
    );
  }
  
  get firstElementChild(): Option<Element> {
    return pipe(
      this.children,
      mapNullable( children => findFirstOf( Element.is, children ) ),
    );
  }
  
  get lastElementChild(): Option<Element> {
    return pipe(
      this.children,
      mapNullable( children => findLastOf( Element.is, children ) ),
    );
  }
  
  // Custom Extensions...
  
  hasPrevSibling(): boolean {
    return this.hasPrev( 1 );
  }
  
  hasNextSibling(): boolean {
    return this.hasNext( 1 );
  }
  
  get index(): Option<number> {
    return fromNullable( this.path.last() );
  }
  
  
  isFirstElement(): boolean {
    return pipe(
      this.up(),
      filterMap( up => up.children ),
      map( ch => ch.findIndex( Element.is ) === this.path.last() ),
      getOrElse( (): boolean => false ),
    );
  }
  
  
  isLastElement(): boolean {
    return pipe(
      this.up(),
      filterMap( up => up.children ),
      map( ch => ch.findLastIndex( Element.is ) === this.path.last() ),
      getOrElse( (): boolean => false ),
    );
  }
  
} // class Traverse


export default Traverse;
