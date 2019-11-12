import I8 from 'immutable';

import {
  Element,
} from '../../types';

import Traverse from '../../immutable/traverse';
import ChildElementTraverse from '../../immutable/child_element_traverse';

export namespace Style {
  
  export enum Headers {
    /**
     * Use Setext-style headers (underlines of `=` and `-`).
     * 
     * @see https://spec.commonmark.org/0.22/#setext-headers
     * @see https://en.wikipedia.org/wiki/Setext
     */
    setext  = 'setext',
    
    /**
     * Use atx-style headers (inline `#` prefixes).
     * 
     * @see https://spec.commonmark.org/0.22/#atx-headers
     * @see http://www.aaronsw.com/2002/atx/intro
     */
    atx     = 'atx',
  } // enum Headers
  
  export enum CodeBlock {
    indented    = 'indented',
    fenced     = 'fenced',
  }
  
  export enum InlineDelimiter {
    dash      = '-',
    asterisk  = '*',
  }
  
  export enum BulletListMarker {
    asterisk  = '*',
    plus      = '+',
    dash      = '-',
  }
  
  export enum Link {
    /**
     * URLs go right next to link text inline, like
     * 
     *     Click [here](http://example.com) for a good time.
     * 
     * @see https://spec.commonmark.org/0.22/#inline-link
     */
    inline  = 'inline',
    
    /**
     * URLs go in separate reference lines placed elsewhere, like:
     * 
     *    Click [here] for a a good time.
     *    
     *    [here]: http://example.com
     * 
     * @see ReferenceLink
     * @see https://spec.commonmark.org/0.22/#reference-link
     */
    ref     = 'ref',
  }
  
  /**
   * How do you like your *reference links* - the part that is linked (the
   * anchor element) in HTML rendered from the Markdown?
   * 
   * @see https://spec.commonmark.org/0.22/#reference-link
   */
  export enum ReferenceLink {
    /**
     * `[link text][ref id]` *reference link* style.
     * 
     * @see https://spec.commonmark.org/0.22/#full-reference-link
     */
    full      = 'full',
    
    /**
     * `[link text][]` *reference link* style.
     * 
     * @see https://spec.commonmark.org/0.22/#collapsed-reference-link
     */
    collapse  = 'collapse',
    
    /**
     * `[link text]` *reference link* style.
     * 
     * @see https://spec.commonmark.org/0.22/#shortcut-reference-link
     */
    shortcut  = 'shortcut',
  } // enum LinkReference
  
} //  namespace Style


export type FilterFn =
  (traverse: ChildElementTraverse, options: IOptions) => boolean;

export type Filter = string | string[] | FilterFn;

export type Replacement =
  (content: string, traverse: ChildElementTraverse, options: IOptions)
    => string;

export interface Rule {
  filter: Filter,
  replacement: Replacement,
}

export type Rules = Record<string, Rule>;

export interface IOptions {
  rules: Rules,
  headingStyle: Style.Headers,
  hr: string,
  bulletListMarker: Style.BulletListMarker,
  codeBlockStyle: Style.CodeBlock,
  fence: string,
  emDelimiterStyle: Style.InlineDelimiter,
  strongDelimiterStyle: Style.InlineDelimiter,
  linkStyle: Style.Link,
  referenceLinkStyle: Style.ReferenceLink,
  br: string,
  blankReplacement: Replacement,
  keepReplacement: Replacement,
  defaultReplacement: Replacement,
}

// export const OptionsFactory =
//   I8.Record<IOptions>({
//     rules: 
//   });