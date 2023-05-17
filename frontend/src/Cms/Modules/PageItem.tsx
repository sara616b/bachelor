import React from "react";
import Cookies from "js-cookie";
import { Title, Button, Flex, Grid } from "@mantine/core";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { PageObjectProps } from "../../Utils/Foundation/Types";

type Props = {
  item: PageObjectProps;
};

const PageItem = ({ item }: Props) => {
  const navigate = useNavigate();
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

  const deletePage = (
    form: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    form.preventDefault();
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios
      .delete(`http://127.0.0.1:8002/api/page/delete/${item.page_slug}`, {
        data: new FormData(),
      })
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
