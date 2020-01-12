import Faker from "faker";
import "jest";
import "jest-extended";
import _ from "lodash/fp";
import print from "print";

import { loadYAML } from "../../test_helpers";
import { runTestData } from "../monocol_test_helpers";

import StringParagraph from "../../../lib/monocol/string_paragraph";

const longWords = loadYAML("monocol/test_data/long_words.yaml");

describe(`[[StringLine]] class - long "words"`, () => {
  describe(`when a single "word" is longer than the column width`, () => {
    runTestData(longWords, lines => {
      // Check we're using [[StringLine]] (private, hence telling TS to fuck
      // off)
      // @ts-ignore
      expect(lines.line).toBeInstanceOf(StringParagraph);
    });
  }); // describe when a single "word" is longer than the column width
}); // describe StringLine class
