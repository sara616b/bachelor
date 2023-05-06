import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Flex, Select, Popover } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import componentMap from "../../Utils/Foundation/ComponentsDetails";

const App = ({ sectionKey, columnKey, getPageInfo }) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  const [componentName, setComponentName] = useState(null);
  const [opened, setOpened] = useState(false);
  const { slug } = useParams();

  const createComponent = (event, sectionKey, columnKey) => {
    event.preventDefault();
    const componentObject = JSON.stringify(componentMap[componentName].values);
    const data = new FormData();
    data.append("object_to_add", componentObject);
    data.append("section_key", sectionKey);
    data.append("column_key", columnKey);
    axios
      .post(`/api/page/${slug}/component/create/${componentName}/`, data)
      .then((response) => {
        if (response.status == 200) {
          getPageInfo();
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
          <Button onClick={setOpened} title="Add New Component" mt="sm">
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
                onChange={setComponentName}
              />
              <Button type="submit">Add</Button>
            </Flex>
          </form>
        </Popover.Dropdown>
      </Popover>
    </Flex>
  );
};

export default App;
