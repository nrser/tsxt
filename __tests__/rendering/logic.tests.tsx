/* @jsx Tsxt */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';

import '../test_helpers';

import Tsxt from '../..';


describe( `Test logic out - conditionals, loops, etc...` , () => {
  
  describe( `making a list and checking it twice`, () => {
    
    function getMessage( props?: Record<string, any> ) {
      return <Tsxt>
        <p>It { props ? 'has' : 'has not' } props!</p>
        {
          props
          ? <ul>
              { _.map( ([k, v]) => <li>{ k }: { v }</li>,
                        _.toPairs( props ) ) }
            </ul>
          : null
        }
      </Tsxt>
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