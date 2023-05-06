import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Text,
  Button,
  Flex,
  Accordion,
  TextInput,
  Textarea,
  ColorInput,
  FileInput,
  SegmentedControl,
  Loader,
  Chip,
  Switch,
  Select,
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import AccordionControl from "./AccordionControl";
import ComponentsDetails from "../../Utils/Foundation/ComponentsDetails";

const App = ({
  component,
  index,
  sectionKey,
  columnKey,
  getPageInfo,
  page,
}) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  const { slug } = useParams();
  const [componentLength, setComponentLength] = useState();
  const [alignment, setAlignment] = useState(component?.alignment || undefined);
  const [booleans, setBooleans] = useState({
    bold: component?.bold || false,
  });
  const [images, setImages] = useState(undefined);
  const [selectedImage, setSelectedImage] = useState(undefined);

  console.log(images);

  useEffect(() => {
    if (page?.data) {
      setComponentLength(
        Object.keys(
          page.data.sections[sectionKey].columns[columnKey].components,
        ).length,
      );
      if (component.name === "Image") {
        setSelectedImage(component.link);
      }
    }
  }, [page]);

  const getImages = () => {
    const csrftoken = Cookies.get("csrftoken");
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.get(`/api/image/all/`).then((response) => {
      if (response.status == 200) {
        console.log(response);
        setImages(response.data.images);
      }
    });
  };

  const deleteComponent = (index) => {
    const data = new FormData();
    data.append("section_key", sectionKey);
    data.append("column_key", columnKey);
    axios
      .post(`/api/page/${slug}/component/delete/${index}/`, data)
      .then((response) => {
        if (response.status == 200) {
          getPageInfo();
        }
      });
  };

  const moveComponent = (index, direction) => {
    const data = new FormData();
    data.append("section_key", sectionKey);
    data.append("column_key", columnKey);
    axios
      .post(`/api/page/${slug}/component/move/${index}/${direction}/`, data)
      .then((response) => {
        if (response.status == 200) {
          getPageInfo();
        }
      });
  };

  const saveComponent = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("section_key", sectionKey);
    data.append("column_key", columnKey);
    const newValues = {};
    newValues["name"] = component.name;

    Object.entries(ComponentsDetails[component.name].customization).map(
      ([key]) => {
        if ((component.name = "Image" && key === "link")) {
          newValues[key] = selectedImage;
        } else if (key === "alignment") {
          newValues[key] = alignment;
        } else if (booleans.hasOwnProperty(key)) {
          newValues[key] = booleans[key];
        } else {
          newValues[key] = event.target.elements[key].value;
        }
      },
    );
    data.append("object_to_add", JSON.stringify(newValues));
    axios
      .post(`/api/page/${slug}/component/update/${index}/`, data)
      .then((response) => {
        if (response.status == 200) {
          getPageInfo();
        }
      });
  };

  return (
    <Accordion.Item value={`${component.name}${index}`} bg="blue.1">
      <AccordionControl
        deleteIcon={{
          display: true,
          props: {
            onClick: () => deleteComponent(index),
          },
        }}
        moveUp={{
          display: index == 1 ? false : true,
          props: {
            onClick: () => moveComponent(index, "up"),
          },
        }}
        moveDown={{
          display: index == componentLength ? false : true,
          props: {
            onClick: () => moveComponent(index, "down"),
          },
        }}
      >
        {component.name}
      </AccordionControl>
      <Accordion.Panel>
        <form onSubmit={(event) => saveComponent(event)}>
          <Flex direction="column" gap="md" bg="white" px="md" py="md">
            {ComponentsDetails[component.name] ? (
              Object.entries(
                ComponentsDetails[component.name].customization,
              ).map(([key, field]) => {
                switch (field.type) {
                  case "textarea":
                    return (
                      <Textarea
                        label={`${field.name}: `}
                        name={key}
                        id={key}
                        defaultValue={
                          component[key] ||
                          ComponentsDetails[component.name].values[key]
                        }
                        key={`${key}${component}${component[key]}`}
                      />
                    );
                  case "text":
                    return (
                      <TextInput
                        name={key}
                        label={`${field.name}: `}
                        id={key}
                        defaultValue={component[key]}
                        key={`${key}${component}${component[key]}`}
                      />
                    );
                  case "color":
                    return (
                      <ColorInput
                        name={key}
                        label={`${field.name}: `}
                        id={key}
                        defaultValue={component[key]}
                        key={`${key}${component}${component[key]}`}
                      />
                    );
                  case "image":
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
                      <Select
                        name={key}
                        label={`${field.name}: `}
                        id={key}
                        defaultValue={component[key]}
                        key={`${key}${component}${component[key]}`}
                        data={imageValues}
                        onChange={setSelectedImage}
                      />
                    );
                  case "boolean":
                    return (
                      <label
                        htmlFor={key}
                        key={`${key}${component}${component[key]}${booleans?.[key]}${booleans}`}
                      >
                        {`${field.name}`}
                        <input
                          type="checkbox"
                          name={key}
                          id={key}
                          checked={booleans?.[key]}
                          onChange={(event) =>
                            setBooleans({
                              ...booleans,
                              [key]: event.currentTarget.checked,
                            })
                          }
                        />
                      </label>
                    );
                  case "alignment":
                    return (
                      <div key={`${key}${component}${component[key]}`}>
                        <Text>{`${field.name}: `}</Text>
                        <SegmentedControl
                          defaultValue={component?.[key]}
                          data={[
                            { label: "Left", value: "left" },
                            { label: "Center", value: "center" },
                            { label: "Right", value: "right" },
                          ]}
                          fullWidth
                          transitionDuration={200}
                          transitionTimingFunction="ease-out"
                          onChange={setAlignment}
                        />
                      </div>
                    );
                  default:
                    break;
                }
              })
            ) : (
              <Loader />
            )}
            <Button type="submit">Save {component.name}</Button>
          </Flex>
        </form>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default App;
