import { useState, useEffect } from "react";
import {
  Title,
  Container,
  Text,
  Flex,
  Stack,
  Loader,
  Button,
} from "@mantine/core";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import {
  AuthenticationProps,
  PageObjectProps,
} from "../../Utils/Foundation/Types";

const PageOverview = () => {
  const [pages, setPages] = useState<PageObjectProps[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isLoggedIn, csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();

  useEffect(() => {
    if (isLoggedIn === undefined || !isLoggedIn) return;
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/pages/`)
      .then((response) => {
        if (response.status === 200) {
          setPages(response.data.pages);
        }
        setHasLoaded(true);
      });
  }, [isLoggedIn, hasLoaded]);

  const deletePage = (
    form: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    page: PageObjectProps,
  ) => {
    form.preventDefault();
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .delete(`${process.env.REACT_APP_API_HOST}/api/pages/${page.slug}`)
      .then(() => {
        setHasLoaded(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to delete pages.",
          );
          setNotificationOpen(true);
        }
      });
  };

  return (
    <Container size="lg">
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
            <Title>All Pages</Title>
            <Link to="/pages/create/">
              <Button
                variant="gradient"
                gradient={{ from: "indigo.5", to: "cyan.5", deg: 105 }}
              >
                Create New Page
              </Button>
            </Link>
          </Flex>
          <Stack w="100%" align="stretch">
            {hasLoaded ? (
              pages.length !== 0 ? (
                pages
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((page) => {
                    return (
                      <Flex
                        key={page.slug}
                        direction="row"
                        wrap="wrap"
                        justify="space-between"
                        gap="xs"
                        bg="white"
                        p="xs"
                      >
                        <Text>{page.title}</Text>
                        <Flex gap="sm">
                          <Link to={`/pages/${page.slug}`}>
                            <Button
                              compact
                              variant="gradient"
                              gradient={{
                                from: "indigo.5",
                                to: "cyan.5",
                                deg: 105,
                              }}
                              title={`Edit ${page.title}`}
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            compact
                            color="red"
                            title={`Delete ${page.title}`}
                            onClick={(event) => {
                              deletePage(event, page);
                            }}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </Flex>
                    );
                  })
              ) : (
                "There are no pages"
              )
            ) : (
              <Loader />
            )}
          </Stack>
        </Flex>
      </Container>
    </Container>
  );
};

export default PageOverview;
