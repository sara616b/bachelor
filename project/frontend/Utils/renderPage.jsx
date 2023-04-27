import React from 'react';
import { createRoot } from 'react-dom/client';

const renderPage = (async (id, app) => {
    const domNode = document.getElementById(id);
    const root = createRoot(domNode);
    if (root) {
        root.render(
            app
        );
    }
});

export default renderPage;