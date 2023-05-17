import { useState, useEffect, FormEvent } from "react";
import {
  Title,
  Container,
  Button,
  Flex,
  TextInput,
  Checkbox,
  MultiSelect,
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<string[] | []>([]);
  const [chosenPermissions, setChosenPermissions] = useState<string[] | []>([]);

  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://127.0.0.1:8002/api/permissions/").then((response) => {
      setPermissions(response.data.permissions);
    });
  }, []);

  const SubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    const targetElemet = e.target as typeof e.target & {
      elements: {
        firstname: { value: string };
        lastname: { value: string };
        username: { value: string };
        email: { value: string };
        password: { value: string };
        is_superuser: { checked: string };
      };
    };
    data.append("firstname", targetElemet.elements.firstname.value);
    data.append("lastname", targetElemet.elements.lastname.value);
    data.append("username", targetElemet.elements.username.value);
    data.append("email", targetElemet.elements.email.value);
    data.append("password", targetElemet.elements.password.value);
    data.append("is_superuser", targetElemet.elements.is_superuser.checked);
    if (chosenPermissions) {
      data.append("permissions", chosenPermissions.toString());
    }
    axios
      .post("http://127.0.0.1:8002/api/users/create/", data)
      .then((response) => {
        if (response.status === 200) {
          navigate("/users/");
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
export default CreateUser;
