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


