import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from '../containers/Home';
import NotFoundPage from '../containers/NotFound';

const AppRouter = (props) => (
    <Router>
        <Suspense>
            <Switch>
                <Route path="/" component={HomePage} exact={true} />
                <Route component={NotFoundPage} />
            </Switch>
        </Suspense>
    </Router>
);

export default AppRouter;