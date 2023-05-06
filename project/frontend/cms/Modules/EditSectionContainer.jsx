import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from "@mantine/core";
import AccordionControl from "./AccordionControl";
import Cookies from "js-cookie";
import axios from "axios";

const App = ({ children, section, sectionKey, page, getPageInfo }) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";

  const [sectionLength, setSectionLength] = useState();
  const { slug } = useParams();

  useEffect(() => {
    if (page?.data) {
      setSectionLength(Object.keys(page.data.sections).length);
    }
  }, [page]);

  const deleteSection = (index) => {
    axios
      .post(`/api/page/${slug}/section/delete/${index}/`)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          getPageInfo();
        }
      });
  };

  const moveSection = (index, direction) => {
    axios
      .post(`/api/page/${slug}/section/move/${index}/${direction}/`)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          getPageInfo();
        }
      });
  };

  return (
    <Accordion.Item
      value={`${section.name}${sectionKey}`}
      bg="white"
      key={`${sectionKey}${section.name}`}
      style={{ order: sectionKey }}
    >
      <AccordionControl
        deleteIcon={{
          display: true,
          props: {
            onClick: () => deleteSection(sectionKey),
          },
        }}
        moveUp={{
          display: sectionKey == 1 ? false : true,
          props: {
            onClick: () => moveSection(sectionKey, "up"),
          },
        }}
        moveDown={{
          display: sectionKey == sectionLength ? false : true,
          props: {
            onClick: () => moveSection(sectionKey, "down"),
          },
        }}
      >
        Nr. {sectionKey} // <strong>{section.name}</strong>
      </AccordionControl>
      {React.Children.map(children, (child) => {
        return child;
      })}
    </Accordion.Item>
  );
};

export default App;
