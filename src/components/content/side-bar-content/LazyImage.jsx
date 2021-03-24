import React from 'react';
import PropTypes from 'prop-types';

export default class LazyImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            src: null,
        };
    }

    componentDidMount() {
        const { src } = this.props;

        const imageLoader = new Image();
        imageLoader.src = src;

        imageLoader.onload = () => {
            this.setState({ src });
        };
    }

    render() {
        const { placeholder, className, height, width, alt } = this.props;
        const { src } = this.state;
        return (
            <img src={src || placeholder} className={className} height={height} width={width} alt={alt} />
        );
    }
}

LazyImage.propTypes = {
    src: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    alt: PropTypes.string,
};