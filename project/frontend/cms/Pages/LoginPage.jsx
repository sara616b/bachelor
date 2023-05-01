import React from "react";
import { Title, Text, Container, Button, Flex, TextInput } from "@mantine/core";
import renderPage from "../../Utils/renderPage";
import Cookies from "js-cookie";
import axios from "axios";

const App = () => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

  const SubmitForm = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    axios.post("/login/", data).then((response) => {
      if (response.status == 200) {
        // redirect
        location.href = "/";
      }
    });
  };

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
        <Title>Log In</Title>
        <form onSubmit={(event) => SubmitForm(event)}>
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
            <TextInput
              placeholder="Username"
              name="username"
              id="username"
              label="Username"
              required
            />
            <TextInput
              placeholder="Password"
              name="password"
              id="password"
              label="Password"
              type="password"
              required
            />
            <Button
              variant="gradient"
              gradient={{ from: "indigo.5", to: "cyan.5", deg: 105 }}
              type="submit"
            >
              Log In
            </Button>
          </Flex>
        </form>
      </Flex>
    </Container>
  );
};

export default <App />;
