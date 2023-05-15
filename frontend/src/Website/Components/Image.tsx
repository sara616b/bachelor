import React, { FC } from "react";

type ImageProps = {
  link: string;
};

type Props = {
  props: ImageProps;
};

const Image: FC<Props> = ({ props }) => {
  return (
    <img src={props.link} alt="beautiful flowers" className="animate-fade-in" />
  );
};

export default Image;
