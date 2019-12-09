import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import { render } from "../../lib/monocol";

describe(`render()`, () => {

  it(`renders two string columns side-by-side`, () => {
    const s1 =
      `Wrap text using a more sophisticated algorithm such as the Knuth ` +
      `and Plass TeX algorithm. If your language provides this, you get ` +
      `easy extra credit, but you must reference documentation ` +
      `indicating that the algorithm is something better than a simple ` +
      `minimimum length algorithm.`;
      
    const s2 =
      `And More!\n\n` +
      `This is just a taste. For a complete list of matchers, check out the ` +
      `reference docs.\n\n` +
      `Once you've learned about the matchers that are available, a good ` +
      `next step is to check out how Jest lets you test asynchronous code.`;
    
    // tslint:disable: max-line-length
    const expected = (
      `Wrap text using a more sophisticated    And More!                               \n` +
      `algorithm such as the Knuth and Plass                                           \n` +
      `TeX algorithm. If your language         This is just a taste. For a complete    \n` +
      `provides this, you get easy extra       list of matchers, check out the         \n` +
      `credit, but you must reference          reference docs.                         \n` +
      `documentation indicating that the                                               \n` +
      `algorithm is something better than a    Once you've learned about the matchers  \n` +
      `simple minimimum length algorithm.      that are available, a good next step is \n` +
      `                                        to check out how Jest lets you test     \n` +
      `                                        asynchronous code.                      \n`
    );
    
    const out = render([s1, s2], 80);
    
    // console.log(out);
    
    expect(out).toEqual(expected);
  });

});
