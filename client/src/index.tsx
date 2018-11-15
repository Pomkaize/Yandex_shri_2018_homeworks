import React from 'react';
import ReactDOM from 'react-dom';
// @ts-ignore
import * as isTouchDevice from 'is-touch-device';
import './global/styles/index.scss';
import {AppDesktop} from "./global/scripts/AppDesktop";
import {AppTouch} from "./global/scripts/AppTouch";

const cond: boolean  = isTouchDevice();
console.log( cond ? 'Touch' : 'Desktop');

const rootElement = document.getElementById('root');
if(rootElement) {
    ReactDOM.render(cond ? <AppTouch/> : <AppDesktop/> , rootElement)
}
