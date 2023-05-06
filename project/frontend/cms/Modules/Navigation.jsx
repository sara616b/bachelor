import React from "react";
import { Button, Flex } from "@mantine/core";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <Button.Group>
      <Flex direction="row" wrap="wrap" px="xl" py="sm" mx="auto">
        <Link to="/">
          <Button variant="default">Home</Button>
        </Link>
        <Link to="/page/create/">
          <Button variant="default">Create New Page</Button>
        </Link>
        <Link to="/page/all/">
          <Button variant="default">Pages</Button>
        </Link>
        <Link to="/users/">
          <Button variant="default">Users</Button>
        </Link>
        <Button
          variant="default"
          component="a"
          rel="noopener noreferrer"
          href="/logout/"
        >
          Log Out
        </Button>
      </Flex>
    </Button.Group>
  );
};

export default App;
