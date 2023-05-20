import {
  Title,
  Container,
  Button,
  Flex,
  TextInput,
  Text,
  Mark,
} from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect } from "react";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";
import Cookies from "js-cookie";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, csrftoken } = useIsAuthenticated();
  useEffect(() => {
    console.log(process.env);
    console.log(process.env.REACT_APP_API_HOST);
    if (isLoggedIn === undefined) return;
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
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("csrfmiddlewaretoken", csrftoken);
    axios
      .post(`${process.env.REACT_APP_API_HOST}/login/`, data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          Cookies.set("authenticatedCsrfToken", response.data.csrftoken);
          navigate("/");
        }
      })
      .catch((error) => {
        if (error.response.status === 404) {
          console.log("User doesn't exsist.");
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
        <Text bg="white" p="sm">
          <Title order={3}>Test user</Title>
          Log in with credentials:
          <br />
          <br />
          Username: <Mark color="indigo">test</Mark>
          <br />
          Password: <Mark color="indigo">testpassword123</Mark>
          <br />
          <br />
          to access the CMS with a test user. This user doesn't have permissions
          to change anything, but can view all of the CMS.
        </Text>
      </Flex>
    </Container>
  );
};

export default LoginPage;
