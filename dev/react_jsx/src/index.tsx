import React, { Component } from 'react';


class A extends Component {}

const s = <span>hey</span>;
const p = <p className="ho">{ s }</p>;

const c = <Component>Yo</Component>;

console.log( c.type );

// let ec: JSX.ElementClass;
