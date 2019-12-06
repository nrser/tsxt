/* @jsx Tsxt */

import "jest";
import "jest-extended";
import _ from "lodash/fp";

import Tsxt from "../lib";
import Map from "../lib/map";
import "./test_helpers";

describe(`Map helper`, () => {
  it(`works..?`, () => {
    const obj = {
      x: "ex",
      y: "why?",
      z: "zee! zee! zee!",
    };

    const md = Tsxt.md(
      <div>
        <p>Here's my list:</p>

        <ol>
          <Map object={obj}>
            <li>{(k: any, v: any) => `${k} => ${v}`}</li>
          </Map>
        </ol>
      </div>,
    );

    expect(md).toEqualLines(
      `Here's my list:`,
      ``,
      `1.  x => ex`,
      `2.  y => why?`,
      `3.  z => zee! zee! zee!`,
    );

  });
});
