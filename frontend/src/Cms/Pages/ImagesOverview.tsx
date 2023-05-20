import { useState, useEffect } from "react";
import {
  Title,
  Text,
  Container,
  Flex,
  Stack,
  Loader,
  Image,
} from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import AddImageForm from "../Modules/AddImageForm";
import { AuthenticationProps } from "../../Utils/Foundation/Types";

const ImagesOverview = () => {
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { isLoggedIn } = useOutletContext<AuthenticationProps>();

  useEffect(() => {
    if (isLoggedIn === undefined || !isLoggedIn) return;
    axios
      .get(`${process.env.REACT_APP_API_HOST}/api/image/`)
      .then((response) => {
        if (response.status === 200) {
          setImages(response.data.images);
        }
        setHasLoaded(true);
      });
  }, [hasLoaded, isLoggedIn]);

  return (
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
        <Flex
          bg="blue.1"
          gap="lg"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
          px="xl"
          py="xl"
        >
          <Title>Images</Title>
        </Flex>

        <Stack w="100%" align="stretch">
          {hasLoaded ? (
            images.length !== 0 ? (
              images
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((image) => {
                  return (
                    <Flex
                      key={image.name}
                      direction="row"
                      wrap="wrap"
                      justify="space-between"
                      gap="xs"
                      bg="white"
                      p="xs"
                      w="100%"
                    >
                      <Image
                        width={50}
                        mx="auto"
                        radius="md"
                        src={image.url}
                        alt="Random image"
                        style={{
                          flexShrink: "1",
                        }}
                      />
                      <Flex
                        direction="column"
                        style={{
                          flexGrow: "1",
                        }}
                      >
                        <Text fw={700}>{image.name}</Text>
                        <Text>{image.url}</Text>
                      </Flex>
                    </Flex>
                  );
                })
            ) : (
              "There are no users"
            )
          ) : (
            <Loader />
          )}
        </Stack>
      </Flex>
      <AddImageForm onSuccess={() => setHasLoaded(false)} />
    </Container>
  );
};

export default ImagesOverview;
