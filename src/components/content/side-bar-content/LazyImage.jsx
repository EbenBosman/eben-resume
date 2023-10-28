import React, { Suspense } from 'react';

const LazyImage = ({ lowResSrc, fullResSrc, className, height, width, alt }) => {
    const loadingFallback = (
        <img src={lowResSrc} className={className} height={height} width={width} alt={alt} />
    );

    return (
        <Suspense fallback={loadingFallback}>
            <img src={fullResSrc} className={className} height={height} width={width} alt={alt} />
        </Suspense>
    );
};

export default LazyImage;
