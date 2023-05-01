import React from "react";

const Title = ({ props }) => {
  return (
    <h1 className="w-full text-3xl" style={{ color: props?.title_color }}>
      {props?.text}
    </h1>
  );
};

export default Title;
