import React from 'react';

const goBack = () => {
    window.history.go(-1)
}

const goIndex = () => {
    window.location.href = '/'
}

const PageNotFound = () => (
    <React.Fragment>
        <div style={{width: '100vw', height: '100vh', backgroundColor:"black"}}>
            <figure>
                <div className="sad-mac"></div>
                <figcaption>
                    <span className="sr-text">Error 404: Not Found</span>
                    <span className="e"></span>
                    <span className="r"></span>
                    <span className="r"></span>
                    <span className="o"></span>
                    <span className="r"></span>
                    <span className="_4"></span>
                    <span className="_0"></span>
                    <span className="_4"></span>
                    <span className="n"></span>
                    <span className="o"></span>
                    <span className="t"></span>
                    <span className="f"></span>
                    <span className="o"></span>
                    <span className="u"></span>
                    <span className="n"></span>
                    <span className="d"></span>
                </figcaption>
            </figure>
        </div>
    </React.Fragment>
);

export default PageNotFound;
