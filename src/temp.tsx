/* @jsx createElement */

import I8 from 'immutable';
import _ from 'lodash/fp';
import {
  Option,
  Some,
  None,
  some,
  none,
  isSome,
  map,
  mapNullable,
  fromNullable,
  getOrElse,
  filterMap,
} from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable'


interface Blah {
  value: Option<string>;
}

class B1 implements Blah {
  get value() {
    const v = some( 'yo' ) as Some<string>;
    return v;
  }
}

const b1 = new B1();

const v1 = b1.value;

const vv1 = v1.value;