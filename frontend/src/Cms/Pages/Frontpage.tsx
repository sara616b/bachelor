import { Title, Text, Container, Button, Flex } from "@mantine/core";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";

const Frontpage = () => {
  // const navigate = useNavigate();
  // const { isLoggedIn, csrftoken } = useIsAuthenticated();
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/");
  //   }
  // }, [isLoggedIn]);

  return (
    <Container size="xs">
      <Flex
        bg="blue.1"
        gap="lg"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        px="xl"
        py="xl"
      >
        <Title>CMS</Title>
        <Text>
          This is the CMS for the bachelor project PageManager. Here, you can
          create and edit Pages.
        </Text>
        <Button
          variant="gradient"
          gradient={{ from: "indigo.9", to: "indigo.5", deg: 105 }}
          component="a"
          rel="noopener noreferrer"
          href="/page/create/"
        >
          Create New Page
        </Button>
        <Button
          variant="gradient"
          gradient={{ from: "indigo.5", to: "cyan.5", deg: 105 }}
          component="a"
          rel="noopener noreferrer"
          href="/page/all/"
        >
          View All Pages
        </Button>
      </Flex>
    </Container>
  );
};
export default Frontpage;
