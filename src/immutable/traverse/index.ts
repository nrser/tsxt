// Imports
// ===========================================================================

// ### Deps ###

import I8 from 'immutable';
import _ from 'lodash/fp';
import print from 'print';

// ### Project / Package ###

import { Element } from '../element';


// Definitions
// ===========================================================================

export type Path = I8.List<number>;
export type ExpandedPath = ('props' | 'children' | number)[];


const cache = new Map<Element, Map<string, Traverse>>();

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
      if (index !== undefined) { yield index };
    }
  }
  
  static expandPath( path: Path ): ExpandedPath {
    return Array.from( this.expandPathItr( path ) );
  }
  
  static for(
    root: Element,
    path: Path
  ): Traverse {
    const pathKey = path.toJS().join();
    let pathMap = cache.get( root );
    
    if (pathMap === undefined) {
      pathMap = new Map<string, Traverse>();
      cache.set( root, pathMap );
    }
    
    let traverse = pathMap.get( pathKey );
    
    if (traverse === undefined) {
      traverse = new Traverse( root, path );
      pathMap.set( pathKey, traverse );
    }
    
    return traverse;
  }
  
  protected _root: Element;
  protected _path: Path;
  protected _value: any;
  protected _isElement: boolean;
  
  constructor(
    root: Element,
    path: Path,
  ) {
    const expandedPath = Traverse.expandPath( path );
    
    if (!root.hasIn( expandedPath )) {
      throw new Error( `path ${ path } not in root ${ root }` );
    }
    
    this._value = root.getIn( expandedPath );;
    this._root = root;
    this._path = path;
    this._isElement = Element.is( this._value );
  }
  
  // Instance Methods
  // =========================================================================
  
  get root(): Element { return this._root }
  get path(): Path { return this._path }
  get value(): any { return this._value }
  get isElement(): boolean { return this._isElement }
  
  // immutable.js-like Instance Methods
  // ---------------------------------------------------------------------------
  // 
  // Methods for working with the traverse like an immutable.js object using 
  // methods on the underlying immutable instance properties.
  // 
  // **Not** part of the partial DOM-emulation.
  // 
  
  hasIn( path: Path ): boolean {
    return this.root.hasIn( Traverse.expandPath( path ) );
  }
  
  setPath( path: Path ): null | Traverse {
    return this.hasIn( path ) ? Traverse.for( this.root, path ) : null;
  }
  
  updatePath(
    index: number,
    updater: (value: number) => number
  ): null | Traverse {
    return this.setPath( this.path.update( index, updater ) );
  }
  
  pushPath(
    ...values: number[]
  ): null | Traverse {
    return this.setPath( this.path.push( ...values ) );
  }
  
  slicePath(
    begin?: undefined | number,
    end?: undefined | number,
  ): null | Traverse {
    return this.setPath( this.path.slice( begin, end ) );
  }
  
  getIn( path: Path ): any {
    return this.root.getIn( Traverse.expandPath( path ) );
  }
  
  up( depth: number = 1 ): null | Traverse {
    return this.path.size < depth
      ? null
      : this.slicePath( 0, this.path.size - depth );
  }
  
  down( ...indexes: number[] ): null | Traverse {
    return this.pushPath( ...indexes );
  }
  
  hasPrev( nodes: number = 1 ): boolean {
    return this.hasIn( this.path.update( -1, i => 1 - nodes ) );
  }
  
  hasNext( nodes: number = 1 ): boolean {
    return this.hasIn( this.path.update( -1, i => 1 + nodes ) );
  }
  
  prev( nodes: number = 1 ): null | Traverse {
    return this.updatePath( -1, i => i - nodes );
  }
  
  next( nodes: number = 1 ): null | Traverse {
    return this.updatePath( -1, i => i + nodes );
  }
  
  // Partial DOM Node Emulation
  // ---------------------------------------------------------------------------
  // 
  // https://developer.mozilla.org/en-US/docs/Web/API/Node
  // 
  
  // ### DOM Node API Properties (Getters) ###
  
  get childNodes(): Traverse[] {
    if (!this.isElement) {
      return [];
    }
    
    return (this.value as Element).props.get( 'children' )
      .map( (child, index) => {
        const traverse = this.pushPath( index );
        if (traverse === null) {
          throw new Error( `Unable to traverse to child` );
        }
        return traverse;
      })
      .toArray();
  }
  
  get firstChild(): null | Traverse {
    if (!this.isElement) { return null }
    
    return this.pushPath( 0 );
  }
  
  get lastChild(): null | Traverse {
    if (!this.isElement) { return null }
    
    const childrenSize = (this.value as Element).props.get( 'children' ).size;
    
    return childrenSize > 0
      ? this.pushPath( childrenSize - 1 )
      : null;
  }
  
  get nextSibling(): null | Traverse {
    return this.updatePath( -1, i => i + 1 );
  }
  
  get nodeName(): string {
    if (this.isElement) {
      return (this.value as Element).type.toUpperCase();
    }
    return '#text';
  }
  
  /**
   * DOM node type integer.
   * 
   * @todo This is probably not completely right or complete.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
   */
  get nodeType(): number {
    return this.isElement ? 1 : 3;
  }
  
  get nodeValue(): null | string {
    return this.isElement
      ? null
      : this.value.toString();
  }
  
  get parentNode(): null | Traverse {
    return this.up();
  }
  
  get parentElement(): null | Traverse {
    const up = this.up();
    
    if (up !== null && up.isElement) { return up }
    
    return null;
  }
  
  get previousSibling(): null | Traverse {
    return this.updatePath( -1, i => i - 1 );
  }
  
  get textContent(): null | string {
    if (this.isElement) {
      return Element.textContent( this.value as Element );
    }
    return this.nodeValue;
  }
  
  
  // ### DOM Node API Method ###
  
  /**
   * This is **fake**! Just returns `this` to satisfy Turndown.
   * 
   * @param deep  Ignored.
   * @return      `this`.
   */
  cloneNode( deep?: boolean ): Traverse {
    return this;
  }
  
  
  // ### DOM Text API ###
  
  get data(): string {
    if (this.isElement) {
      throw new Error( `Can't get data from Element` );
    }
    
    return this.value.toString();
  }
  
  set data( value: string ) {
    if (value === this.value) {
      return;
    }
    
    console.log( `SETTING data to ${ value } on ${ this.nodeName } ${ this.value.toString() }` );    
    
    if (this.isElement) {
      throw new Error( `Can't set data on an Element` );
    }
    
    const expandedPath =  Traverse.expandPath( this.path );
    
    this._root = this._root.setIn( expandedPath, value );
    
    this._value = this._root.getIn( expandedPath );
    
    if (this._value !== value) {
      throw new Error( `FUCK NUTS\n\n${ this._value }\n\n${ value }`)
    }
  } // #data=
  
  toString(): string {
    return (
`${ this.constructor.name }<${ this.nodeName }>

path: ${ this.path }

expandedPath: ${ print( Traverse.expandPath( this.path )  ) }

isElement: ${ this.isElement }

value: ${ this.value }

`
    );
  } // #toString()
  
  
  // From TraverseElement
  // =========================================================================
  // 
  // Because it made the fucking caching simpler since `===` needs to work D:
  // 
  
  static isValidAttributeName( attributeName: string ): boolean {
    return attributeName !== 'children';
  }
  
  static transformAttributeName( attributeName: string ): string {
    switch (attributeName) {
      case 'class':
        return 'className';
    }
    
    return attributeName;
  }
  
  
  get element(): Element {
    const value = this.value;
    
    if (!Element.is( value )) {
      throw new Error( `Not an element: ${ value }` );
    }
    
    return value;
  }
  
  /**
   * Utility method used to implement [[querySelector]]; does a depth-first 
   * search for a `predicate`, returning the [[Path]] it's found at.
   * 
   * @param predicate   When this rings true we're done looking.
   * 
   * @param path        The current [[Path]] we're searching from. Defaults to 
   *                    [[path]] to start, then used internally to descend. I
   *                    can't think of any reason you would want to provide a
   *                    value yourself.
   * 
   * @param element     The [[Element]] at the `path`. Defaults to [[element]].
   *                    If you were for some reason to provide an Element that
   *                    was *not* at `path` from [[root]] then all hell would
   *                    likely break loose.
   * 
   * @return            The [[Path]] from [[root]] to the first match, or `null`
   *                    if there is not one.
   */
  protected findDescendantElementPath(
    predicate: (element: Element) => boolean,
    path: Path = this.path,
    element: Element = this.element,
  ): null | Path {
    const children = Element.children( element );
    
    for (let index = 0; index < children.size; index++) {
      const child = children.get( index );
      
      if (Element.is( child )) {
        const childPath = path.push( index );
        
        if (predicate( child )) {
          return childPath;
        }
        
        const childResult =
          this.findDescendantElementPath( predicate, childPath, child );
        
        if (childResult !== null) {
          return childResult;
        }
      }
    }
    
    return null;
  } // #findDescendantElementPath()
  
  
  // Partial DOM Element API
  // =========================================================================
  // 
  // https://developer.mozilla.org/en-US/docs/Web/API/Element
  // 
  
  get className(): string {
    if (this.element.props.has( 'className' )) {
      return this.element.props.get( 'className' ).toString();
    }
    return '';
  }
  
  getAttribute( attributeName: string ): null | string {
    if (!this.hasAttribute( attributeName )) {
      return null;
    }
    
    return this.element.props.get( attributeName ).toString();
  }
  
  hasAttribute( attributeName: string ): boolean {
    if (!Traverse.isValidAttributeName( attributeName )) {
      return false;
    }
    
    return this.element.props.has( attributeName );
  }
  
  /**
   * Half-ass implementation of querySelector intended to work for the one way
   * that Turndown uses the method: figuring out an any of an element's
   * descendants are from a list of node names.
   * 
   * The MDN docs do *not* specify how the search is performed, or if it's even
   * performed the same way in all cases. Our search is depth-first, which I
   * think is reasonable since it should correspond to the first element
   * scrolling down when the nodes are written as source.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
   * 
   * @param selector  Must be a comma-separated list of node names, like 
   *                  `"a,p,br,meta"`.
   * 
   * @return          [[Traverse]] for the first matching [[Element]]
   *                  found, or `null` if didn't find shit.
   */
  querySelector( selector: string ): null | Traverse {
    const nodeNames = selector.split( ',' ).map( name => name.toLowerCase() );
    
    const path =
      this.findDescendantElementPath(
        element => _.includes( element.type.toLowerCase(), nodeNames )
      );
    
    if (path === null) { return null }
    
    return Traverse.for( this.root, path );
  } // #querySelector()
  
  
  // Partial DOM ParentNode API
  // =========================================================================
  // 
  // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode
  // 
  
  /**
   * @note 
   *  The DOM method returns an `HTMLCollection` (of elements), which is *not*
   *  an Array, because that would be too language-specific. No, it uses a
   *  different `#item( index )` API to get entries.
   *  
   *  Which sure *seems* to - you guessed it! - make things a whole lot worse,
   *  because JS built-ins like `Array.prototype.indexOf` appear to take special
   *  account of those weird `HTMLCollection` and other DOM spec-satisfying
   *  array-likes with no clear guidance on implementing your *own* object
   *  conforming to the DOM spec that will produce the same results when fed 
   *  into the aforementioned built-ins, as users are conditioned to do.
   *  
   *  So, we just support the array-likeness by returning a fucking Array,
   *  and tacking a `#item()` method on.
   */
  get children(): Traverse[] & { item: (i: number) => null | Traverse } {
    const children: any = [];
    
    Element.children( this.element ).forEach(
      (child, index) => {
        if (Element.is( child )) {
          children.push(
            Traverse.for( this.root, this.path.push( index ) )
          );
        }
      }
    );
    
    children.item = (index: number): null | Traverse => {
      return children[ index ] || null;
    }
    
    return children as Traverse[] & { item: (i: number) => null | Traverse };
  } // #children
  
  
  get firstElementChild(): null | Traverse {
    for (const [index, child] of Element.children( this.element ).entries()) {
      if (Element.is( child )) {
        return Traverse.for( this.root, this.path.push( index ) );
      }
    }
    
    return null;
  } // #firstElementChild
  
  
  get lastElementChild(): null | Traverse {
    const children = Element.children( this.element );
    
    for (let index = children.size - 1; index >= 0; index--) {
      const child = children.get( index );
      if (Element.is( child )) {
        return Traverse.for( this.root, this.path.push( index  ));
      }
    }
    
    return null;
  } // #lastElementChild
  
} // class Traverse


export default Traverse;
