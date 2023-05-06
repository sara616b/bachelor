import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Flex,
  Accordion,
  Divider,
  Checkbox,
  TextInput,
  Button,
  Select,
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

const App = ({ children, page, getPageInfo }) => {
  const [online, setOnline] = useState(page.online);
  const [images, setImages] = useState(undefined);
  const [selectedImage, setSelectedImage] = useState(undefined);
  useEffect(() => {
    setOnline(page.online);
    setSelectedImage(page.thumbnail_url);
  }, [page]);
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  const { slug } = useParams();
  const navigate = useNavigate();

  const getImages = () => {
    axios.get(`/api/image/all/`).then((response) => {
      if (response.status == 200) {
        setImages(response.data.images);
      }
    });
  };

  const updatePage = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", event.target.elements.title.value);
    data.append("slug", event.target.elements.slug.value);
    data.append("thumbnail", selectedImage);
    data.append("online", online);
    axios.post(`/api/page/update/${slug}/`, data).then((response) => {
      if (response.status == 200) {
        if (response.data.page_slug !== slug) {
          navigate(`/page/edit/${response.data.page_slug}`);
        }
        getPageInfo();
      }
    });
  };
  let imageValues = [];
  if (images == undefined) {
    getImages();
  } else {
    imageValues = images.map((image) => {
      return {
        value: image.url,
        label: image.name,
      };
    });
  }

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
          <Select
            label="Thumbnail Image: "
            id="thumbnail"
            name="thumbnail"
            defaultValue={selectedImage}
            data={imageValues}
            onChange={setSelectedImage}
          />
          <Button type="submit">Update Page</Button>
        </Flex>
      </form>

      <Divider label="Sections" labelPosition="center" color="black" />
      <Accordion chevronPosition="left" variant="separated" gap="sm">
        {React.Children.map(children, (child) => {
          return child;
        })}
      </Accordion>
    </Flex>
  );
};

export default App;
