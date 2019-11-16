/* @jsx Tsxt */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';
import I8 from 'immutable';

import '../test_helpers';

import Tsxt, { Element } from '../../lib';
import '../../lib/jsx';


describe( `Test logic out - conditionals, loops, etc...` , () => {
  
  describe( `making a list and checking it twice`, () => {
    
    function getMessageElements( props?: Record<string, any> ) {
      return (
        <div>
          <p>It { props ? 'has' : 'has not' } props!</p>
          {
            props
            ? <ul>
                { _.map( ([k, v]) => <li>{ k }: { v }</li>,
                          _.toPairs( props ) ) }
              </ul>
            : null
          }
        </div>
      );
    };
    
    it( `empty message has the right element structure`, () => {
      const root = getMessageElements();
      
      expect( Element.is( root ) ).toBe( true );
      
      const children = Element.children( root );
      
      expect( children ).toBeInstanceOf( I8.List );
      
      expect( children.size ).toBe( 1 );
    });
    
    it( `non-empty message has the right element structure`, () => {
      const root =
        getMessageElements({ prefix: 'a/x', separator: '/' });
        
      expect( Element.is( root ) ).toBe( true );
      
      const children = Element.children( root );
      
      expect( children ).toBeInstanceOf( I8.List );
      
      expect( children.size ).toBe( 2 );
      
      const p = children.get( 0 );
      const ul = children.get( 1 );
      
      expect( p.type ).toEqual( 'p' );
      expect( ul.type ).toEqual( 'ul' );
      
      const lis = Element.children( ul )
      
      expect( lis.size ).toBe( 2 );
      
      const li_1 = lis.get( 0 );
      const li_2 = lis.get( 1 );
      
      expect( li_1 ).toHaveProperty( 'type', 'li' );
      expect( li_2 ).toHaveProperty( 'type', 'li' );
      
      expect( Element.textContent( li_1 ) ).toEqual( 'prefix: a/x' );
      expect( Element.textContent( li_2 ) ).toEqual( 'separator: /' );
    });
    
    function getMessage( props?: Record<string, any> ) {
      return Tsxt.md(
        <div>
          <p>It { props ? 'has' : 'has not' } props!</p>
          {
            props
            ? <ul>
                { _.map( ([k, v]) => <li>{ k }: { v }</li>,
                          _.toPairs( props ) ) }
              </ul>
            : null
          }
        </div>
      );
    };
    
    it( `maps the list when given props`, () => {
      expect( getMessage({ prefix: 'a/x', separator: '/' }) ).toEqualLines(
        `It has props!`,
        ``,
        `*   prefix: a/x`,
        `*   separator: /`,
      )
    });
    
    it( `omits the list when props are undefined`, () => {
      expect( getMessage() ).toEqualLines(
        `It has not props!`,
      );
    });
  }); // describe making a list...
  
  
  // bu yao :/
  // describe( `making a list and doing it with helpers`, () => {
    
  //   function getMessage( props?: Record<string, any> ) {
  //     return <Tsxt>
  //       <p>It { props ? 'has' : 'has not' } props!</p>
  //       { Tsxt.guard(
  //           props,
  //           _.pipe( _.toPairs,
  //                   _.map( ([k, v]) => <li>{ k }: { v }</li> ) ),
  //       ) }
  //     </Tsxt>
  //   };
    
  //   it( `maps the list when given props`, () => {
  //     expect( getMessage({ prefix: 'a/x', separator: '/' }) ).toEqual(
  //       joinLines(
  //         `It has props!`,
  //         ``,
  //         `*   prefix: a/x`,
  //         `*   separator: /`,
  //       )
  //     )
  //   });
    
  //   it( `omits the list when props are undefined`, () => {
  //     expect( getMessage() ).toEqual(
  //       joinLines(
  //         `It has not props!`,
  //       )
  //     );
  //   });
  // }); // describe making a list with help...
  
}); // describe Test logic out - conditionals, loops, etc...