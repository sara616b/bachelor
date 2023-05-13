import { FC } from "react";
import RenderComponent from "../../Utils/RenderComponent";

type PropTypes = {
  component: any;
};

const ComponentWrapper: FC<PropTypes> = ({ component }) => {
  console.log(component);
  // @ts-ignore
  return RenderComponent({ component });
};

export default ComponentWrapper;
