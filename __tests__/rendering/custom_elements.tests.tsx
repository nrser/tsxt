/* @jsx Tsxt */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';

import { joinLines } from '../test_helpers';

import Tsxt, { Attrs } from '../../src/index';


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
      (attrs: Attrs, ...children: Node[] ): Node => {
        const style = ( text: string ) => {
          let node = text;
          
          if (_.get( 'em', attrs)) { node = <em>{ node }</em> }
          
          return node;
        }
        
        return Tsxt(
          'div',
          attrs,
          <p>{ style( `I injected this first.` ) }</p>,
          ...children,
          <p>{  style( `I injected this last.` ) }</p>,
        );
      };
    
    const md_em = <Tsxt>
      <Bookend em={ true }>
        <p>Here are the actual children...</p>
        <p>...and here...</p>
        <p>...and finally here.</p>
      </Bookend>
    </Tsxt>;
    
    expect( md_em ).toEqual(
      joinLines(
        `_I injected this first._`,
        ``,
        `Here are the actual children...`,
        ``,
        `...and here...`,
        ``,
        `...and finally here.`,
        ``,
        `_I injected this last._`,
      )
    );
    
    const md_no_em = <Tsxt>
      <Bookend>
        <p>Here are the actual children...</p>
        <p>...and here...</p>
        <p>...and finally here.</p>
      </Bookend>
    </Tsxt>;
    
    expect( md_no_em ).toEqual(
      joinLines(
        `I injected this first.`,
        ``,
        `Here are the actual children...`,
        ``,
        `...and here...`,
        ``,
        `...and finally here.`,
        ``,
        `I injected this last.`,
      )
    );
  });
}); // describe Custom elements
