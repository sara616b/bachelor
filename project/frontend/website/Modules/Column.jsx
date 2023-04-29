import React from 'react';

const Column = ({ column, children }) => {
    return (
        <div>
            {React.Children.map(children, child => { return child })}
        </div>
    )
}

export default Column;
