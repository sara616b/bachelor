import React, { FC } from "react";
import classnames from "classnames";

type PropTypes = {
  index: number;
  children: any;
  backgroundColor: string;
};

const Section: FC<PropTypes> = ({ index, children, backgroundColor }) => {
  const numberOfSections = children.length;

  const sectionClasses = classnames("w-full", "py-8", "px-2", "md:px-12");

  const containerClasses = classnames("container", "mx-auto", "grid", "gap-4", {
    "md:grid-cols-1": numberOfSections === 1,
    "md:grid-cols-2": numberOfSections === 2,
  });

  return (
    <section
      className={sectionClasses}
      style={{
        backgroundColor: backgroundColor || "#ffffff",
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

export default Section;
