/* @jsx Tsxt */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';

import { joinLines } from '../test_helpers';

import Tsxt, { Attrs } from '../../src/index';


describe( `Test logic out - conditionals, loops, etc...` , () => {
  
  describe( `making a list and checking it twice`, () => {
    const props = { prefix: 'a/x', separator: '/' };
    
    function getMessage( props?: Record<string, any> ) {
      return <Tsxt>
        <p>It { props ? 'has' : 'has not' } props!</p>
        {
          props
          ? <ul>
              {
                _.map(
                  ([k, v]) => <li>{ k }: { v }</li>,
                  _.toPairs( props )
                )
              }
            </ul>
          : null
        }
      </Tsxt>
    };
    
    it( `maps the list when given props`, () => {
      expect( getMessage({ prefix: 'a/x', separator: '/' }) ).toEqual(
        joinLines(
          `It has props!`,
          ``,
          `*   prefix: a/x`,
          `*   separator: /`,
        )
      )
    });
    
    it( `omits the list when props are undefined`, () => {
      expect( getMessage() ).toEqual(
        joinLines(
          `It has not props!`,
        )
      );
    });
  }); // describe making a list...
  
}); // describe Test logic out - conditionals, loops, etc...