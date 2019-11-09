import I8 from 'immutable';

import { Element } from '../../types';



// export function extend (destination) {
//   for (var i = 1; i < arguments.length; i++) {
//     var source = arguments[i]
//     for (var key in source) {
//       if (source.hasOwnProperty(key)) destination[key] = source[key]
//     }
//   }
//   return destination
// }


export function repeat (character: string, count: number) {
  return Array(count + 1).join(character)
}

export const BLOCK_ELEMENT_TYPES = I8.Set([
  'address', 'article', 'aside', 'audio', 'blockquote', 'body', 'canvas',
  'center', 'dd', 'dir', 'div', 'dl', 'dt', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'hgroup', 'hr', 'html', 'isindex', 'li', 'main', 'menu', 'nav',
  'noframes', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table',
  'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul'
]);

export function isBlock (element: Element | null) {
  return element !== null && BLOCK_ELEMENT_TYPES.has( element.type );
}

export const VOID_ELEMENT_TYPES = I8.Set([
  'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input',
  'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

export function isVoid (element: Element) {
  return VOID_ELEMENT_TYPES.has( element.type );
}

export function need<T>( value: T | null | undefined ): T {
  if (value === null || value === undefined) {
    throw new Error( `Needed was not there` );
  }
  return value;
}

// var voidSelector = voidElements.join()

// export function hasVoid (element: Element) {
//   return element.querySelector && element.querySelector(voidSelector)
// }
