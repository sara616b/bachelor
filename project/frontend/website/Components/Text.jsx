import React from "react";
import classnames from "classnames";

const Text = ({ props }) => {
  const textClassnames = classnames(
    "max-w-sm",
    "w-full",
    "mx-auto",
    "text-base",
    {
      "text-center": props?.alignment == "center",
      "text-right": props?.alignment == "right",
      "text-left": props?.alignment == "left",
    },
  );

  return (
    <p className={textClassnames} style={{ color: props?.text_color }}>
      {props?.text}
    </p>
  );
};

export default Text;
