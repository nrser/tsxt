import { Element as TsxtElement } from './element';

declare global {
  namespace JSX {
    interface Element extends TsxtElement {
    }
    
    // interface ElementClass {
    //   render(): string;
    // }
    
    type _AnyProps = Record<string, any>;
    
    interface IntrinsicElements {
      
      // Markdown HTML Tag Names
      // =====================================================================
      
      // Block  (Boxes)
      // ---------------------------------------------------------------------
      
      blockquote: _AnyProps;
      h1: _AnyProps;
      h2: _AnyProps;
      h3: _AnyProps;
      h4: _AnyProps;
      h5: _AnyProps;
      h6: _AnyProps;
      hr: _AnyProps;
      li: _AnyProps;
      ol: _AnyProps;
      p: _AnyProps;
      pre: _AnyProps;
      ul: _AnyProps;
      
      // Inline (Box Contents)
      // ---------------------------------------------------------------------
      
      a: _AnyProps;
      b: _AnyProps;
      br: _AnyProps;
      code: _AnyProps;
      em: _AnyProps;
      i: _AnyProps;
      img: _AnyProps;
      strong: _AnyProps;
      
      // Other HTML Tag Names
      // =====================================================================
      
      // Not processed by markdown, but useful for no-op root elements when 
      // you want to return a single element.
      div: _AnyProps;
      
      // Catch all
      // [type: string]: any;
      
      
      // Custom Extensions
      // =====================================================================
      
      // Was considering these as more semantic versions of using `div` to no-op
      // root around multiple elements... but I right now feel like `document`
      // (my initial choice) is a particularly shitty/confusing one; introducing
      // `tsxt` as an `html` equivalent I guess seems better, but still kind-of
      // dumb because we're really just trying to do what `div` usually does.
      // 
      // document: _AnyProps
      // tsxt: _AnyProps;
      
    }
  }
}