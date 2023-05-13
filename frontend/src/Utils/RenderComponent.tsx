import React, { FC } from "react";
import componentsObject from "./Foundation/ComponentsDetails";

type PropTypes = {
  component: any;
};

const RenderComponent: FC<PropTypes> = ({ component }) => {
  const Element = componentsObject[component.name]["component"];
  return <Element props={component} key={Math.random()} />;
};

export default RenderComponent;
