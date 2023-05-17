import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from "@mantine/core";
import AccordionControl from "./AccordionControl";
import Cookies from "js-cookie";
import axios from "axios";
import { PageObjectProps } from "../../Utils/Foundation/Types";

type Props = {
  children: React.ReactNode;
  section: {
    name: string;
  };
  sectionKey: number;
  page: PageObjectProps;
  getPageInfo: Function;
};

const App = ({ children, section, sectionKey, page, getPageInfo }: Props) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;

  const [sectionLength, setSectionLength] = useState<number | undefined>();
  const { slug } = useParams();

  useEffect(() => {
    if (page?.data) {
      setSectionLength(Object.keys(page.data.sections).length);
    }
  }, [page]);

  const deleteSection = (index: number) => {
    axios
      .post(`http://127.0.0.1:8002/api/page/${slug}/section/delete/${index}/`)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          getPageInfo();
        }
      });
  };

  const moveSection = (index: number, direction: string) => {
    axios
      .post(
        `http://127.0.0.1:8002/api/page/${slug}/section/move/${index}/${direction}/`,
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
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
          display: sectionKey === 1 ? false : true,
          props: {
            onClick: () => moveSection(sectionKey, "up"),
          },
        }}
        moveDown={{
          display: sectionKey === sectionLength ? false : true,
          props: {
            onClick: () => moveSection(sectionKey, "down"),
          },
        }}
      >
        Nr. {sectionKey} / <strong>{section.name}</strong>
      </AccordionControl>
      {React.Children.map(children, (child) => {
        return child;
      })}
    </Accordion.Item>
  );
};

export default App;
