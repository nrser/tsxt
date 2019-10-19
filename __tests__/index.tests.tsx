/* @jsx TSXT */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';

import { joinLines } from './test_helpers';

import TSXT, { Attrs } from '../src/index';


describe( `most basic tests`, () => {
  it( `renders an example`, () => {
    const md = <tsxt>
      <h1>Let's Start Here</h1>
      
      <p>
        There's a few global problems I'd like to talk about today...
      </p>
      
      <ol>
        <li>Weak ollies</li>
        <li>Lighter theft</li>
      </ol>
    </tsxt>;
    
    expect( md ).toEqual(
      joinLines(
        `Let's Start Here`,
        `================`,
        ``,
        `There's a few global problems I'd like to talk about today...`,
        ``,
        `1.  Weak ollies`,
        `2.  Lighter theft`,
      )
    );
    
  });
}); // describe most basic tests


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
        
        return TSXT(
          'div',
          attrs,
          <p>{ style( `I injected this first.` ) }</p>,
          ...children,
          <p>{  style( `I injected this last.` ) }</p>,
        );
      };
    
    const md_em = <tsxt>
      <Bookend em={ true }>
        <p>Here are the actual children...</p>
        <p>...and here...</p>
        <p>...and finally here.</p>
      </Bookend>
    </tsxt>;
    
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
    
    const md_no_em = <tsxt>
      <Bookend>
        <p>Here are the actual children...</p>
        <p>...and here...</p>
        <p>...and finally here.</p>
      </Bookend>
    </tsxt>;
    
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
