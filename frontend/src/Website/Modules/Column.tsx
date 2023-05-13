import React, { FC, ReactNode } from "react";
import classnames from "classnames";

type ColumnProps = {
  index: number;
  wrapReverse: boolean;
  alignContent: string;
  children: ReactNode;
};

const Column: FC<ColumnProps> = ({
  index,
  wrapReverse,
  alignContent,
  children,
}) => {
  const columnClassnames = classnames(
    "w-full",
    "grid",
    "content-center",
    "gap-4",
    {
      "place-content-center": alignContent === "center",
      "place-content-end": alignContent === "right",
      "place-content-start": alignContent === "left",
      "order-1": index === 2 && wrapReverse,
      "order-2": index === 1 && wrapReverse,
      "md:order-1": index === 1,
      "md:order-2": index === 2,
    },
  );

  return (
    <div className={columnClassnames}>
      {React.Children.map(children, (child) => {
        return child;
      })}
    </div>
  );
};

export default Column;
