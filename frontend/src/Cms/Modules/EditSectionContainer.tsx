import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Accordion } from "@mantine/core";
import AccordionControl from "./AccordionControl";
import axios from "axios";
import {
  AuthenticationProps,
  PageObjectProps,
} from "../../Utils/Foundation/Types";

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
  const { isLoggedIn, csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();

  const [sectionLength, setSectionLength] = useState<number | undefined>();
  const { slug } = useParams();

  useEffect(() => {
    if (isLoggedIn === undefined || !isLoggedIn) return;
    if (page?.data) {
      setSectionLength(Object.keys(page.data.sections).length);
    }
  }, [page, isLoggedIn]);

  const deleteSection = (index: number) => {
    const data = new FormData();
    data.append("csrfmiddlewaretoken", csrftoken);
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .delete(`http://127.0.0.1:8002/api/pages/${slug}/section/${index}/`, {
        data,
      })
      .then((response) => {
        if (response.status === 200) {
          getPageInfo();
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to delete sections.",
          );
          setNotificationOpen(true);
        }
      });
  };

  const moveSection = (index: number, direction: string) => {
    const data = new FormData();
    data.append("csrfmiddlewaretoken", csrftoken);
    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .put(
        `http://127.0.0.1:8002/api/pages/${slug}/section/move/${index}/${direction}/`,
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
            "Permission denied! You're not allowed to move sections.",
          );
          setNotificationOpen(true);
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
