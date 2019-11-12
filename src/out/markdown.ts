// Imports
// ===========================================================================

// ### Deps ###

import I8 from 'immutable';
import _ from 'lodash/fp';
import TurndownService from 'turndown';

// ### Project / Package ###

import { Element } from '../immutable/element';
import { Traverse } from '../immutable/traverse';


// Definitions
// ===========================================================================

let turndownService: undefined | TurndownService = undefined;

export function getTurndownService(): TurndownService {
  if (turndownService === undefined) {
    turndownService = new TurndownService({
      keepReplacement: function( content: string, node: any ) {
        throw new Error( `tried to replace ${ node }!` );
      }
    });
  }
  
  return turndownService;
}


export function render( root: Element ) {
  const traverse = Traverse.for( root, I8.List<number>() );
  return getTurndownService().turndown( traverse as any );
}

