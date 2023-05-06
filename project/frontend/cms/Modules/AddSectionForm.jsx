import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Flex, TextInput, Divider } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

const App = ({ getPageInfo }) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  const { slug } = useParams();

  const createSection = (event) => {
    event.preventDefault();
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    const sectionname = event.target.elements.sectionname.value;
    const sectionObject = JSON.stringify({
      name: sectionname,
      columns: {
        1: {
          components: {},
        },
      },
    });
    const data = new FormData();
    data.append("object_to_add", sectionObject);
    axios
      .post(`/api/page/${slug}/section/create/${sectionname}/`, data)
      .then((response) => {
        if (response.status == 200) {
          getPageInfo();
        }
      });
  };

  return (
    <form onSubmit={(event) => createSection(event)}>
      <Divider
        label="New Section"
        labelPosition="center"
        color="black"
        my="sm"
      />
      <Flex direction="row" wrap="wrap" align="end" gap="sm">
        <TextInput
          placeholder="Section Name..."
          id="sectionname"
          name="sectionname"
          required
          style={{
            flexGrow: "1",
          }}
        />
        <Button type="submit">Add New Section</Button>
      </Flex>
    </form>
  );
};

export default App;
