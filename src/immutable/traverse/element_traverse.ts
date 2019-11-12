// Imports
// ===========================================================================

// ### Deps ###

import I8 from 'immutable';
import _ from 'lodash/fp';

// ### Project / Package ###

import { Element } from '../element';

import { Traverse, Path } from '.';


// Definitions
// ===========================================================================

const cache = new Map<Element, Map<string, ElementTraverse>>();

/**
 * Combines partial implementations of DOM Element and ParentNode.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ParentNode
 */
export class ElementTraverse extends Traverse {
  
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
  
  static for(
    root: Element,
    path: Path
  ): ElementTraverse {
    const pathKey = path.toJS().join();
    let pathMap = cache.get( root );
    
    if (pathMap === undefined) {
      pathMap = new Map<string, ElementTraverse>();
      cache.set( root, pathMap );
    }
    
    let traverse = pathMap.get( pathKey );
    
    if (traverse === undefined) {
      console.log( `MISS ElementTraverse ${ path }` );
      traverse = new ElementTraverse( root, path );
      pathMap.set( pathKey, traverse );
    }
    
    return traverse;
  }
  
  constructor( root: Element, path: Path ) {
    super( root, path );
    
    if (!this.isElement) {
      throw new Error( `Not an element: ${ this.value }` );
    }
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
    if (!ElementTraverse.isValidAttributeName( attributeName )) {
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
   * @return          [[ElementTraverse]] for the first matching [[Element]]
   *                  found, or `null` if didn't find shit.
   */
  querySelector( selector: string ): null | ElementTraverse {
    const nodeNames = selector.split( ',' ).map( name => name.toLowerCase() );
    
    const path =
      this.findDescendantElementPath(
        element => _.includes( element.type.toLowerCase(), nodeNames )
      );
    
    if (path === null) { return null }
    
    return ElementTraverse.for( this.root, path );
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
  get children(): ElementTraverse[] & { item: (i: number) => null | ElementTraverse } {
    const children: any = [];
    
    Element.children( this.element ).forEach(
      (child, index) => {
        if (Element.is( child )) {
          children.push(
            ElementTraverse.for( this.root, this.path.push( index ) )
          );
        }
      }
    );
    
    children.item = (index: number): null | ElementTraverse => {
      return children[ index ] || null;
    }
    
    return children as ElementTraverse[] & { item: (i: number) => null | ElementTraverse };
  } // #children
  
  
  get firstElementChild(): null | ElementTraverse {
    for (const [index, child] of Element.children( this.element ).entries()) {
      if (Element.is( child )) {
        return ElementTraverse.for( this.root, this.path.push( index ) );
      }
    }
    
    return null;
  } // #firstElementChild
  
  
  get lastElementChild(): null | ElementTraverse {
    const children = Element.children( this.element );
    
    for (let index = children.size - 1; index >= 0; index--) {
      const child = children.get( index );
      if (Element.is( child )) {
        return ElementTraverse.for( this.root, this.path.push( index  ));
      }
    }
    
    return null;
  } // #lastElementChild
  
  
} // class ElementTraverse


export default ElementTraverse;
