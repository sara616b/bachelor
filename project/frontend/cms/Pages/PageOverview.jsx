import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Title,
  Text,
  Container,
  Button,
  Flex,
  Grid,
  Loader,
} from "@mantine/core";
import Item from "../Modules/StaticPageItem";
import axios from "axios";

const App = () => {
  const [pages, setPages] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    axios.get("/api/page/all/").then((response) => {
      setPages(response.data.pages);
      setHasLoaded(true);
    });
  }, []);

  return (
    <Container size="lg">
      <Container size="xs">
        <Flex
          bg="blue.2"
          gap="lg"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          px="xl"
          py="xl"
        >
          <Flex direction="row" gap="sm" justify="center" align="center">
            <Title>All Pages</Title>
            <Link to="/page/create/">
              <Button>Create New Page</Button>
            </Link>
          </Flex>
          <Grid columns={1}>
            {hasLoaded ? (
              pages.length != 0 ? (
                pages.map((item) => {
                  return <Item key={item.page_slug} item={item} />;
                })
              ) : (
                "There are no pages"
              )
            ) : (
              <Loader />
            )}
          </Grid>
        </Flex>
      </Container>
    </Container>
  );
};
export default <App />;
