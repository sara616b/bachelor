import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Container,
  Button,
  Flex,
  TextInput,
  Checkbox,
  MultiSelect,
} from "@mantine/core";
import renderPage from "../../Utils/renderPage";
import Navigation from "../Modules/Navigation";
import Cookies from "js-cookie";
import axios from "axios";

const App = () => {
  const [permissions, setPermissions] = useState([]);
  const [chosenPermissions, setChosenPermissions] = useState([]);

  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

  useEffect(() => {
    axios.get("/api/permissions/").then((response) => {
      setPermissions(response.data.permissions);
    });
  }, []);

  const SubmitForm = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("firstname", e.target.elements.firstname.value);
    data.append("lastname", e.target.elements.lastname.value);
    data.append("username", e.target.elements.username.value);
    data.append("email", e.target.elements.email.value);
    data.append("password", e.target.elements.password.value);
    data.append("is_superuser", e.target.elements.is_superuser.checked);
    data.append("permissions", chosenPermissions);
    axios.post("/api/user/create/", data).then((response) => {
      if (response.status == 200) {
        // redirect
        location.href = "/users/";
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
        <Flex
          bg="blue.1"
          gap="lg"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
          px="xl"
          py="xl"
        >
          <Title>Create New User</Title>
          <form onSubmit={(event) => SubmitForm(event)}>
            <Flex
              bg="blue.1"
              gap="md"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
            >
              <TextInput
                placeholder="First Name"
                name="firstname"
                id="firstname"
                label="First Name"
                required
              />
              <TextInput
                placeholder="Last Name"
                name="lastname"
                id="lastname"
                label="Last Name"
                required
              />
              <TextInput
                placeholder="Username"
                name="username"
                id="username"
                label="Username"
                required
              />
              <TextInput
                placeholder="Email"
                name="email"
                id="email"
                label="Email"
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
              <Checkbox
                label="Is Superuser"
                name="is_superuser"
                id="is_superuser"
              />
              <MultiSelect
                value={chosenPermissions}
                onChange={setChosenPermissions}
                name="permissions"
                id="permissions"
                data={permissions}
                label="User Permissions and Groups"
                placeholder="Pick the permissions for the new user"
                searchable
              />
              <Button
                variant="gradient"
                gradient={{ from: "indigo.5", to: "cyan.5", deg: 105 }}
                type="submit"
              >
                Create
              </Button>
            </Flex>
          </form>
        </Flex>
      </Flex>
    </Container>
  );
};
export default <App />;
