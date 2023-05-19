import React, { useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Title, Button, Flex, Accordion, ColorInput } from "@mantine/core";
import axios from "axios";
import { AuthenticationProps } from "../../Utils/Foundation/Types";

type Props = {
  section: {
    wrap_reverse: boolean;
    background_color: string;
    name: string;
  };
  index: number;
  children: React.ReactNode;
  getPageInfo: Function;
};

const App = ({ section, index, children, getPageInfo }: Props) => {
  const { csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();
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

  const saveSection = () => {
    const data = new FormData();
    data.append("background_color", backgroundColor);
    data.append("wrap_reverse", wrapReverse.toString());
    axios
      .put(
        `http://127.0.0.1:8002/api/pages/${slug}/section/update/${index}/`,
        data,
      )
      .then((response) => {
        if (response.status === 200) {
          getPageInfo();
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to edit sections.",
          );
          setNotificationOpen(true);
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
