/**
 * Try to do this thing *without* a dom (and hence without [['jsdom']] and 
 * [['turndown']]).
 * 
 * References:
 * 
 * 1.   React implementations, which I'm going to strive for compatibility
 *      with:
 *      
 *      1.  `createElement()` function: https://git.io/JeByb
 *          
 *          Function that is used as the `JSX` handler. 
 *            
 *      2.  `ReactElement` class: https://git.io/JeByj
 *          
 *          `createElement()` returns instances of `ReactElement`.
 */

// Imports
// ===========================================================================

// ### Deps ###

import I8 from 'immutable';
import _ from 'lodash/fp';

// ### Project / Package ###

import {
  Element,
} from './immutable/element';


// Definitions
// ===========================================================================

export const createElement = Element.create;
