import { once } from "events";
import { finished, Writable } from "stream";
import { generate, StringIterable } from ".";
import { Optional } from "../types";


/**
 * Stream rendered strings directly to a NodeJS [[Writable]], such as
 * `process.stdout`.
 * 
 * @param stream      A NodeJS writable stream, such as `process.stdout`.
 * @param iterables   String iterables to be displayed as columns.
 * @param width       Width (in characters) to render at.
 * 
 * @return
 *  Promise that resolves when all strings have been written.
 * 
 * @throws
 *  Listens to the `error` event on the stream, throwing (well, rejecting the
 *  [[Promise]] actually) if it hears one.
 */
export async function writeToStream(
  stream: Writable,
  iterables: StringIterable[],
  width: Optional<number>,
): Promise<void> {
  // Simple thrower function to attach to `error` events while we're working
  const thrower = (err: Error) => { throw err; };
  
  try {
    stream.on("error", thrower);
    
    for (const line of generate(iterables, width)) {
      for (const str of line) {
        // If [[Writable.write]] returns `false` then we're meant to wait for 
        // a `drain` event before writing again (means the system needs time
        // to accept more data)
        if (!stream.write(str)) { await once(stream, "drain"); }
      }
      if (!stream.write("\n")) { await once(stream, "drain"); }
    }
  } finally {
    // Remove the listener 'cause we're done here
    stream.off("error", thrower);
  }
}
