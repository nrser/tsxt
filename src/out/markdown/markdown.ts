// Imports
// ===========================================================================

// ### Deps ###

import I8 from 'immutable';
import _ from 'lodash/fp';
import get from 'lodash/get';

// ### Project / Package ###

import {
  Element,
  isElement,
} from '../../types';


// Definitions
// ===========================================================================

// Constants
// ---------------------------------------------------------------------------

const leadingNewLinesRegExp = /^\n*/;
const trailingNewLinesRegExp = /\n*$/;


// Functions
// ---------------------------------------------------------------------------

export class Markdown {
  
  public static MAX_NEWLINES = 2;
  
  public static ESCAPES: Array<[ RegExp, string]> = [
    [/\\/g, '\\\\'],
    [/\*/g, '\\*'],
    [/^-/g, '\\-'],
    [/^\+ /g, '\\+ '],
    [/^(=+)/g, '\\$1'],
    [/^(#{1,6}) /g, '\\$1 '],
    [/`/g, '\\`'],
    [/^~~~/g, '\\~~~'],
    [/\[/g, '\\['],
    [/\]/g, '\\]'],
    [/^>/g, '\\>'],
    [/_/g, '\\_'],
    [/^(\d+)\. /g, '$1\\. ']
  ];
  
  
  protected static join (s1: string, s2: string): string {
    // Reduce to at most two newlines between strings
    return  s1.replace( trailingNewLinesRegExp, '' ) +
            [ s1.match( trailingNewLinesRegExp ),
              s2.match( leadingNewLinesRegExp ) ]
              .map( m => get( m, 0, '' ) )
              .join( '' )
              .slice( 0, Markdown.MAX_NEWLINES ) +
            s2.replace( leadingNewLinesRegExp, ''  )
  }
  
  
  public static escape( string: string ): string {
    return this.ESCAPES.reduce(
      (accumulator, escape) => accumulator.replace( escape[0], escape[1] ),
      string
    );
  }

  /**
   * Reduces a DOM node down to its Markdown string equivalent
   * @private
   * @param {HTMLElement} parentNode The node to convert
   * @returns A Markdown representation of the node
   */
  process (element: Element): string {
    return _.reduce(
      (output, node) => {
        let replacement = '';
        
        if (isElement( node )) {
          replacement = this.replacementForNode( node );
        } else {
          const string = node.toString();
          
          replacement = element.type ===  'code'
                        ? string : Markdown.escape( string )
        }

        return Markdown.join( output, replacement )
      },
      '',
      element.props.get( 'children' )
    );
  }
  

  /**
   * Converts an element node to its Markdown equivalent
   * @private
   * @param {HTMLElement} node The node to convert
   * @returns A Markdown representation of the node
   */
  replacementForNode( element: Element ) {
    const rule = this.rules.forNode( element )
    let content = this.process( element )
    var whitespace = element.flankingWhitespace
    if (whitespace.leading || whitespace.trailing) { content = content.trim() }
    return (
      whitespace.leading +
      rule.replacement( content, element, this.options ) +
      whitespace.trailing
    )
  }
  
} // class Markdown


