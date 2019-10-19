TSXT - Structured Documents In TSX
==============================================================================

Construct, compose and render structured documents in-source using [TSX][]
([JSX][] for TypeScript).

Basically

    React : HTML as TSXT : Text

If you really like how [JSX][] and [React][] let you structure your HTML in 
code then maybe check it out.

[TSX]:    https://www.typescriptlang.org/docs/handbook/jsx.html
[JSX]:    https://facebook.github.io/jsx/
[React]:  https://reactjs.org/

------------------------------------------------------------------------------
License
------------------------------------------------------------------------------

BSD

------------------------------------------------------------------------------
What The Hell?
------------------------------------------------------------------------------

```TSX
/* @jsx TSXT */

import TSXT from 'tsxt';

let markdown = <tsxt>
  <h1>Let's Start Here</h1>
  
  <p>
    There's a few global problems I'd like to talk about today...
  </p>
  
  <ol>
    <li>Weak ollies</li>
    <li>Lighter theft</li>
  </ol>
</tsxt>;
```

The `markdown` variable will contain the rendered [Markdown][] string

```Markdown
Let's Start Here
================

There's a few global problems I'd like to talk about today...

1.  Weak ollies
2.  Lighter theft
```

[Markdown]: https://en.wikipedia.org/wiki/Markdown

### Markdown? I Thought You Said Text? ###

I mean [Markdown][] *is* a monospace text format. That's kinda the point. It's
meant for both humans *and* computers to read, which seems like what we want as
humans using computers to do this stuff.

Markdown was the obvious first target. The document structure is all
right there in the runtime; outputting something else should not be much more
work. If you feel like you know what that next something should be then holler
at me.

------------------------------------------------------------------------------
Seriously Though, What The Hell?
------------------------------------------------------------------------------

Two things:

1. ### I Like *Messages* ###
    
    Detailed messages. Messages that tell you what happen, why, what you can do
    about it... well-formated message with well-formatted data and information.

    Errors, logs, test descriptions.

    I find detailed, well-formatted messages very helpful. They help me remember how
    things work (or don't). They save me time by allowing me to fix things *without*
    needing to jump over to the docs or source. They help people learn how to use a
    piece of software naturally, interactively.

    But detailed, well-formatted messages are the exception.

    A big reason why - at least for me, personally - is that the code to create them
    is a pain to write and an eyesore to read.

    The errors, log and test description messages we spit out are almost always
    monospace text. Which is... *whitespace-significant*. You need to line things up
    to have them look right.

    The standard methodology is basic-ass string interpolation... which I assert
    with a reasonable level of confidence is a sub-optimal match for generating
    whitespace-significant formats. While excellent in it's simplicity and
    availability, it's just not great for lining things up vertically. This is even
    before you start to look at the often awkward or absent support for programing
    essentials like loops and re-usability.

2.  ### I Like *Structure* ###
    
    I'm a mathematician by training. I like structure... data, functions.
    Reduction, composition, abstraction. It's how my brain works. And my brain
    doesn't really like to do it with strings.

    If you're a console-crushing, regex-ripping, string-a-ling-everything,
    byte-stream-loving developer then more power to ya. I'm a little jealous
    actually. But it wouldn't surprise me if the TSXT approach doesn't really
    make much sense to you. And that's fine by me. If you still gotta write me a 
    comment/message to that extent, do what you gotta.

    However, if you're more like me and think much better in shapes and
    relationships, then take TSXT for a spin.

I really like what [JSX][] and [React][] brought to the scene. They're exactly
what I always wanted: write my HTML in code without it feeling like hell. It
made perfect sense to me to carry the approach over into the other kinds of
documents I'm generating.

The HTML-y syntax is not great, but it's a damn sight better in my opinion than
what you'd end up with even in a language as flexible as Ruby. We basically all
understand HTML... I'm willing to bet most programers could get a grasp on 
the idea of a TSXT block just by seeing it, which is a pretty awesome feature.


------------------------------------------------------------------------------
Installation
------------------------------------------------------------------------------

In a NPM package root (where an `package.json` is) run:

```console
$ [ -e yarn.lock ] && yarn add tsxt || npm install --save tsxt
```

------------------------------------------------------------------------------
Usage
------------------------------------------------------------------------------

### `tsconfig.json` ###

You seem to need the `compilerOptions.jsx` value set to `"react"` in
your project's [tsconfig.json][].

[tsconfig.json]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

***

### `.tsx` Files ###

In *every* `.tsx` file in which you want to use TSXT you need to:

1.  Add a magic comment line at the top that says exactly:
    
    ```TSX
    /* @jsx TSXT */
    ```
    
    In my experience you **must** use a `/* ... */` comment.
    
    The `// ...` form does not seem to work.

2.  Import `TSXT()` so that the function will be in scope:
    
    ```TSX
    import TSXT from 'tsxt';
    ```
