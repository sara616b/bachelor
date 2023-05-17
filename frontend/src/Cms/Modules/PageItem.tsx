import React from "react";
import Cookies from "js-cookie";
import { Text, Button, Flex } from "@mantine/core";
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
    <Flex
      direction="row"
      wrap="wrap"
      justify="space-between"
      gap="xs"
      bg="white"
      p="xs"
    >
      <Text>{item.page_title}</Text>
      <Flex gap="sm">
        <Link to={`/pages/${item.page_slug}`}>
          <Button
            compact
            variant="gradient"
            gradient={{
              from: "indigo.5",
              to: "cyan.5",
              deg: 105,
            }}
            title={`Edit ${item.page_title}`}
          >
            Edit
          </Button>
        </Link>
        <Button
          compact
          color="red"
          title={`Delete ${item.page_title}`}
          onClick={(event) => {
            deletePage(event);
          }}
        >
          Delete
        </Button>
      </Flex>
    </Flex>
  );
};

export default PageItem;
