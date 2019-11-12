import _ from 'lodash/fp';
import I8 from 'immutable';

import { Props as PropsObject } from './types';

export namespace Element {
  
  export const TYPE_OF = Symbol.for( 'tsxt.element' );
  
  export type Children = I8.List<any>;
  
  export interface Props extends I8.Map<string, any> {
    get( key: 'children' ): I8.List<any>;
    get( key: string ): any;
    get<TNotSet>( key: string, notSetValue: TNotSet ): any | TNotSet;
  }
  
  export interface Interface {
    $$typeof: typeof TYPE_OF;
    type: string;
    props: Props;
  }
  
  export const Factory =
    I8.Record<Interface>({
      $$typeof: TYPE_OF,
      type: '',
      props: I8.Map<any>({ children: I8.List<any>() }) as Props,
    }, 'Tsxt.Element' );
  
  export function is( value: any ): value is Element {
    return _.get( '$$typeof', value ) === TYPE_OF;
  }
  
  export function children( element: Element ): Children {
    return element.props.get( 'children' );
  }
  
  export function create(
    type: string,
    props: PropsObject,
    ...children: any[]
  ): Element {
    const childList = I8.List<any>(
      _.flatten( children ).filter( c => c !== null )
    );
    
    const propMap = I8.Map<any>( props === null ? {} : props );
    
    const elementProps: Props = propMap.set( 'children', childList );
    
    const element = Factory({
      type,
      props: elementProps,
    });
    
    return element;
  }  // create()
  
  
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
  } // textContent()
  
  
  export function getType( value: any, defaultValue: string = '' ): string {
    if (is( value )) {
      return value.type;
    } else {
      return defaultValue;
    }
  } // getType()
  
  
  export function hasType( value: any, type: string ): boolean {
    let element: Element;
    
    if (is( value )) {
      element = value;
    } else {
      return false;
    }
    
    return element.type.toLowerCase() === type.toLowerCase();
  } // hasType()
  
} // namespace Element


export type Element = ReturnType<typeof Element.Factory>;
