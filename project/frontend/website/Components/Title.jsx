import React from 'react';

const Title = ({ props }) => {
    return (
        <h1 style={{ color: props?.title_color }}>{props?.text}</h1>
    )
}

export default Title;
