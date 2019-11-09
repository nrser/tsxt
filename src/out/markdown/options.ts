import I8 from 'immutable';

import {
  Style,
  Rule,
  Rules,
  Replacement,
  IOptions,
} from './types';

import {
  isBlock,
} from './utilities';


const OptionsRecordFactory =
  I8.Record<IOptions>({
    rules: {} as Record<string, Rule>,
    headingStyle: Style.Headers.setext,
    hr: '* * *',
    bulletListMarker: Style.BulletListMarker.asterisk,
    codeBlockStyle: Style.CodeBlock.indented,
    fence: '```',
    emDelimiterStyle: Style.InlineDelimiter.asterisk,
    strongDelimiterStyle: Style.InlineDelimiter.asterisk,
    linkStyle: Style.Link.ref,
    referenceLinkStyle: Style.ReferenceLink.shortcut,
    br: '  ', // TODO What?
    blankReplacement: (_content, traverse, _options) => {
      return isBlock( traverse.element ) ? '\n\n' :  '';
    },
    keepReplacement: (_content, traverse, _options) => {
      // TODO   What do we do here?
      throw new Error(
        `Hit an element we can't convert to markdown: ${ traverse }`
      );
    },
    defaultReplacement: (content, traverse, _options) => {
      return isBlock( traverse.element ) ? '\n\n' + content + '\n\n' : content;
    }
  }, 'OptionsRecordFactory' );


export class Options extends OptionsRecordFactory {
  
}

