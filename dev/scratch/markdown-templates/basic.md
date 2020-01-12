Let's Start Here
==============================================================================

The idea is that since Markdown allows arbitrary HTML/XML in it, that could be
used to do templating. This would let you write markdown directly most the time,
then insert XML to interpolate.

This seems like it would be nicer - if it worked out - because authoring in TSX
does kinda suck.

Syntax Ideas
------------------------------------------------------------------------------

### Syntax 1 - Separate Control Nodes

This is kinda what I tend towards - which is why it's first - since I feel like 
it:

1.  Most closely mirrors popular template languages
2.  Seems easiest to implement in TSX, should that make sense.

<ol>
  <For list="items" as="item">
    <li><Render value="item"></li>
  </For>
</ol>

The downside is that the few XML-based template languages I could find quickly -
Angular, Genshi - all seem to use attribute-based control instructions.

It's quite possible that those folks know what they're doing, and that using 
separate nodes will bite me in the ass at some point.

### Syntax 2 - Attribute Controls

<ol>
  <li for="item of items" content="item" />
</ol>


What Could Go Wrong?
------------------------------------------------------------------------------

A lot of things!

### Whitespace

The big shitty in all this is that Markdown (or any monospace format for
terminal display) is *whitespace-sensitive*, and whitespace-sensitive syntax
just *sucks* with string-interpolation templating languages because it's a huge
pain to get indentation right with loops, includes, etc. Possible, but a massive
pain.

Recent examples are templating YAML in Helm. Ugh.

So... what exactly would break/suck?

1.  Markdown tables won't work with interpolated data, at least not while 
    sticking to the docs being legit Markdown. Can't put HTML in tables, I'm
    pretty damn sure.
    
    Which means they would need to written in HTML, but that's where we are 
    right now with the TSX-based approach, so can't say we lost much?
    

### Parsing - Markdown to DOM to Markdown

Now there would be source in Markdown that needs to get parsed into the 
DOM structure, then have the interpolations run, then likely rendered *back*
to Markdown for display, since Markdown in the terminal is almost certainly 
going to be the most common target.

This seems kinda dumb... but maybe not.

The Markdown templating format is then really just a convenient way to author
the DOM structure, which actually is exactly what it's some-what supposed to
be. So it's really just an authoring alternative that can be layered in top,
sine everything is going through the DOM representation either way.

That's cool.

It means that the Markdown *you* write is *not* the Markdown that gets rendered,
but that's actually kinda nice too - what gets rendered is a standardized 
version of it.
