import { Element as TsxtElement } from './element';

declare global {
  namespace JSX {
    interface Element extends TsxtElement {
    }
    
    // interface ElementClass {
    //   render(): string;
    // }
    
    interface IntrinsicElements {
      p: {
        x?: number;
      };
      
      [type: string]: any;
    }
  }
}