import { Rules, Style } from '../types';
import { repeat, need } from '../utilities'
import { Element } from '../../../immutable/element';
import { pipe } from 'fp-ts/lib/pipeable';
import { map, fold, mapNullable, filter, getOrElse, toNullable, isSome } from 'fp-ts/lib/Option';
import { getOrThrow } from '../../../helpers';

const CommonmarkRules: Rules = {
  
  paragraph: {
    filter: 'p',

    replacement(  content, _traverse, _options ) {
      return '\n\n' + content + '\n\n'
    }
  },

  lineBreak: {
    filter: 'br',

    replacement(  _content, _traverse, options ) {
      return options.br + '\n'
    }
  },

  heading: {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],

    replacement( content, traverse, options ) {
      const hLevel = Number( traverse.element.value.type.charAt( 1 ) )
      
      if (options.headingStyle === 'setext' && hLevel < 3) {
        const underline = repeat((hLevel === 1 ? '=' : '-'), content.length)
        return (
          '\n\n' + content + '\n' + underline + '\n\n'
        )
      } else {
        return '\n\n' + repeat('#', hLevel) + ' ' + content + '\n\n'
      }
    }
  },

  blockquote: {
    filter: 'blockquote',

    replacement(  content, _traverse, _options ) {
      content = content.replace(/^\n+|\n+$/g, '')
      content = content.replace(/^/gm, '> ')
      return '\n\n' + content + '\n\n'
    }
  },

  list: {
    filter: ['ul', 'ol'],

    replacement( content, traverse, _options ) {
      return Element.hasType( traverse.parentElement, 'li' ) &&
              traverse.isLastElement()
            ? '\n' + content
            : '\n\n' + content + '\n\n';
    }
  },

  listItem: {
    filter: 'li',

    replacement( content, traverse, options ) {
      content = content
        .replace(/^\n+/, '') // remove leading newlines
        .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
        .replace(/\n/gm, '\n    ') // indent
      
      let prefix = options.bulletListMarker + '   '
      
      const parent = traverse.parentElement.value;
      
      if (Element.hasType( parent, 'ol' )) {
        const start = parent.props.get( 'start' )
        const index = traverse.index.value;
        
        prefix = (start ? Number(start) + index : index + 1) + '.  '
      }
      
      return (
        prefix +
        content +
        (traverse.hasNextSibling && !/\n$/.test(content) ? '\n' : '')
      )
    }
  },

  indentedCodeBlock: {
    filter( traverse, options ) {
      return (
        options.codeBlockStyle === Style.CodeBlock.indented &&
        Element.hasType( traverse.element, 'pre' ) &&
        Element.hasType( traverse.firstChild, 'code' )
      )
    },

    replacement( _content, traverse, _options ) {
      return (
        '\n\n    ' +
        pipe(
          traverse.firstElementChild,
          fold(
            () => '',
            el => Element.textContent( el ).replace( /\n/g, '\n    ' )
          ),
        ) +
        '\n\n'
      )
    }
  },

  fencedCodeBlock: {
    filter( traverse, options ) {
      return (
        options.codeBlockStyle === Style.CodeBlock.fenced &&
        Element.hasType( traverse.element, 'pre' ) &&
        Element.hasType( traverse.firstChild, 'code' )
      )
    },

    replacement( _content, traverse, options ) {
      const className = Element.getType( traverse.firstChild );
      const language = (className.match(/language-(\S+)/) || [null, ''])[1]

      return (
        '\n\n' + options.fence + language + '\n' +
        Element.textContent( traverse.firstChild ) +
        '\n' + options.fence + '\n\n'
      )
    }
  },

  horizontalRule: {
    filter: 'hr',

    replacement(  _content, _traverse, options ) {
      return '\n\n' + options.hr + '\n\n'
    }
  },

  inlineLink: {
    filter( traverse, options ) {
      return (
        options.linkStyle === Style.Link.inline &&
        Element.hasType( traverse.element, 'a' ) &&
        traverse.element.value.props.has( 'href' )
      );
    },

    replacement( content, traverse, _options ) {
      const element = traverse.element.value;
      const href = element.props.get( 'href' );
      const title =
        element.props.has( 'title' )
          ? ' "' + element.props.get( 'title' ) + '"'
          : '';
      return '[' + content + '](' + href + title + ')';
    }
  },

  referenceLink: {
    filter( traverse, options ) {
      return (
        options.linkStyle === Style.Link.ref &&
        Element.hasType( traverse.element, 'a' ) &&
        traverse.element.value.props.has( 'href' )
      )
    },

    replacement( content, traverse, options ) {
      const element = traverse.element.value;
      const href = element.props.get( 'href' );
      const title =
        element.props.has( 'title' )
          ? ' "' + element.props.get( 'title' ) + '"'
          : '';
      let replacement: string;
      let reference: string;

      switch (options.referenceLinkStyle) {
        case Style.ReferenceLink.collapse:
          replacement = '[' + content + '][]'
          reference = '[' + content + ']: ' + href + title
          break
        case Style.ReferenceLink.shortcut:
          replacement = '[' + content + ']'
          reference = '[' + content + ']: ' + href + title
          break
        default:
          const id = this.references.length + 1
          replacement = '[' + content + '][' + id + ']'
          reference = '[' + id + ']: ' + href + title
      }

      this.references.push(reference)
      return replacement
    },

    references: [],

    append( options ) {
      const references = ''
      if (this.references.length) {
        references = '\n\n' + this.references.join('\n') + '\n\n'
        this.references = [] // Reset references
      }
      return references
    }
  },

  emphasis: {
    filter: ['em', 'i'],

    replacement( content, _traverse, options ) {
      if (!content.trim()) return ''
      return options.emDelimiter + content + options.emDelimiter
    }
  },

  strong: {
    filter: ['strong', 'b'],

    replacement( content, _traverse, options ) {
      if (!content.trim()) return ''
      return options.strongDelimiter + content + options.strongDelimiter
    }
  },

  code: {
    filter( element, _options ) {
      const hasSiblings = element.previousSibling || element.nextSibling
      const isCodeBlock = element.parentNode.nodeName === 'PRE' && !hasSiblings

      return element.nodeName === 'CODE' && !isCodeBlock
    },

    replacement( content,  _traverse, _options ) {
      if (!content.trim()) return ''

      const delimiter = '`'
      const leadingSpace = ''
      const trailingSpace = ''
      const matches = content.match(/`+/gm)
      if (matches) {
        if (/^`/.test(content)) leadingSpace = ' '
        if (/`$/.test(content)) trailingSpace = ' '
        while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + '`'
      }

      return delimiter + leadingSpace + content + trailingSpace + delimiter
    }
  },

  image: {
    filter: 'img',

    replacement( _content, traverse, _options ) {
      const alt = element.alt || ''
      const src = element.getAttribute('src') || ''
      const title = element.title || ''
      const titlePart = title ? ' "' + title + '"' : ''
      return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
    }
  },
}

export default CommonmarkRules;
