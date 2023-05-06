import React from "react";
import renderComponent from "../../Utils/renderComponent";
import components from "../../Utils/Foundation/ComponentsDetails";

const ComponentWrapper = ({ component }) => {
  return renderComponent(components, component.name, component);
};

export default ComponentWrapper;
