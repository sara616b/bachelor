import React from "react";
import Cookies from "js-cookie";
import { Title, Button, Flex, Grid } from "@mantine/core";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const PageItem = ({ item }) => {
  const navigate = useNavigate();
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

  const deletePage = (form) => {
    form.preventDefault();
    axios
      .delete(
        `http://127.0.0.1:8002/api/page/delete/${item.page_slug}`,
        { data: new FormData() },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          // redirect
          navigate("/pages/");
        }
      });
  };
  return (
    <Grid.Col span={1}>
      <Flex
        bg="blue.1"
        gap="md"
        direction="row"
        wrap="wrap"
        justify="space-between"
        px="md"
        py="md"
      >
        <Title order={3}>{item.page_title}</Title>
        <Flex gap="sm">
          <Button
            compact
            color="red"
            onClick={(event) => {
              deletePage(event);
            }}
          >
            Delete
          </Button>
          <Link to={`/pages/${item.page_slug}`}>
            <Button compact>Edit</Button>
          </Link>
        </Flex>
      </Flex>
    </Grid.Col>
  );
};

export default PageItem;
