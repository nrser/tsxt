import Faker from "faker";
import "jest";
import "jest-extended";
import _ from "lodash/fp";
import print from "print";

import { loadYAML } from "../test_helpers";
import { renderBlock } from "./monocol_test_helpers";

import { intersperse, pFor } from "../../lib/helpers";
import Column from "../../lib/monocol/column";
import Fill from "../../lib/monocol/fill";
import Paragraph from "../../lib/monocol/paragraph";
import { Block } from "../../lib/monocol/types";
import { N_0 } from "../../lib/types";

const p = pFor(__filename);

const paragraphData = loadYAML("monocol/test_data/paragraphs.yaml");

describe(`class [[Column]]`, () => {
  
  describe(`paragraphs with a blank line in-between`, () => {
    const width = 74 as N_0;
    
    const strings = paragraphData.split.wrap_at_74 as string[];
    
    const paragraphs = strings.map(s => new Paragraph(s, width)) as Block[];
    const makeBlankLine = () => new Fill("", 0, 1);
    
    describe(`blank line [[Fill]]`, () => {
      const line = makeBlankLine();
      it(`Has the right width`, () => { expect(line.width).toBe(0); });
      it(`Has the right height`, () => { expect(line.height).toBe(1); });
    });
    
    const blocks = intersperse<Block>(makeBlankLine, paragraphs);
      
    const column = new Column(blocks);
    
    it(`has a blank line [[Fill]] between each [[Paragraph]]`, () => {
      blocks.forEach( (block, index) => {
        if (index % 2 === 0) {
          expect(block).toBeInstanceOf(Paragraph);
        } else {
          expect(block).toBeInstanceOf(Fill);
        }
      });
    });
    
    it(`renders correctly`, () => {
      expect(renderBlock(column)).toEqual(paragraphData.text.wrap_at_74);
    });
  }); // describe paragraphs with a blank line in-between
  
}); // class [[Column]]
