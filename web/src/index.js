import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import axios from 'axios';

axios.defaults.withCredentials = true;

ReactDOM.render(<Routes />, document.getElementById('root'));
