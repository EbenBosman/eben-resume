import React from 'react';

const goBack = () => {
    window.history.go(-1)
}

const goIndex = () => {
    window.location.href = '/'
}

const PageNotFound = () => (
    <div className="not-found">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Page nto found</p>
        <span onClick={goBack} className="link-style">back to the previous page</span>
        <span>or</span>
        <span onClick={goIndex} className="link-style">Go home</span>
    </div>
);

export default PageNotFound;
