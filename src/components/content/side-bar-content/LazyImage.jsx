import React, { Suspense } from 'react';

export default class LazyImage extends React.Component {
    loadingFallback = () => (
        <img src={this.props.lowResSrc} className={this.props.className} height={this.props.height} width={this.props.width} alt={this.props.alt} />
    );

    render() {
        return (
            <Suspense fallback={this.loadingFallback()}>
                <img src={this.props.fullResSrc} className={this.props.className} height={this.props.height} width={this.props.width} alt={this.props.alt} />
            </Suspense>
        );
    }
}