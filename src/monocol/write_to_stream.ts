import { once } from "events";
import { finished, Writable } from "stream";
import { generate, StringIterable } from ".";
import { Optional } from "../types";


/**
 * Stream rendered strings directly to a NodeJS [[Writable]], such as
 * `process.stdout`.
 * 
 * @todo  Unclear if/how write errors will be handled.
 * 
 * @param stream      A NodeJS writable stream, such as `process.stdout`.
 * @param iterables   String iterables to be displayed as columns.
 * @param width       Width (in characters) to render at.
 * 
 * @return  Promise that resolves when all strings have been written.
 */
export async function writeToStream(
  stream: Writable,
  iterables: StringIterable[],
  width: Optional<number>,
): Promise<void> {
  for (const line of generate(iterables, width)) {
    for (const str of line) {
      if (!stream.write(str)) { await once(stream, "drain"); }
    }
    if (!stream.write("\n")) { await once(stream, "drain"); }
  }
}
