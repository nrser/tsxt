import { createWriteStream, promises as FS } from "fs";
import "jest";
import "jest-extended";
import _ from "lodash/fp";
import { finished as origFinished } from "stream";
import Tmp from "tmp";
import { promisify } from "util";

import "../test_helpers";

import { writeToStream } from "../../lib/monocol/write_to_stream";


const tmpFile   = promisify(Tmp.file);
const finished  = promisify(origFinished);

const s1 =
  `Wrap text using a more sophisticated algorithm such as the Knuth ` +
  `and Plass TeX algorithm. If your language provides this, you get ` +
  `easy extra credit, but you must reference documentation ` +
  `indicating that the algorithm is something better than a simple ` +
  `minimum length algorithm.`;

const s2 =
  `And More!\n\n` +
  `This is just a taste. For a complete list of matchers, check out ` +
  `the reference docs.\n\n` +
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
  `simple minimum length algorithm.        that are available, a good next step is \n` +
  `                                        to check out how Jest lets you test     \n` +
  `                                        asynchronous code.                      \n`
);
// tslint:enable: max-line-length

describe(`writeToStream()`, () => {

  describe(`to a tmp file`, () => {
    it(`renders two string columns side-by-side`, async () => {
      const path = await tmpFile();
      const stream = createWriteStream(path, {flags: "w"});
      await writeToStream(stream, [s1, s2], 80);
      stream.end();
      await finished(stream);
      
      const file = await FS.open(path, "r");
      const read = (await FS.readFile(file)).toString();
      
      expect(read).toEqual(expected);
    });
    
    it(`raises an error when given an ended stream`, async () => {
      const path = await tmpFile();
      const stream = createWriteStream(path, {flags: "w"});
      stream.end();
      await finished(stream);
      
      // https://stackoverflow.com/a/47887098/1658272
      await expect(writeToStream(stream, [s1, s2], 80))
        .rejects.toThrow("write after end");
    });
    
  }); // describe to a tmp file
  
});
