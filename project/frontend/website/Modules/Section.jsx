import React, { useMemo } from "react";
import classnames from "classnames";

const Section = ({ section, index, children }) => {
  const numberOfSections = children.length;
  const backgroundColor = index == 1 ? "blue" : "#d5a1d4";

  const sectionClasses = classnames("w-full", "py-4", "px-2", "md:px-12");

  const containerClasses = classnames("container", "mx-auto", "grid", "gap-4", {
    "md:grid-cols-1": numberOfSections == 1,
    "md:grid-cols-2": numberOfSections == 2,
  });

  return (
    <section
      className={sectionClasses}
      style={{
        backgroundColor: backgroundColor,
        order: index,
      }}
    >
      <div className={containerClasses}>
        {React.Children.map(children, (child) => {
          return child;
        })}
      </div>
    </section>
  );
};

// Section.propTypes = {

// }

export default Section;
