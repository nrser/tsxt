/* @jsx Tsxt */

import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';

import '../test_helpers';

import Tsxt from '../..';
import '../../lib/jsx';

describe( `most basic tests`, () => {
  it( `renders an example`, () => {
    const md = Tsxt.md(
      <div>
        <h1>Let's Start Here</h1>
        
        <p>
          There's a few global problems I'd like to talk about today...
        </p>
        
        <ol>
          <li>Weak ollies</li>
          <li>Lighter theft</li>
        </ol>
      </div>
    );
    
    expect( md ).toEqualLines(
        `Let's Start Here`,
        `================`,
        ``,
        `There's a few global problems I'd like to talk about today...`,
        ``,
        `1.  Weak ollies`,
        `2.  Lighter theft`,
    );
  });
}); // describe most basic tests
