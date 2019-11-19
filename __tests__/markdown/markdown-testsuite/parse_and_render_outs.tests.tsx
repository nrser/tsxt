import 'jest';
import 'jest-extended';
import _ from 'lodash/fp';
import Glob from 'glob';
import FS from 'fs';
import Path from 'path';

import '../../test_helpers';

import Tsxt, { Element } from '../../..';

describe( `Parse and render markdown-testsuite outputs`, () => {
  const paths = Glob.sync( `${ __dirname }/outs/*.out.tsx` );
  
  it( `Has some out files to test`, () => {
    expect( paths.length ).toBeGreaterThan( 0 );
  });
  
  paths.forEach( path => {
    describe( `markdown-test-suite out file ${ path }`, () => {
      const doc = require( path ).default;
      
      it( `Parses and default exports an Element`, () => {
        expect( Element.is( doc ) ).toBe( true );
      });
      
      const basename = Path.basename( path, '.out.tsx' );
      const srcPath = Path.resolve(
        __dirname,
        '../../../dev/markdown-testsuite/tests',
        `${ basename }.md`
      );
      
      it( `Has a Markdown source file`, () => {  
        expect( FS.existsSync( srcPath ) ).toBe( true );
      });
      
      const md = Tsxt.md( doc );
      
      it( `Renders to Markdown`, () => {
        expect( md ).toBeString();
        
        // expect( md ).toEqual( FS.readFileSync( srcPath, 'utf8' ) );
      });
    });
  });
});