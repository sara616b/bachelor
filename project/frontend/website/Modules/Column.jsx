import React from 'react';
import classnames from 'classnames';

const Column = ({ column, index, wrap, alignContent, children }) => {

    const columnClassnames = classnames(
        "w-full",
        "grid",
        {
            "place-content-center": alignContent == "center",
            "place-content-end": alignContent == "right",
            "place-content-start": alignContent == "left",
            "order-1": index == 2 && wrap == "reverse",
            "order-2": index == 1 && wrap == "reverse",
            "md:order-1": index == 1,
            "md:order-2": index == 2,
        }
    )

    return (
        <div className={columnClassnames}>
            {React.Children.map(children, child => { return child })}
        </div>
    )
}

export default Column;
