/* eslint-env browser */

import React from 'react';
import ReactDOM from 'react-dom';
import Reviews from './App';

ReactDOM.render(<Reviews id={Math.ceil(Math.random() * 10000000).toString()} />, document.getElementById('reviews'));
