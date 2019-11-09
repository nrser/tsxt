import { Rules, Style } from '../types';
import { repeat, need } from '../utilities'
import { Element } from '../../../immutable/element';
import { pipe } from 'fp-ts/lib/pipeable';
import { map, fold, mapNullable } from 'fp-ts/lib/Option';

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
      const hLevel = Number(traverse.needElement().type.charAt(1))

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
      return pipe(
        traverse.parentElement,
        mapNullable(
          parent => (parent.type === 'li' && traverse.isLastElement()) || null
        ),
        fold(
          ()    => '\n\n' + content + '\n\n',
          _true => '\n' + content,
        )
      );
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
      const parent = traverse.parentElement
      
      if (parent && parent.type === 'OL') {
        var start = parent.props.get( 'start' )
        var index = need( traverse.index );
        
        prefix = (start ? Number(start) + index : index + 1) + '.  '
      }
      
      return (
        prefix +
        content +
        (traverse.nextSibling && !/\n$/.test(content) ? '\n' : '')
      )
    }
  },

  indentedCodeBlock: {
    filter( traverse, options ) {
      return (
        options.codeBlockStyle === Style.CodeBlock.indented &&
        traverse.element !== null &&
        traverse.element.type === 'PRE' &&
        traverse.firstChild !== null &&
        traverse.firstChild.type === 'CODE'
      )
    },

    replacement( _content, traverse, _options ) {
      return (
        '\n\n    ' +
        Element
          .textContent( need( traverse.firstElementChild ) )
          .replace( /\n/g, '\n    ' ) +
        '\n\n'
      )
    }
  },

  fencedCodeBlock: {
    filter( traverse, options ) {
      return (
        options.codeBlockStyle === Style.CodeBlock.fenced &&
        traverse.element !== null &&
        traverse.element.type === 'PRE' &&
        traverse.firstChild !== null &&
        traverse.firstChild.type === 'CODE'
      )
    },

    replacement( _content, traverse, options ) {
      const className = traverse.firstChildWhenElement
      var className = element.firstChild.className || ''
      var language = (className.match(/language-(\S+)/) || [null, ''])[1]

      return (
        '\n\n' + options.fence + language + '\n' +
        element.firstChild.textContent +
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
    filter( element, options ) {
      return (
        options.linkStyle === 'inlined' &&
        element.nodeName === 'A' &&
        element.getAttribute('href')
      )
    },

    replacement(  content, traverse, _options ) {
      var href = element.getAttribute('href')
      var title = element.title ? ' "' + element.title + '"' : ''
      return '[' + content + '](' + href + title + ')'
    }
  },

  referenceLink: {
    filter( element, options ) {
      return (
        options.linkStyle === 'referenced' &&
        element.nodeName === 'A' &&
        element.getAttribute('href')
      )
    },

    replacement(  content, traverse, options ) {
      var href = element.getAttribute('href')
      var title = element.title ? ' "' + element.title + '"' : ''
      var replacement
      var reference

      switch (options.linkReferenceStyle) {
        case 'collapsed':
          replacement = '[' + content + '][]'
          reference = '[' + content + ']: ' + href + title
          break
        case 'shortcut':
          replacement = '[' + content + ']'
          reference = '[' + content + ']: ' + href + title
          break
        default:
          var id = this.references.length + 1
          replacement = '[' + content + '][' + id + ']'
          reference = '[' + id + ']: ' + href + title
      }

      this.references.push(reference)
      return replacement
    },

    references: [],

    append( options ) {
      var references = ''
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
      var hasSiblings = element.previousSibling || element.nextSibling
      var isCodeBlock = element.parentNode.nodeName === 'PRE' && !hasSiblings

      return element.nodeName === 'CODE' && !isCodeBlock
    },

    replacement( content,  _traverse, _options ) {
      if (!content.trim()) return ''

      var delimiter = '`'
      var leadingSpace = ''
      var trailingSpace = ''
      var matches = content.match(/`+/gm)
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
      var alt = element.alt || ''
      var src = element.getAttribute('src') || ''
      var title = element.title || ''
      var titlePart = title ? ' "' + title + '"' : ''
      return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
    }
  },
}

export default CommonmarkRules;
