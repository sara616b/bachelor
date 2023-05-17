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
import { Link } from "react-router-dom";
import axios from "axios";
import { UserObjectProps } from "../../Utils/Foundation/Types";

const UsersOverview = () => {
  const [users, setUsers] = useState<UserObjectProps[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8002/api/users/").then((response) => {
      setUsers(response.data.users);
      setHasLoaded(true);
    });
  }, []);

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

        <Stack>
          {hasLoaded ? (
            users.length !== 0 ? (
              users.map((user) => {
                return (
                  <Text key={user.username}>
                    {user.first_name} {user.last_name} ({user.username})
                    <Link to={`/users/${user.username}`}>
                      <Button
                        variant="gradient"
                        gradient={{ from: "indigo.5", to: "cyan.5", deg: 105 }}
                        mx="xl"
                      >
                        Edit {user.username}
                      </Button>
                    </Link>
                  </Text>
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
