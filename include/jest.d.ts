declare namespace jest {
  interface Matchers<R>  {
    toEqualLines( ...lines: string[] ): R;
  }
}

declare module 'jest-extended/dist/matchers' {
  
  namespace matchers {
    function toBeString(expected: any): any;
  }
  
  export = matchers;
}