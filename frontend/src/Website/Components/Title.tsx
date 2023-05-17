import classnames from "classnames";

type TitleProps = {
  alignment: string;
  title_color: string;
  text: string;
  bold: boolean;
};

type Props = {
  props: TitleProps;
};

const Title = ({ props }: Props) => {
  const textClassnames = classnames("w-full", "text-3xl", {
    "text-center": props?.alignment === "center",
    "text-right": props?.alignment === "right",
    "text-left": props?.alignment === "left",
    "font-bold": props?.bold,
  });
  return (
    <h1 className={textClassnames} style={{ color: props?.title_color }}>
      {props?.text}
    </h1>
  );
};

export default Title;
