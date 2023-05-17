import React from "react";
import { Flex, Accordion, Divider } from "@mantine/core";

type Props = {
  children: React.ReactNode;
  column: {
    name: string;
  };
  columnKey: number;
};

const App = ({ children, column, columnKey }: Props) => {
  return (
    <Flex direction="column" gap="md" key={`${columnKey}${column.name}`}>
      <Divider label={`Column ${columnKey}`} labelPosition="center" />
      <Accordion
        defaultValue="customization"
        chevronPosition="left"
        variant="separated"
      >
        {React.Children.map(children, (child) => {
          return child;
        })}
      </Accordion>
    </Flex>
  );
};

export default App;
