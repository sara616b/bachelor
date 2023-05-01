import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Container,
  Button,
  Flex,
  Input,
  Accordion,
  TextInput,
  Textarea,
  ColorInput,
  FileInput,
  SegmentedControl,
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import AccordionControl from "../AccordionControl";

const App = ({ component, index }) => {
  const ComponentCustomizations = {
    Title: {
      customization: {
        text: {
          type: "text",
          name: "Title Text",
        },
        title_color: {
          type: "color",
          name: "Title Color",
        },
        alignment: {
          type: "alignment",
          name: "Title Alignment",
        },
      },
    },
    Text: {
      customization: {
        text: {
          type: "textarea",
          name: "Text Text",
        },
        text_color: {
          type: "color",
          name: "Text Color",
        },
      },
    },
    Image: {
      customization: {
        link: {
          type: "upload",
          name: "Upload Your Image",
        },
      },
    },
  };
  const deleteComponent = () => {
    console.log("delete component");
  };
  return (
    <Accordion.Item value={component.name} bg="blue.1" key={component.name}>
      <AccordionControl
        deleteIcon={{
          display: true,
          props: {
            onClick: () => deleteComponent(),
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
        {component.name}
      </AccordionControl>
      <Accordion.Panel>
        <Flex direction="column" gap="md" bg="white" px="md" py="md">
          {ComponentCustomizations[component.name]
            ? Object.entries(
                ComponentCustomizations[component.name].customization,
              ).map(([key, field]) => {
                switch (field.type) {
                  case "textarea":
                    return (
                      <Textarea
                        label={`${field.name}: `}
                        name={field.name}
                        id={field.name}
                        defaultValue={component[key]}
                        key={key}
                      />
                    );
                  case "text":
                    return (
                      <TextInput
                        name={field.name}
                        label={`${field.name}: `}
                        id={field.name}
                        defaultValue={component[key]}
                        key={key}
                      />
                    );
                  case "color":
                    return (
                      <ColorInput
                        name={field.name}
                        label={`${field.name}: `}
                        id={field.name}
                        defaultValue={component[key]}
                        key={key}
                      />
                    );
                  case "upload":
                    return (
                      <FileInput
                        name={field.name}
                        label={`${field.name}: `}
                        id={field.name}
                        key={key}
                      />
                    );
                  case "alignment":
                    return (
                      <div key={key}>
                        <Text>{`${field.name}: `}</Text>
                        <SegmentedControl
                          defaultValue={component[key]}
                          data={[
                            { label: "Left", value: "left" },
                            { label: "Center", value: "center" },
                            { label: "Right", value: "right" },
                          ]}
                          fullWidth
                          transitionDuration={200}
                          transitionTimingFunction="ease-out"
                        />
                      </div>
                    );
                  default:
                    break;
                }
              })
            : "error"}
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default App;
