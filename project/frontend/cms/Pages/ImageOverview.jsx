import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Container,
  Button,
  Flex,
  Grid,
  Loader,
  Popover,
} from "@mantine/core";
import Item from "../Modules/StaticPageItem";
import Cookies from "js-cookie";
import axios from "axios";
import { useDisclosure } from "@mantine/hooks";
import AddImageForm from "../Modules/AddImageForm";

const App = () => {
  const [images, setImage] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [opened, { close, open }] = useDisclosure(false);
  const navigate = useNavigate();
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;

  const getImages = () => {
    axios.get("/api/image/all/").then((response) => {
      setImage(response.data.images);
      setHasLoaded(true);
    });
  };

  useEffect(() => {
    getImages();
  }, [hasLoaded]);

  const deleteImage = (name) => {
    axios.post(`/api/image/delete/${name}/`).then((response) => {
      if (response.status == 200) {
        console.log("deleted from database");
        setHasLoaded(false);
      }
    });
  };

  return (
    <Container size="lg">
      <Container size="xs">
        <Flex
          bg="blue.2"
          gap="lg"
          justify="left"
          align="left"
          direction="column"
          wrap="wrap"
          px="xl"
          py="xl"
        >
          <Title>All Images</Title>
          <Grid columns={1} gap="sm">
            {hasLoaded ? (
              images.length != 0 ? (
                images.map((item) => {
                  return (
                    <Flex key={item.name} gap="sm">
                      <Text>{item.name}</Text>{" "}
                      <Popover withArrow shadow="md" opened={opened}>
                        <Popover.Target>
                          <Button
                            onMouseEnter={open}
                            onMouseLeave={close}
                            href={item.url}
                            compact
                            component="a"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            View
                          </Button>
                        </Popover.Target>
                        <Popover.Dropdown sx={{ pointerEvents: "none" }}>
                          <img src={item.thumbnail_url} alt={item.name} />
                        </Popover.Dropdown>
                      </Popover>
                      <Button compact>Edit</Button>
                      <Button
                        onClick={() => deleteImage(item.name)}
                        compact
                        color="red"
                      >
                        Delete
                      </Button>
                    </Flex>
                  );
                })
              ) : (
                "There are no images"
              )
            ) : (
              <Loader />
            )}
          </Grid>
        </Flex>
        <AddImageForm afterUpload={() => setHasLoaded(false)} />
      </Container>
    </Container>
  );
};
export default <App />;
