import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Container,
  Button,
  Flex,
  Stack,
  Loader,
} from "@mantine/core";
import { Link, useOutletContext } from "react-router-dom";
import axios from "axios";
import {
  AuthenticationProps,
  UserObjectProps,
} from "../../Utils/Foundation/Types";

const UsersOverview = () => {
  const [users, setUsers] = useState<UserObjectProps[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isLoggedIn, csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();

  useEffect(() => {
    if (isLoggedIn === undefined || !isLoggedIn) return;
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/users/`)
      .then((response) => {
        if (response.status === 200) {
          setUsers(response.data.users);
        }
        setHasLoaded(true);
      });
  }, [hasLoaded, isLoggedIn]);

  const deleteUser = (username: string) => {
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .delete(`${process.env.REACT_APP_API_HOST}/api/users/${username}/`)
      .then((response) => {
        if (response.status === 200) {
          setHasLoaded(false);
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to delete users.",
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
          <Title>Users</Title>
          <Link to="/users/create/">
            <Button
              variant="gradient"
              gradient={{ from: "indigo.5", to: "cyan.5", deg: 105 }}
            >
              Create New User
            </Button>
          </Link>
        </Flex>

        <Stack w="100%" align="stretch">
          {hasLoaded ? (
            users.length !== 0 ? (
              users
                .sort((a, b) => a.first_name.localeCompare(b.first_name))
                .map((user) => {
                  return (
                    <Flex
                      key={user.username}
                      direction="row"
                      wrap="wrap"
                      justify="space-between"
                      gap="xs"
                      bg="white"
                      p="xs"
                    >
                      <Text>
                        {user.first_name} {user.last_name} ({user.username})
                      </Text>
                      <Flex
                        key={user.username}
                        direction="row"
                        wrap="wrap"
                        gap="xs"
                      >
                        <Link to={`/users/${user.username}`}>
                          <Button
                            variant="gradient"
                            compact
                            gradient={{
                              from: "indigo.5",
                              to: "cyan.5",
                              deg: 105,
                            }}
                            title={`Edit ${user.username}`}
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          compact
                          color="red"
                          title={`Delete ${user.username}`}
                          onClick={() => deleteUser(user.username)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Flex>
                  );
                })
            ) : (
              "There are no users"
            )
          ) : (
            <Loader />
          )}
        </Stack>
      </Flex>
    </Container>
  );
};

export default UsersOverview;
