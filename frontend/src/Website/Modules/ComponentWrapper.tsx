import RenderComponent from "../../Utils/RenderComponent";

type Props = {
  component: any;
};

const ComponentWrapper = ({ component }: Props) => {
  // @ts-ignore
  return RenderComponent({ component });
};

export default ComponentWrapper;
