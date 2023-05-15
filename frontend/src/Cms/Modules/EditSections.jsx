import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Title, Button, Flex, Accordion, ColorInput } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

const App = ({ section, index, children, getPageInfo }) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
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
        if (response.status === 200) {
          getPageInfo();
        }
      });
  };

  return (
    <Accordion.Panel key={section.name}>
      <Flex direction="column" gap="md">
        <label
          htmlFor="wrapReverse"
          title="The order of the columns on mobile as they are listed here. When the viewport width expands the columns will lay beside eachother with the first on the left unless 'Wrap-reverse' is active in which case the second column will be on the left."
        >
          Wrap Reverse?
          <span>
            <img src="/info.svg" alt="Information icon" />
          </span>
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
