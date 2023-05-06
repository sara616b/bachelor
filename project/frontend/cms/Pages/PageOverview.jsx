import React, { useState, useEffect } from "react";
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
      console.log(response);
      setPages(response.data.pages);
      setHasLoaded(true);
    });
  }, []);

  console.log("hasLoaded", hasLoaded);
  console.log("pages", pages);

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
          <Title>All Pages</Title>
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
