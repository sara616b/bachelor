import { useState, useEffect, FormEvent } from "react";
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
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import AccordionControl from "./AccordionControl";
import ComponentsDetails from "../../Utils/Foundation/ComponentsDetails";
import { PageObjectProps } from "../../Utils/Foundation/Types";

type Props = {
  component: {
    name: string;
    [index: string]: string | boolean;
  };
  index: number;
  sectionKey: number;
  columnKey: number;
  getPageInfo: Function;
  page: PageObjectProps;
};

const App = ({
  component,
  index,
  sectionKey,
  columnKey,
  getPageInfo,
  page,
}: Props) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
  const { slug } = useParams();
  const [componentLength, setComponentLength] = useState<number | undefined>(
    undefined,
  );
  const [alignment, setAlignment] = useState(component?.alignment || undefined);
  const [booleans, setBooleans] = useState<{ [index: string]: boolean }>({
    bold: Boolean(component?.bold) || false,
  });
  useEffect(() => {
    if (page?.data) {
      setComponentLength(
        Object.keys(
          page.data.sections[sectionKey].columns[columnKey].components,
        ).length,
      );
    }
  }, [page, sectionKey, columnKey]);

  const deleteComponent = (index: number) => {
    const data = new FormData();
    data.append("section_key", sectionKey.toString());
    data.append("column_key", columnKey.toString());
    axios
      .post(
        `http://127.0.0.1:8002/api/page/${slug}/component/delete/${index}/`,
        data,
      )
      .then((response) => {
        if (response.status === 200) {
          getPageInfo();
        }
      });
  };

  const moveComponent = (index: number, direction: string) => {
    const data = new FormData();
    data.append("section_key", sectionKey.toString());
    data.append("column_key", columnKey.toString());
    axios
      .post(
        `http://127.0.0.1:8002/api/page/${slug}/component/move/${index}/${direction}/`,
        data,
      )
      .then((response) => {
        if (response.status === 200) {
          getPageInfo();
        }
      });
  };

  const saveComponent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      elements: {
        [index: string]: { value: string };
      };
    };
    const data = new FormData();
    data.append("section_key", sectionKey.toString());
    data.append("column_key", columnKey.toString());
    const newValues: {
      [index: string]: boolean | string | undefined;
    } = {};
    newValues["name"] = component.name;

    Object.entries(ComponentsDetails[component.name].customization).forEach(
      ([key]) => {
        if (key === "alignment") {
          newValues[key] = alignment;
        } else if (booleans.hasOwnProperty(key)) {
          newValues[key] = booleans[key];
        } else {
          newValues[key] = target.elements[key].value;
        }
      },
    );
    data.append("object_to_add", JSON.stringify(newValues));
    axios
      .post(
        `http://127.0.0.1:8002/api/page/${slug}/component/update/${index}/`,
        data,
      )
      .then((response) => {
        if (response.status === 200) {
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
          display: index === 1 ? false : true,
          props: {
            onClick: () => moveComponent(index, "up"),
          },
        }}
        moveDown={{
          display: index === componentLength ? false : true,
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
                let element = <></>;
                switch (field.type) {
                  case "textarea":
                    element = (
                      <Textarea
                        label={`${field.name}: `}
                        name={key}
                        id={key}
                        defaultValue={String(
                          component[key] ||
                            ComponentsDetails[component.name].values[key],
                        )}
                        key={`${key}${component}${component[key]}`}
                      />
                    );
                    break;
                  case "text":
                    element = (
                      <TextInput
                        name={key}
                        label={`${field.name}: `}
                        id={key}
                        defaultValue={component[key].toString()}
                        key={`${key}${component}${component[key]}`}
                      />
                    );
                    break;
                  case "color":
                    element = (
                      <ColorInput
                        name={key}
                        label={`${field.name}: `}
                        id={key}
                        defaultValue={component[key].toString()}
                        key={`${key}${component}${component[key]}`}
                      />
                    );
                    break;
                  case "upload":
                    element = (
                      <FileInput
                        name={key}
                        label={`${field.name}: `}
                        id={key}
                        key={`${key}${component}${component[key]}`}
                      />
                    );
                    break;
                  case "boolean":
                    element = (
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
                    break;
                  case "alignment":
                    element = (
                      <div key={`${key}${component}${component[key]}`}>
                        <Text>{`${field.name}: `}</Text>
                        <SegmentedControl
                          defaultValue={component?.[key].toString()}
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
                    break;
                  default:
                    break;
                }
                return element;
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
