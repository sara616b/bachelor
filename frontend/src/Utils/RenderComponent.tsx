import componentsObject from "./Foundation/ComponentsDetails";

type Props = {
  component: any;
};

const RenderComponent = ({ component }: Props) => {
  const Element = componentsObject[component.name]["component"];
  return <Element props={component} key={Math.random()} />;
};

export default RenderComponent;
