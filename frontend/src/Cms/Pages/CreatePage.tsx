import React from "react";
import { Title, Container, Button, Flex, TextInput } from "@mantine/core";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthenticationProps } from "../../Utils/Foundation/Types";

const CreatePage = () => {
  const navigate = useNavigate();
  const { csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();

  const createPage = (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const target = form.target as typeof form.target & {
      elements: {
        title: { value: string };
        slug: { value: string };
      };
    };
    const title = target.elements.title.value;
    const slug = target.elements.slug.value;
    const data = new FormData();
    data.append("title", title);
    data.append("slug", slug);
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .post(`${process.env.REACT_APP_API_HOST}/api/pages/${slug}/`, data)
      .then((response) => {
        if (response.status === 200) {
          navigate(`/pages/${response.data.slug}`);
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to create pages.",
          );
          setNotificationOpen(true);
        }
      });
  };

  return (
    <Container size="lg">
      <Container size="xs">
        <form
          onSubmit={(e) => {
            createPage(e);
          }}
        >
          <Flex
            bg="blue.1"
            gap="md"
            justify="center"
            align="center"
            direction="column"
            wrap="wrap"
            px="xl"
            py="xl"
          >
            <Title>Create New Page</Title>
            <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
            <TextInput
              placeholder="Page Title"
              id="title"
              name="title"
              label="Page Title"
              withAsterisk
            />
            <TextInput
              placeholder="Url Slug"
              label="Url Slug"
              id="slug"
              name="slug"
              withAsterisk
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
      </Container>
    </Container>
  );
};
export default CreatePage;
