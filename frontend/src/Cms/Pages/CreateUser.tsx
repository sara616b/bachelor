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
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthenticationProps } from "../../Utils/Foundation/Types";

const CreateUser = () => {
  const { csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<string[] | []>([]);
  const [chosenPermissions, setChosenPermissions] = useState<string[] | []>([]);

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
    const target = e.target as typeof e.target & {
      elements: {
        firstname: { value: string };
        lastname: { value: string };
        username: { value: string };
        email: { value: string };
        password: { value: string };
        is_superuser: { checked: string };
      };
    };
    data.append("firstname", target.elements.firstname.value);
    data.append("lastname", target.elements.lastname.value);
    data.append("email", target.elements.email.value);
    data.append("password", target.elements.password.value);
    data.append("is_superuser", target.elements.is_superuser.checked);
    if (chosenPermissions) {
      data.append("permissions", chosenPermissions.toString());
    }
    axios
      .post(
        `http://127.0.0.1:8002/api/users/${target.elements.username.value}/`,
        data,
      )
      .then((response) => {
        if (response.status === 201) {
          navigate("/users/");
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to create users.",
          );
          setNotificationOpen(true);
        }
        if (error.response.status === 400) {
          setNotificationText("Username and email must be unique.");
          setNotificationOpen(true);
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
          <form
            onSubmit={(event) => SubmitForm(event)}
            style={{ width: "100%" }}
          >
            <Flex
              bg="blue.1"
              gap="md"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
              w="100%"
            >
              <TextInput
                placeholder="First Name"
                name="firstname"
                id="firstname"
                label="First Name"
                required
                w="100%"
              />
              <TextInput
                placeholder="Last Name"
                name="lastname"
                id="lastname"
                label="Last Name"
                required
                w="100%"
              />
              <TextInput
                placeholder="Username"
                name="username"
                id="username"
                label="Username"
                required
                w="100%"
              />
              <TextInput
                placeholder="Email"
                name="email"
                id="email"
                label="Email"
                required
                w="100%"
              />
              <TextInput
                placeholder="Password"
                name="password"
                id="password"
                label="Password"
                type="password"
                required
                w="100%"
              />
              <Checkbox
                label="Is Superuser"
                name="is_superuser"
                id="is_superuser"
                w="100%"
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
                w="100%"
              />
              <Button
                variant="gradient"
                gradient={{ from: "indigo.5", to: "cyan.5", deg: 105 }}
                type="submit"
                w="100%"
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
