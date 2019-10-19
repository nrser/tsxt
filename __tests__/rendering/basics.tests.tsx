/* @jsx Tsxt */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';

import { joinLines } from '../test_helpers';

import Tsxt, { Attrs } from '../..';


describe( `most basic tests`, () => {
  it( `renders an example`, () => {
    const md = <Tsxt>
      <h1>Let's Start Here</h1>
      
      <p>
        There's a few global problems I'd like to talk about today...
      </p>
      
      <ol>
        <li>Weak ollies</li>
        <li>Lighter theft</li>
      </ol>
    </Tsxt>;
    
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
