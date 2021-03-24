import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const HomePage = lazy(/* webpackChunkName: "home-page" */ () => import('../containers/Home'));
const PageNotFound = lazy(/* webpackChunkName: "page-not-found" */ () => import('../containers/PageNotFound'));

const AppRouter = props => (
    <Router>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route path="/" component={HomePage} exact={true} />
                <Route component={PageNotFound} />
            </Switch>
        </Suspense>
    </Router>
);

export default AppRouter;