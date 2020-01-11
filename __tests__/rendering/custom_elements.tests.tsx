/* @jsx Tsxt */

import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import Tsxt, { Element } from "../..";
// import '../../lib/jsx';
import { Props } from "../../lib/types";


describe( `Custom elements`, () => {
  it( `constructs and renders 'em`, () => {
    
    /**
     * Trivial custom "element" that adds static a paragraph before and after
     * it's contents.
     * 
     * @param attrs 
     * @param children 
     */
    const Bookend =
      (attrs: Props, ...children: any[] ): Element => {
        const style = ( text: string ) => {
          if (_.get( "em", attrs )) {
            return <em>{ text }</em>;
          } else {
            return text;
          }
        };
        
        return Element.create(
          "div",
          attrs,
          <p>{ style( `I injected this first.` ) }</p>,
          ...children,
          <p>{ style( `I injected this last.` ) }</p>,
        );
      };
    
    const md_em = Tsxt.md(
      <Bookend em={ true }>
        <p>Here are the actual children...</p>
        <p>...and here...</p>
        <p>...and finally here.</p>
      </Bookend>,
    );
    
    expect( md_em ).toEqualLines(
      `_I injected this first._`,
      ``,
      `Here are the actual children...`,
      ``,
      `...and here...`,
      ``,
      `...and finally here.`,
      ``,
      `_I injected this last._`,
    );
    
    const md_no_em = Tsxt.md(
      <Bookend>
        <p>Here are the actual children...</p>
        <p>...and here...</p>
        <p>...and finally here.</p>
      </Bookend>,
    );
    
    expect( md_no_em ).toEqualLines(
      `I injected this first.`,
      ``,
      `Here are the actual children...`,
      ``,
      `...and here...`,
      ``,
      `...and finally here.`,
      ``,
      `I injected this last.`,
    );
  });
}); // describe Custom elements
