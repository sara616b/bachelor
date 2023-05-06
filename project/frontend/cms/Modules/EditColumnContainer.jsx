import React from "react";
import { Flex, Accordion, Text, Divider } from "@mantine/core";

const App = ({ children, column, columnKey }) => {
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
