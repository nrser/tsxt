declare namespace jest {
  interface Matchers<R>  {
    toEqualLines(...lines: string[]): R;
    toBeIterator(): R;
  }
}

declare module 'jest-extended/dist/matchers' {
  
  namespace matchers {
    function toBeString(received: any): any;
    function toBeObject(received: any): any;
  }
  
  export = matchers;
}