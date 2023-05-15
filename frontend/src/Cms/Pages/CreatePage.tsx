import React from "react";
import { Title, Container, Button, Flex, TextInput } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePage = () => {
  const navigate = useNavigate();
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.withCredentials = true;

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
    axios
      .post("http://127.0.0.1:8002/api/page/create/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          navigate(`/page/edit/${response.data.page_slug}`);
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
