import I8 from 'immutable';
import _ from 'lodash/fp';
import { Option, Some, isNone, isSome } from 'fp-ts/lib/Option';

export interface TemplateLiteralTag<TExpression=any> {
  (strings: TemplateStringsArray, ...expressions: TExpression[] ): string;
}

export interface SimpleTag<TExpression=any>
  extends TemplateLiteralTag<TExpression>
{
  transformExpression: (expression: TExpression) => string;
}

export function createSimpleTag<TExpression=any>(
  transformExpression: (expression: TExpression) => string,
  name?: string,
): SimpleTag<TExpression> {
  const tag =
    ( strings: TemplateStringsArray, ...exps: any[] ): string => {
      let render = strings[ 0 ]; 
    
      for( let i = 0; i < exps.length; i++ ) {
        render += transformExpression( exps[ i ] ) + strings[ i + 1 ];
      }
      
      return render;
    };
  
  tag.transformExpression =  transformExpression;
  
  if (name) {
    Object.defineProperty( tag, 'name', { value: name.toString(), 
                                          writable: false } );
  }
    
  return tag as SimpleTag<TExpression>;
} // createSimpleTag()


export function codeFormat( value: any ): string {
  if (_.isNull( value )) { return '`null`' }
  if (_.isUndefined( value )) { return '`undefined`' }
  
  return `\`${ value }\``;
}


export const Q = createSimpleTag( codeFormat );


export function findFirstOf<TKey, TValue, TOf extends TValue>(
  is: (v: any) => v is TOf,
  collection: I8.Collection<TKey, TValue>,
): TOf | undefined {
  const found = collection.find( is );
  
  if (found !== undefined) {
    return found as TOf;
  }
}


export function findLastOf<TKey, TValue, TOf extends TValue>(
  is: (v: any) => v is TOf,
  collection: I8.Collection<TKey, TValue>,
): TOf | undefined {
  const found = collection.findLast( is );
  
  if (found !== undefined) {
    return found as TOf;
  }
}


export function getOrThrow<T>( message: string ): (option: Option<T>) => T {
  return (option: Option<T>) => {
    if (isNone( option )) { throw new Error( message ) }
    
    return option.value;
  }
}


/**
 * Guard for `Option<T>` using a provided guard for `T`.
 * 
 * Note that `none` will always be identified as `Option<T>` since `none` is 
 * universal across all types.
 * 
 * @param value What might be a `Option<T>`.
 * @param is Guard for `T`.
 */
export function isOption<T>(
  value: any,
  is: (value: any) => value is T,
): value is Option<T> {
  if (!_.isObject( value ) || !_.has( '_tag', value )) { return false }
  
  const option = value as Option<T>;
  
  return isNone( option ) || (isSome( option ) && is( option.value ));
}


/**
 * Guard for `Some<T>` using a provided guard for `T`.
 * 
 * @param value What might be a `Some<T>`.
 * @param is Guard for `T`.
 */
export function isSomeOf<T>(
  value: any,
  is: (value: any) => value is T,
): value is Some<T> {
  if (!_.isObject( value ) || !_.has( '_tag', value )) { return false }
  
  const option = value as Option<T>;
  
  return isSome( option ) && is( option.value );
}

