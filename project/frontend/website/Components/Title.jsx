import React from "react";
import classnames from "classnames";

const Title = ({ props }) => {
  const textClassnames = classnames("w-full", "text-3xl", {
    "text-center": props?.alignment == "center",
    "text-right": props?.alignment == "right",
    "text-left": props?.alignment == "left",
    "font-bold": props?.bold,
  });
  return (
    <h1 className={textClassnames} style={{ color: props?.title_color }}>
      {props?.text}
    </h1>
  );
};

export default Title;
