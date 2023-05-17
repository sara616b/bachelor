import { useState, useEffect } from "react";
import { Title, Container, Flex, Stack, Loader } from "@mantine/core";
import Item from "../Modules/PageItem";
import axios from "axios";
import { PageObjectProps } from "../../Utils/Foundation/Types";

const PageOverview = () => {
  const [pages, setPages] = useState<PageObjectProps[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8002/api/pages/").then((response) => {
      if (response.status === 200) {
        setPages(response.data.pages);
      }
      setHasLoaded(true);
    });
  }, []);

  return (
    <Container size="lg">
      <Container size="xs">
        <Flex
          bg="blue.1"
          gap="lg"
          justify="center"
          align="center"
          direction="column"
          wrap="wrap"
          px="xl"
          py="xl"
        >
          <Title>All Pages</Title>
          <Stack w="100%" align="stretch">
            {hasLoaded ? (
              pages.length !== 0 ? (
                pages.map((page) => {
                  return <Item key={page.page_slug} item={page} />;
                })
              ) : (
                "There are no pages"
              )
            ) : (
              <Loader />
            )}
          </Stack>
        </Flex>
      </Container>
    </Container>
  );
};

export default PageOverview;
