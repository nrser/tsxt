declare namespace jest {
  // `T` has something to do with snapshots it looks like
  interface Matchers<R, T>  {
    toEqualLines(...lines: string[]): R;
    toBeIterator(): R;
    toIterate(values: any[], options?: {andBeDone?: boolean}): R;
  }
}

declare module 'jest-extended/dist/matchers' {
  
  namespace matchers {
    function toBeString(received: any): any;
    function toBeObject(received: any): any;
  }
  
  export = matchers;
}