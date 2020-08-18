import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './routers/AppRouter';

import 'jquery/dist/jquery.slim';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import '../src/styles/main.scss';

ReactDOM.render(<AppRouter />, document.getElementById('app'))
