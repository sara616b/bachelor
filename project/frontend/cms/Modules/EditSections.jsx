import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Title,
  Text,
  Container,
  Button,
  Flex,
  Input,
  Accordion,
  TextInput,
  Loader,
  ColorInput,
} from "@mantine/core";
import renderPage from "../../Utils/renderPage";
import Cookies from "js-cookie";
import axios from "axios";

const App = ({ section, index, children, getPageInfo }) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  const [wrapReverse, setWrapReverse] = useState(
    Boolean(section.wrap_reverse) || false,
  );
  const [backgroundColor, setBackgroundColor] = useState(
    section.background_color || "#ffffff",
  );
  const { slug } = useParams();
  console.log(wrapReverse);
  console.log(backgroundColor);

  const saveSection = () => {
    const data = new FormData();
    data.append("background_color", backgroundColor);
    data.append("wrap_reverse", wrapReverse);
    axios
      .post(`/api/page/${slug}/section/update/${index}/`, data)
      .then((response) => {
        if (response.status == 200) {
          getPageInfo();
        }
      });
  };

  return (
    <Accordion.Panel key={section.name}>
      <Flex direction="column" gap="md">
        <label htmlFor="wrapReverse">
          Wrap Reverse?
          <input
            type="checkbox"
            name="wrapReverse"
            id="wrapReverse"
            checked={wrapReverse}
            onChange={(event) => setWrapReverse(event.currentTarget.checked)}
          />
        </label>
        <ColorInput
          name="BackgroundColor"
          label="Background Color"
          id="BackgroundColor"
          value={backgroundColor}
          onChange={setBackgroundColor}
        />
        <Button onClick={() => saveSection()}>Save Section</Button>
        <Title order={5}>Columns</Title>
        {React.Children.map(children, (child) => {
          return child;
        })}
      </Flex>
    </Accordion.Panel>
  );
};

export default App;
