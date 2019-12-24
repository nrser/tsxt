/**
 * Type declarations for [print][] package.
 * 
 * [print]: https://www.npmjs.com/package/print
 * 
 * Used [@types/wordwrap][] as a reference to get the "exports a function with
 * added properties" right, which I did not find intuitive.
 * 
 * [@types/wordwrap]: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/wordwrap/index.d.ts
 */

declare module 'print' {
  
  function print(x: any): string;
  
  namespace print {
    export function out(x: any): void;
  }
  
  export = print;
}
