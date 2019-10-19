/* @jsx createElement */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';

import { createElement } from '../src/index';

describe( `most basic tests`, () => {
  it( `renders an example`, () => {
    const render = <tsxt>
      <h1>Let's Start Here</h1>
      
      <p>
        There's a few global problems I'd like to talk about today...
      </p>
      
      <ol>
        <li>Weak ollies</li>
        <li>Lighter theft</li>
      </ol>
    </tsxt>;
    
    expect( render ).toEqual([
      `Let's Start Here`,
      `================`,
      ``,
      `There's a few global problems I'd like to talk about today...`,
      ``,
      `1.  Weak ollies`,
      `2.  Lighter theft`,
    ].join( "\n" ) );
    
  });
}); // describe most basic tests
