import I8 from 'immutable';
import _ from 'lodash/fp';

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

