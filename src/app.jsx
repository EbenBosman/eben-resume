import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './routers/AppRouter';

import '../src/styles/main.scss';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <AppRouter />
    </StrictMode>,
);
