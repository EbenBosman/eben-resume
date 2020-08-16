import React from 'react';

class NotFound extends React.Component {
    constructor (props) {
	    super(props)
    }

    goBack = () => {
        window.history.go(-1)
    }

    goIndex = () => {
        window.location.href = '/'
    }

  	render () {
	    return (
            <div className="not-found">
                <h1 className="not-found-title">404</h1>
                <p className="not-found-text">Don't be sad, don't despair, the dark days will still come！</p>
                <p className="not-found-text">just now</p>
                <span onClick={this.goBack} className="link-style">back to the previous page</span>
                <span>or</span>
                <span onClick={this.goIndex} className="link-style">Go home</span>
            </div>
	    )
    }
}

export default NotFound;
