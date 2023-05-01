import React, { useState, useEffect } from "react";
import { Title, Text, Container, Button, Flex, Grid } from "@mantine/core";
import Item from "../Modules/StaticPageItem";
import axios from "axios";

const App = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    axios.get("/api/page/all/").then((response) => {
      setPages(response.data.pages);
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
          <Title>All Pages</Title>
          <Grid columns={1}>
            {pages.length != 0
              ? pages.map((item) => {
                  return <Item key={item.page_slug} item={item} />;
                })
              : "No pages"}
          </Grid>
        </Flex>
      </Container>
    </Container>
  );
};
export default <App />;
