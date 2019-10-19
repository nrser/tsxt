// Getting around
// 
//    error TS7026: JSX element implicitly has type 'any' because no interface
//    'JSX.IntrinsicElements' exists.
// 
// Which happens 'cause we don't have React and it's types available.
// 
// You can check out the real-deal here, which defines like ~175 element types:
// 
// https://git.io/JeBzr
// 
// Our version just hacks the damn thing so that *any* tag type checks as `any`.
// 
declare namespace JSX {
  export interface IntrinsicElements {
    [type: string]: any; // HTMLElement; <- This didn't work...?
  }
}
