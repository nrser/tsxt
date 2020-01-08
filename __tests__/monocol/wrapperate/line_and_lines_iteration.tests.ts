import Faker from "faker";
import "jest";
import "jest-extended";
import _ from "lodash/fp";
import print from "print";

import { nth } from "../../test_helpers";

import Line from "../../../lib/monocol/line";
import { Lines } from "../../../lib/monocol/wrapperate";
import { N_0 } from "../../../lib/types";


describe(`iterate lines and line`, () => {
  // const text = Faker.lorem.paragraphs(4, "\n\n");
  
  const text =
    `Magnam expedita est quam quas eos eveniet ad. Et tenetur fuga omnis ` +
    `occaecati vero voluptatibus ipsum amet minus. Et perferendis temporibus ` +
    `est consectetur quibusdam non quos perspiciatis. Voluptas natus ` +
    `recusandae et itaque voluptatem quis dolores itaque. Repellendus ` +
    `inventore fuga ab nam rerum aut consequatur repellat. Et qui quae at et ` +
    `aut officia cupiditate eveniet.` +
    `\n\n` +
    `Vitae tenetur iusto ad culpa quasi ut labore. Quis et sint nobis sunt ` +
    `soluta velit consectetur. Accusantium eligendi qui ut a dolor dolorum ` +
    `alias architecto.` +
    `\n\n` +
    `Ex laborum non ab minima ut recusandae aliquam. Corrupti ipsa culpa ` +
    `occaecati id praesentium et quis quae. Ipsam id fugiat necessitatibus ` +
    `id eum in.` +
    `\n\n` +
    `Soluta minus et sit debitis est sint. A autem at id aut est et autem et ` +
    `non. Sapiente odit tempora reiciendis sapiente iusto. Consequuntur est ` +
    `nostrum fuga ut consequatur nostrum qui.`;
  
  const expected =
`Magnam expedita est quam quas eos eveniet ad. Et tenetur fuga omnis occaecati
vero voluptatibus ipsum amet minus. Et perferendis temporibus est consectetur
quibusdam non quos perspiciatis. Voluptas natus recusandae et itaque voluptatem
quis dolores itaque. Repellendus inventore fuga ab nam rerum aut consequatur
repellat. Et qui quae at et aut officia cupiditate eveniet.

Vitae tenetur iusto ad culpa quasi ut labore. Quis et sint nobis sunt soluta
velit consectetur. Accusantium eligendi qui ut a dolor dolorum alias architecto.

Ex laborum non ab minima ut recusandae aliquam. Corrupti ipsa culpa occaecati id
praesentium et quis quae. Ipsam id fugiat necessitatibus id eum in.

Soluta minus et sit debitis est sint. A autem at id aut est et autem et non.
Sapiente odit tempora reiciendis sapiente iusto. Consequuntur est nostrum fuga
ut consequatur nostrum qui.`;

  const expectedLines = expected.split("\n");
    
  let lines: Lines;
  
  beforeEach(() => {
    lines = new Lines(text, 80 as N_0);
  });
  
  
  it(`works when iterated depth-first`, () => {
    const strings = [] as string[];
    
    for (const line of lines) {
      let str = "";
      for (const s of line) {
        str += s;
      }
      strings.push(str);
    }
    
    // print.out(strings);
    
    expect(strings.join("\n")).toEqual(expected);
  });
  
  
  describe(`breaks when iterated any other way...`, () => {
  
    it(`always yields the same Line`, () => {
      // 'cause it could be `undefined`, see comment below...
      expect(lines.next().value).toBeInstanceOf(Line);
      expect(lines.next().value).toBe(lines.next().value);
    });
    
    it(`iterates current line regardless of which Line is iterated`, () => {
      const source = Faker.lorem.paragraphs(4, "\n\n");
      
      const nthFromLineN =
        (ls: Lines, lineNumber: number, entryNumber: number): string =>
          nth(nth(ls, lineNumber), entryNumber);
      
      const linesA = new Lines(source, 80);
      const linesB = new Lines(source, 80);
      
      const lineA1String1 = nthFromLineN(linesA, 1, 1);
      expect(lineA1String1).toBeString();
      
      const lineB2String1 = nthFromLineN(linesB, 2, 1);
      expect(lineB2String1).toBeString();
      
      expect(lineA1String1).toEqual(lineB2String1);
    });
    
    // ❗TODO   IDK how to test a function that is *expected* to timeout, so
    //          this just loops a high amount of times...
    it(`yields that same Line indefinitely`, () => {
      // How many loops we gon do
      const loops = 1000;
      
      // Which needs to be greater than the number of lines in the text for it
      // to be a valid test
      expect(loops).toBeGreaterThan(text.split("\n").length);
      
      // To make sure they're all the same, just grab the first to compare
      const firstLine = lines.next().value;
      
      for (let i = 0; i < loops; i++) {
        const nextLine = lines.next().value;
        
        // 'Cause it *could* be `undefined` per the type of the
        // [[IteratorResult]], which I (❗TODO) would like to get rid of but not
        // sure how :/
        // 
        // Anyways, just check it's actually a [[Line]].
        // 
        expect(nextLine).toBeInstanceOf(Line);
        
        // ...and they're all *identity-equal*
        expect(nextLine).toBe(firstLine);
      } // for 0...loops
    }); // it yields that same line indefinitely
    
  }); // describe breaks when iterated any other way...
}); // describe iterate lines and line
