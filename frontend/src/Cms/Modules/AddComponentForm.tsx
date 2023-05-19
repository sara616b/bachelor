import { FormEvent, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Button, Flex, Select, Popover } from "@mantine/core";
import axios from "axios";
import componentMap from "../../Utils/Foundation/ComponentsDetails";
import { AuthenticationProps } from "../../Utils/Foundation/Types";

type Props = {
  columnKey: number;
  sectionKey: number;
  getPageInfo: Function;
};

const AddComponentForm = ({ sectionKey, columnKey, getPageInfo }: Props) => {
  const { csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();
  const [componentName, setComponentName] = useState<string>("");
  const [opened, setOpened] = useState(false);
  const { slug } = useParams();

  const createComponent = (
    event: FormEvent<HTMLFormElement>,
    sectionKey: number,
    columnKey: number,
  ) => {
    event.preventDefault();
    const componentObject = JSON.stringify(componentMap[componentName].values);
    const data = new FormData();
    data.append("object_to_add", componentObject);
    data.append("section_key", sectionKey.toString());
    data.append("column_key", columnKey.toString());
    data.append("csrfmiddlewaretoken", csrftoken);

    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .put(`http://127.0.0.1:8002/api/pages/${slug}/component/0/`, data)
      .then((response) => {
        if (response.status === 200) {
          getPageInfo();
          setOpened(false);
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to add components.",
          );
          setNotificationOpen(true);
        }
      });
  };

  return (
    <Flex justify="end" direction="row" align="end">
      <Popover
        width={330}
        position="top"
        shadow="md"
        opened={opened}
        onChange={setOpened}
      >
        <Popover.Target>
          <Button
            onClick={() => setOpened(true)}
            title="Add New Component"
            mt="sm"
          >
            {opened ? "x" : "+"}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <form
            onSubmit={(event) => createComponent(event, sectionKey, columnKey)}
          >
            <Flex
              justify="center"
              direction="row"
              wrap="wrap"
              align="end"
              gap="sm"
            >
              <Select
                placeholder="Component Name..."
                label="Component name"
                id="componentname"
                name="componentname"
                maxDropdownHeight={280}
                data={Object.keys(componentMap)}
                value={componentName}
                onChange={(name) => setComponentName(name || "")}
              />
              <Button type="submit">Add</Button>
            </Flex>
          </form>
        </Popover.Dropdown>
      </Popover>
    </Flex>
  );
};

export default AddComponentForm;
