import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Title,
  Text,
  Container,
  Button,
  Flex,
  Input,
  Grid,
  Accordion,
  TextInput,
  Box,
  AccordionControlProps,
  ActionIcon,
  FileInput,
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import EditComponents from "../Modules/EditPageSections/EditComponents";
import AccordionControl from "../Modules/AccordionControl";

const App = () => {
  const csrftoken = Cookies.get("csrftoken");
  const [page, setPage] = useState({});
  const [imageFile, setImageFile] = useState(null);
  console.log(page);
  const [newSectionName, setNewSectionName] = useState();
  const { slug } = useParams();

  const getPageInfo = () => {
    axios.get(`/api/page/${slug}/`).then((response) => {
      if (response.status == 200) {
        setPage(response?.data?.data);
      } else {
        console.log(response);
      }
    });
  };

  useEffect(() => {
    getPageInfo();
  }, []);

  const savePage = () => {
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    const data = new FormData();
    data.append("page", JSON.stringify(page));
    axios.post(`/api/page/${pageId}/update`, data).then((response) => {
      console.log(response);
      if (response.status == 200) {
        getPageInfo();
      }
    });
  };

  const uploadImage = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("image", imageFile);
    data.set("key", "61bf5339efd0f697d130a299c4c0cc02");
    console.log("file", imageFile);
    axios
      .post(`https://api.imgbb.com/1/upload`, data)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          console.log(response.data.data.display_url);
          return response.data.data.display_url;
        }
      })
      .then((image_url) => {
        const image_data = new FormData();
        image_data.set("image_url", image_url);
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
        axios.post(`/api/image/create/`, image_data).then((response) => {
          console.log(response);
          if (response.status == 200) {
            console.log("success");
          }
        });
      });
  };

  const deleteSection = (section) => {
    console.log("delete section", section);
  };

  return (
    <Container size="xs">
      {page ? (
        <Flex
          bg="blue.1"
          gap="lg"
          justify="center"
          align="left"
          direction="column"
          wrap="wrap"
          px="xl"
          py="xl"
        >
          <Title>
            <small>Edit Page:</small> {page.page_title}
          </Title>
          <Text>Slug: {page.page_slug}</Text>
          <Title order={4} align="left">
            Sections
          </Title>
          <Accordion chevronPosition="left">
            <Flex direction="column">
              {page?.data
                ? Object.entries(page.data.sections).map(([key, section]) => {
                    console.log(section);
                    return (
                      <div key={`${key}${section.name}`}>
                        <Accordion.Item
                          value={`${section.name}${key}`}
                          bg="white"
                          key={section.name}
                          style={{ order: key }}
                        >
                          <AccordionControl
                            deleteIcon={{
                              display: true,
                              props: {
                                onClick: () => deleteSection(section),
                              },
                            }}
                            moveUp={{
                              props: {
                                onClick: () => deleteSection(),
                              },
                            }}
                            moveDown={{
                              props: {
                                onClick: () => deleteSection(),
                              },
                            }}
                          >
                            Nr. {key} // <strong>{section.name}</strong>
                          </AccordionControl>
                          <Accordion.Panel>
                            <Flex direction="column" gap="md">
                              <Title order={5}>Columns</Title>
                              {section?.columns
                                ? Object.entries(section?.columns).map(
                                    ([key, column]) => {
                                      console.log(column);
                                      return (
                                        <Flex
                                          direction="column"
                                          gap="md"
                                          key={`${key}${column.name}`}
                                        >
                                          <Text>{key}. Column</Text>
                                          <Accordion
                                            defaultValue="customization"
                                            chevronPosition="left"
                                          >
                                            {column.components
                                              ? Object.entries(
                                                  column.components,
                                                ).map(([key, component]) => {
                                                  return (
                                                    <EditComponents
                                                      component={component}
                                                      index={key}
                                                      key={`${key}${component.name}`}
                                                    />
                                                  );
                                                })
                                              : "error"}
                                          </Accordion>
                                          <Button>Add Component</Button>
                                        </Flex>
                                      );
                                    },
                                  )
                                : "Error"}
                              <Button>Save Section</Button>
                            </Flex>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </div>
                    );
                  })
                : "No sections"}
            </Flex>
          </Accordion>
          <Flex direction="row" wrap="wrap">
            <TextInput
              placeholder="Section Name..."
              label="Section name"
              onChange={(event) => setNewSectionName(event.target.value)}
            />
            <Button
              onClick={() => {
                setPage({
                  ...page,
                  data: {
                    sections: [...page.data.sections, { name: newSectionName }],
                  },
                });
              }}
            >
              Add New Section
            </Button>
          </Flex>
          <Button onClick={() => savePage()}>SAVE PAGE</Button>
        </Flex>
      ) : (
        "Error"
      )}
      <form onSubmit={(event) => uploadImage(event)}>
        <FileInput
          name="image"
          label="Upload Image"
          id="image"
          onChange={setImageFile}
        />
        <Button type="submit">Upload Image</Button>
      </form>
    </Container>
  );
};

export default <App />;
