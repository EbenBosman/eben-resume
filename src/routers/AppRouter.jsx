import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import HomePage from '../containers/Home';
import PageNotFound from '../containers/PageNotFound';

const AppRouter = props => (
    <Router>
        <Suspense>
            <Switch>
                <Route path="/" component={HomePage} exact={true} />
                <Route component={PageNotFound} />
            </Switch>
        </Suspense>
    </Router>
);

export default AppRouter;