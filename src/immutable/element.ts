import _ from 'lodash/fp';
import I8 from 'immutable';

import { Props } from '../types';


export const TSXT_ELEMENT_TYPE = Symbol.for( 'tsxt.element' );

export interface ElementProps extends I8.Map<string, any> {
  get( key: 'children' ): I8.List<any>;
  get( key: string ): any;
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

export function isElement( value: any ): value is Element {
  return _.get( '$$type', value ) === TSXT_ELEMENT_TYPE;
}

export namespace Element {
  export type Children = I8.List<any>;
  
  export function is( value: any ): value is Element {
    return _.get( '$$type', value ) === TSXT_ELEMENT_TYPE;
  }
  
  export function children( element: Element ): Children {
    return  element.props.get( 'children' );
  }
  
  export function create(
    type: string,
    props: Props,
    ...children: any[]
  ): Element {
    return ElementFactory({
      type,
      props:
        I8.Map<any>( props || {} )
          .set( 'children', I8.List<any>( children ) ) as ElementProps,
    });
  }
  
  export function textContent( element: Element ): string {
    return children( element ).reduce(
      (reduction, child, _index) =>
        reduction + (is( child ) ? textContent( child ) : child.toString()),
      ''
    );
  }
} // namespace Element

