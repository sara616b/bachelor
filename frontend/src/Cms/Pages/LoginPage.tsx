import { Title, Container, Button, Flex, TextInput } from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect } from "react";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, csrftoken } = useIsAuthenticated(false);
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const SubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      elements: {
        username: { value: string };
        password: { value: string };
      };
    };
    const username = target.elements.username.value;
    const password = target.elements.password.value;
    if (
      password === undefined ||
      password === "" ||
      username === undefined ||
      username === ""
    ) {
      return null;
    }
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios.defaults.withCredentials = true;
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("csrfmiddlewaretoken", csrftoken);
    axios
      .post("http://127.0.0.1:8002/login/", data)
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
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

export default LoginPage;
