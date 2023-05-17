type ImageProps = {
  link: string;
};

type Props = {
  props: ImageProps;
};

const Image = ({ props }: Props) => {
  return (
    <img src={props.link} alt="beautiful flowers" className="animate-fade-in" />
  );
};

export default Image;
