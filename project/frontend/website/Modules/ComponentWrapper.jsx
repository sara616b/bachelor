import React from "react";
import renderComponent from "../../Utils/renderComponent";
import components from "../Foundation/componentsMap";

const ComponentWrapper = ({ component }) => {
  return renderComponent(components, component.name, component);
};

export default ComponentWrapper;
