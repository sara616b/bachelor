import RenderComponent from "../../Utils/RenderComponent";

type Props = {
  component: any;
};

const ComponentWrapper = ({ component }: Props) => {
  console.log(component);
  // @ts-ignore
  return RenderComponent({ component });
};

export default ComponentWrapper;
