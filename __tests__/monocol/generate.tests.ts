import "jest";
import "jest-extended";
import _ from "lodash/fp";

import "../test_helpers";

import { generate } from "../../lib/monocol";

describe(`generate()`, () => {

  it(`may work..?`, () => {
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
      `Once you've learned about the matchers that are available, a good` +
      `next step is to check out how Jest lets you test asynchronous code.`;
    
    // tslint:disable: max-line-length
    const expected = [
      `Wrap text using a more sophisticated    And More!                               `,
      `algorithm such as the Knuth and Plass                                           `,
      `TeX algorithm. If your language         This is just a taste. For a complete    `,
      `provides this, you get easy extra       list of matchers, check out the         `,
      `credit, but you must reference          reference docs.                         `,
      `documentation indicating that the                                               `,
      `algorithm is something better than a    Once you've learned about the matchers  `,
      `simple minimimum length algorithm.      that are available, a goodnext step is  `,
      `                                        to check out how Jest lets you test     `,
      `                                        asynchronous code.                      `,
    ].join("\n");
    // tslint:enable: max-line-length
      
    const gen = generate([s1, s2], 80);
    const out = Array.from(gen).join("");
    
    // expect(out).toEqual(expected);
  });

});
