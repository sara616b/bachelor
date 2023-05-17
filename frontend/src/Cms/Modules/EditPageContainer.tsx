import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Flex,
  Accordion,
  Divider,
  Checkbox,
  TextInput,
  Button,
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import { PageObjectProps } from "../../Utils/Foundation/Types";

type Props = {
  children: React.ReactNode;
  page: PageObjectProps;
  getPageInfo: Function;
};

const App = ({ children, page, getPageInfo }: Props) => {
  const [online, setOnline] = useState(page.online);
  useEffect(() => {
    setOnline(page.online);
  }, [page]);
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
  const { slug } = useParams();
  const navigate = useNavigate();

  const updatePage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      elements: {
        [index: string]: { value: string };
      };
    };
    const data = new FormData();
    data.append("title", target.elements.title.value);
    data.append("slug", target.elements.slug.value);
    data.append("thumbnail", target.elements.thumbnail.value);
    data.append("online", online.toString());
    axios.post(`/api/page/update/${slug}/`, data).then((response) => {
      if (response.status === 200) {
        if (response.data.page_slug !== slug) {
          navigate(
            `http://127.0.0.1:8002/page/edit/${response.data.page_slug}`,
          );
        }
        getPageInfo();
      }
    });
  };

  return (
    <Flex
      bg="blue.1"
      gap="sm"
      justify="center"
      align="left"
      direction="column"
      wrap="wrap"
      px="xl"
      pt="sm"
      pb="sm"
    >
      <Divider label="Edit Page" labelPosition="center" color="black" />
      <form onSubmit={(event) => updatePage(event)}>
        <Flex
          bg="blue.1"
          gap="sm"
          justify="center"
          align="left"
          direction="column"
          wrap="wrap"
        >
          <TextInput
            id="title"
            name="title"
            defaultValue={page.title}
            label="Title: "
            size="lg"
          />
          <TextInput
            id="slug"
            name="slug"
            defaultValue={page.slug}
            label="Slug: "
          />
          <Checkbox
            id="online"
            name="online"
            label="Is online"
            checked={online}
            onChange={(event) => setOnline(event.currentTarget.checked)}
          />
          <TextInput
            id="thumbnail"
            name="thumbnail"
            defaultValue={page.thumbnail_url}
            label="Thumbnail Image: "
          />
          <Button type="submit">Update Page</Button>
        </Flex>
      </form>
      <Divider label="Sections" labelPosition="center" color="black" />
      {/* @ts-ignore */}
      <Accordion chevronPosition="left" variant="separated" gap="sm">
        {React.Children.map(children, (child) => {
          return child;
        })}
      </Accordion>
    </Flex>
  );
};

export default App;
