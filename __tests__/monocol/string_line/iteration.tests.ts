import Faker from "faker";
import "jest";
import "jest-extended";
import _ from "lodash/fp";
import print from "print";

import { loadYAML, nth } from "../../test_helpers";

import { Paragraph } from "../../../lib/monocol/paragraph";
import { StringParagraph } from "../../../lib/monocol/string_paragraph";
import { N_0 } from "../../../lib/types";
import { renderBlock } from "../monocol_test_helpers";

const paragraphData = loadYAML("monocol/test_data/paragraphs.yaml");

describe(`iterate paragraph and line`, () => {
  let paragraph: Paragraph;
  
  beforeEach(() => {
    paragraph = new Paragraph(paragraphData.text, 80 as N_0);
  });
  
  it(`works when iterated depth-first`, () => {
    expect(renderBlock(paragraph)).toEqual(paragraphData.wrapped.col_80);
  });
  
  
  describe(`breaks when iterated any other way...`, () => {
  
    it(`always yields the same Line`, () => {
      // 'cause it could be `undefined`, see comment below...
      expect(paragraph.next().value).toBeInstanceOf(StringParagraph);
      expect(paragraph.next().value).toBe(paragraph.next().value);
    });
    
    it(`iterates current line regardless of which Line is iterated`, () => {
      const source = Faker.lorem.paragraphs(4, "\n\n");
      
      const nthFromLineN =
        (ls: Paragraph, lineNumber: number, entryNumber: number): string =>
          nth(nth(ls, lineNumber), entryNumber);
      
      const paragraphA = new Paragraph(source, 80);
      const paragraphB = new Paragraph(source, 80);
      
      const lineA1String1 = nthFromLineN(paragraphA, 1, 1);
      expect(lineA1String1).toBeString();
      
      const lineB2String1 = nthFromLineN(paragraphB, 2, 1);
      expect(lineB2String1).toBeString();
      
      expect(lineA1String1).toEqual(lineB2String1);
    });
    
    // ❗TODO   IDK how to test a function that is *expected* to timeout, so
    //          this just loops a high amount of times...
    it(`yields that same Line indefinitely`, () => {
      // How many loops we gon do
      const loops = 1000;
      
      // Which needs to be greater than the number of paragraph in the text for
      // it to be a valid test
      expect(loops).toBeGreaterThan(paragraphData.text.split("\n").length);
      
      // To make sure they're all the same, just grab the first to compare
      const firstLine = paragraph.next().value;
      
      for (let i = 0; i < loops; i++) {
        const nextLine = paragraph.next().value;
        
        // 'Cause it *could* be `undefined` per the type of the
        // [[IteratorResult]], which I (❗TODO) would like to get rid of but not
        // sure how :/
        // 
        // Anyways, just check it's actually a [[Line]].
        // 
        expect(nextLine).toBeInstanceOf(StringParagraph);
        
        // ...and they're all *identity-equal*
        expect(nextLine).toBe(firstLine);
      } // for 0...loops
    }); // it yields that same line indefinitely
    
  }); // describe breaks when iterated any other way...
}); // describe iterate paragraph and line
