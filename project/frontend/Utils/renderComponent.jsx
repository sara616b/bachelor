import React from 'react';

const renderComponent = (componentsArray, name, props) => {
    const Element = componentsArray[name];
    return <Element props={props} key={Math.random()} />;
}

export default renderComponent;