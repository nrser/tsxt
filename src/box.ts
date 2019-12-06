// import _ from 'lodash';
// import I8 from 'immutable';


// export type Size = number;

// export namespace Size {
//   export const defaultValue: Size = 0;
  
//   export function is( value: any ): value is Size {
//     return _.isNumber( value ) && _.isFinite( value ) && value >= 0;
//   }
  
//   export function from( value: undefined | null | number ): Size {
//     return is( value ) ? value : defaultValue;
//   }
// }

// export type Fill = string;

// export namespace Fill {
//   export const defaultValue = ' ';
  
//   export function is( value: any ): value is Fill {
//     return _.isString( value ) && value.length === 1;
//   }
  
//   export function from( value: undefined | null | string ): Fill {
//     return is( value ) ? value : defaultValue;
//   }
// }


// interface Class<T, TProps extends object> {
//   new( props: TProps ): T;
//   defaultValue: T;
// }


// type FromType<T extends {from: (...args: any[]) => unknown}> =
//   Parameters<T['from']>[0];


// function makeFrom<T, TProps extends object>(
//   cls: Class<T, TProps>,
//   value: undefined | null | TProps | TProps[keyof TProps] | T,
//   fromProp?: (value: any) => undefined | TProps,
// ): T {
//   if (value instanceof cls) { return value }
  
//   if (
//     value === null ||
//     value === undefined ||
//     (_.isObject( value ) && _.isEmpty( value ))
//   ) {
//     return cls.defaultValue
//   }
  
//   if (_.isFunction(fromProp)) {
//     const props = fromProp( value );
    
//     if (props !== undefined) { return new cls( props ) }
//   }
  
//   if (_.isObject( value )) { return new cls( value ) }
  
//   return cls.defaultValue
// }


// class Side {
//   private static _defaultValue: Side | undefined = undefined;
  
//   static get defaultValue(): Side {
//     if (this._defaultValue === undefined) {
//       this._defaultValue = new Side();
//     }
//     return this._defaultValue;
//   }
  
//   static from(
//     value:  undefined |
//             null |
//             Size |
//             Fill |
//             { size?: null | Size, fill?: null | Fill } |
//             Side
//   ) {
//     return makeFrom<Side, { size?: null | Size, fill?: null | Fill }>(
//       Side, value, ( value: any) => {
//         if (Size.is( value )) { return { size: value } }
//         if (Fill.is( value )) { return { fill: value } }
//       }
//     );
//   }
  
//   // static from(
//   //   value:  undefined |
//   //           null |
//   //           number |
//   //           string |
//   //           { size?: null | Size, fill?: null | Fill } |
//   //           Side
//   // ): Side {
//   //   if (value instanceof Side) { return value }
    
//   //   if (value === null || value === undefined) { return this.defaultValue }
    
//   //   if (Size.is( value )) { return new Side({ size: value }) }
//   //   if (Fill.is( value )) { return new Side({ fill: value }) }
    
//   //   if (_.isObject( value )) {
//   //     if (_.isEmpty( value )) { return this.defaultValue }
      
//   //     return new Side( value );
//   //   }
    
//   //   return this.defaultValue;
//   // }

//   readonly size: Size;
//   readonly fill: Fill;
  
//   constructor(
//     { size, fill, }: { size?: null | Size, fill?: null| Fill, } = {}
//   ) {
//     this.size = Size.from( size );
//     this.fill = Fill.from( fill );
//   }
// }


// class Corner {
  
//   private static _defaultValue: Corner | undefined = undefined;
  
//   static get defaultValue(): Corner {
//     if (this._defaultValue === undefined) {
//       this._defaultValue = new Corner();
//     }
//     return this._defaultValue;
//   }
  
//   static from(
//     value: undefined | null | Fill | {fill?: null | Fill} | Corner
//   ): Corner {
//     return makeFrom<Corner, {fill?: null | Fill}>(
//       Corner, value, (value: any) =>
//         Fill.is( value ) ? { fill: value } : undefined,
//     )
//   }
  
//   // static from( value: undefined | null | Fill | {fill?: null | Fill} | Corner ): Corner {
//   //   if (value instanceof Corner) { return value }
    
//   //   if (value === null || value === undefined) { return this.defaultValue }
    
//   //   if (Fill.is( value )) { return new Corner({ fill: value }) }
    
//   //   if (_.isObject( value )) {
//   //     if (_.isEmpty( value )) { return this.defaultValue }
      
//   //     return new Corner( value );
//   //   }
    
//   //   return this.defaultValue;
//   // }
  
//   readonly fill: Fill;
  
//   constructor({
//     fill,
//   }: {
//     fill?: null | Fill,
//   } =  {}) {
//     this.fill = Fill.from( fill );
//   }
  
// } // class Corner


// class Outline {
  
//   private static _default: Outline | undefined = undefined;
  
//   static get default(): Outline {
//     if (this._default === undefined) {
//       this._default = new Outline();
//     }
//     return this._default;
//   }
  
//   static from(
//     value:  null |
//             undefined |
//             { topLeft: FromType<typeof Corner>,
//               topRight: FromType<typeof Corner>,
//               bottomRight: FromType<typeof Corner>,
//               bottomLeft: FromType<typeof Corner>,
//               top: FromType<typeof Side>,
//               right: FromType<typeof Side>,
//               bottom: FromType<typeof Side>,
//               left: FromType<typeof Side>, } |
//             Outline
//   ): Outline {
//     return makeFrom<Outline, 
//   }
  
//   readonly topLeft: Corner;
//   readonly top: Side;
//   readonly topRight: Corner;
//   readonly right: Side;
//   readonly bottomRight: Corner;
//   readonly bottom: Side;
//   readonly bottomLeft: Corner;
//   readonly left: Side;
  
//   constructor({
//     topLeft, top, topRight, right, bottomRight, bottom,  bottomLeft, left,
//   }: {
//     topLeft?: null | Corner,
//     top?: null | Side,
//     topRight?: null | Corner,
//     right?: null | Side,
//     bottomRight?: null | Corner,
//     bottom?: null | Side,
//     bottomLeft?: null | Corner,
//     left?: null | Side,
//   } = {}) {
//     this.topLeft      = Corner.from( topLeft );
//     this.topRight     = Corner.from( topRight );
//     this.bottomRight  = Corner.from( bottomRight );
//     this.bottomLeft   = Corner.from( bottomLeft );
//     this.top          = Side.from( top );
//     this.right        = Side.from( right );
//     this.bottom       = Side.from( bottom );
//     this.left         = Side.from( left );
//   }
// } // class Outline


// class Box {
//   readonly margin: Outline;
//   readonly border: Outline;
//   readonly padding: Outline;
//   readonly width: null | Size;
//   readonly height: null | Size;
//   readonly contents: any;
  
//   constructor({
//     margin = Outline.default,
//     border = Outline.default,
//     padding = Outline.default,
//     width = null,
//     height = null,
//     contents = null,
//   }: {
//     margin?: Outline,
//     border?: Outline,
//     padding?: Outline,
//     width?: null | Size,
//     height?: null | Size,
//     contents?: any,
//   } = {}) {
//     this.margin = margin;
//     this.border = border;
//     this.padding = padding;
//     this.width = width;
//     this.height = height;
//   }
// }


// // class Columns extends Box {
// //   contents: Box[];
  
// // }

