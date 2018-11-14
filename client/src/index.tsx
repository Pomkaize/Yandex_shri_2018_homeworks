import React from 'react';
import ReactDOM from 'react-dom';
import './global/styles/index.scss';
import {App} from "./global/scripts/App";

const rootElement = document.getElementById('root');
if(rootElement) {
    ReactDOM.render(<App/>, rootElement)
}
