import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const HomePage = lazy(/* webpackChunkName: "home-page" */() => import('../main-pages/home'));
const PageNotFound = lazy(/* webpackChunkName: "page-not-found" */() => import('../main-pages/pageNotFound'));

const loadingFallback = () => (
    <div className="dot-spinner-container">
        <div className="dot-spinner"></div>
    </div>
);

const AppRouter = props => (
    <Router>
        <Suspense fallback={loadingFallback()}>
            <Switch>
                <Route path="/" component={HomePage} exact={true} />
                <Route component={PageNotFound} />
            </Switch>
        </Suspense>
    </Router>
);

export default AppRouter;