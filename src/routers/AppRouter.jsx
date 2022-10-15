import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const HomePage = lazy(/* webpackChunkName: "home-page" */() => import('../main-pages/home'));
const PageNotFound = lazy(/* webpackChunkName: "page-not-found" */() => import('../main-pages/pageNotFound'));

const loadingFallback = () => (
    <div className="dot-spinner-container">
        <div className="dot-spinner"></div>
    </div>
);

const AppRouter = () => (
    <Router>
        <Suspense fallback={loadingFallback()}>
            <Routes>
                <Route path="/" element={<HomePage />} exact={true} />
                <Route element={<PageNotFound />} />
            </Routes>
        </Suspense>
    </Router>
);

export default AppRouter;