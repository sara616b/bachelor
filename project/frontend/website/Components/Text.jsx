import React from 'react';

const Text = ({ props }) => {
    return (
        <p style={{ color: props?.text_color }}>{props?.text}</p>
    )
}

export default Text;
