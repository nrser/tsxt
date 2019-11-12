import _ from 'lodash/fp';
import I8 from 'immutable';
import print from 'print';

import { Props } from '../types';

export const TSXT_ELEMENT_TYPE = Symbol.for( 'tsxt.element' );

export interface ElementProps extends I8.Map<string, any> {
  get( key: 'children' ): I8.List<any>;
  get( key: string ): any;
  get<TNotSet>( key: string, notSetValue: TNotSet ): any | TNotSet;
}

export interface IElement {
  $$typeof: typeof TSXT_ELEMENT_TYPE;
  type: string;
  props: ElementProps;
}

export const ElementFactory =
  I8.Record<IElement>({
    $$typeof: TSXT_ELEMENT_TYPE,
    type: '',
    props: I8.Map<any>({ children: I8.List<any>() }) as ElementProps,
  }, 'Tsxt.Element' );

export type Element = ReturnType<typeof ElementFactory>;

export namespace Element {
  export type Children = I8.List<any>;
  
  export function is( value: any ): value is Element {
    return _.get( '$$typeof', value ) === TSXT_ELEMENT_TYPE;
  }
  
  export function children( element: Element ): Children {
    return element.props.get( 'children' );
  }
  
  export function create(
    type: string,
    props: Props,
    ...children: any[]
  ): Element {
    const childList = I8.List<any>( children );
    const propMap = I8.Map<string, any>( props === null ? {} : props.toJS() );
    const elementProps: ElementProps = propMap.set( 'children', childList );
    
    const element = ElementFactory({
      type,
      props: elementProps,
    });
    
    const ch = Element.children( element );
    
    if (!(ch instanceof I8.List)) {
      throw new Error( `FUCK ME\n\n${ ch }\n\n${ print( ch ) }` );
    }
    
    return element;
  }
  
  
  export function textContent( value: any ): string {
    if (is( value )) {
      try {
        return children( value ).reduce(
          (reduction, child, _index) =>
            reduction + (is( child ) ? textContent( child ) : child.toString()),
          ''
        );
        } catch (e) {
          throw new Error(
            `is Element but bad children?!?\n\n${ value.toString() }`
          );
        }
    } else {
      return value.toString();
    }
  }
  
  
  export function getType( value: any, defaultValue: string = '' ): string {
    if (is( value )) {
      return value.type;
    } else {
      return defaultValue;
    }
  }
  
  
  export function hasType( value: any, type: string ): boolean {
    let element: Element;
    
    if (is( value )) {
      element = value;
    } else {
      return false;
    }
    
    return element.type.toLowerCase() === type.toLowerCase();
  }
  
} // namespace Element

