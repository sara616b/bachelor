import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
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
import {
  AuthenticationProps,
  UserObjectProps,
} from "../../Utils/Foundation/Types";

const EditUser = () => {
  const navigate = useNavigate();
  const { isLoggedIn, csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();
  const { username } = useParams();
  const [user, setUser] = useState<UserObjectProps>();
  const [permissions, setPermissions] = useState<string[] | []>([]);
  const [chosenPermissions, setChosenPermissions] = useState<string[] | []>([]);

  useEffect(() => {
    if (isLoggedIn === undefined || !isLoggedIn) return;
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/permissions/`)
      .then((response) => {
        setPermissions(response.data.permissions);
      });
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn === undefined || !isLoggedIn) return;
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/users/${username}/`)
      .then((response) => {
        setUser(response.data.user);
        setChosenPermissions(response.data.user.permissions);
      });
  }, [username, isLoggedIn]);

  const SubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      elements: {
        firstname: { value: string };
        lastname: { value: string };
        username: { value: string };
        email: { value: string };
        password: { value: string };
        is_superuser: { checked: string };
      };
    };

    const data = new FormData();
    data.append("firstname", target.elements.firstname.value);
    data.append("lastname", target.elements.lastname.value);
    data.append("username", target.elements.username.value);
    data.append("email", target.elements.email.value);
    data.append("is_superuser", target.elements.is_superuser.checked);
    data.append("permissions", chosenPermissions.toString());
    data.append("csrfmiddlewaretoken", csrftoken);

    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .put(`${process.env.REACT_APP_API_HOST}/api/users/${username}/`, data)
      .then((response) => {
        if (response.status === 200) {
          navigate("/users/");
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to edit users.",
          );
          setNotificationOpen(true);
        }
        if (error.response.status === 400) {
          setNotificationText(
            "Something went wrong. Please make sure the inputs are correct.",
          );
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
          <Title>Edit User</Title>
        </Flex>
        {user ? (
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
                defaultValue={user?.first_name || ""}
                required
                w="100%"
              />
              <TextInput
                placeholder="Last Name"
                name="lastname"
                id="lastname"
                label="Last Name"
                defaultValue={user?.last_name || ""}
                required
                w="100%"
              />
              <TextInput
                placeholder="Username"
                name="username"
                id="username"
                label="Username"
                defaultValue={user?.username || ""}
                required
                w="100%"
              />
              <TextInput
                placeholder="Email"
                name="email"
                id="email"
                label="Email"
                defaultValue={user?.email || ""}
                required
                w="100%"
              />
              <Checkbox
                label="Is Superuser"
                name="is_superuser"
                id="is_superuser"
                defaultChecked={user?.is_superuser}
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
                Edit
              </Button>
            </Flex>
          </form>
        ) : (
          "Loading..."
        )}
      </Flex>
    </Container>
  );
};

export default EditUser;
