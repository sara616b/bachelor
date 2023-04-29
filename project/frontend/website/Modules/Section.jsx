import React from 'react';

const Section = ({ props, children }) => {
    return (
        <section>
            {React.Children.map(children, child => { return child })}
        </section>
    )
}

export default Section;
