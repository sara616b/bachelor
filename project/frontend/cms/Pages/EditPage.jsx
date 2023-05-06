import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Title,
  Text,
  Container,
  Flex,
  Accordion,
  SegmentedControl,
  Loader,
} from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";
import EditComponents from "../Modules/EditComponents";
import AddComponentForm from "../Modules/AddComponentForm";
import EditColumnContainer from "../Modules/EditColumnContainer";
import AddSectionForm from "../Modules/AddSectionForm";
import EditSectionContainer from "../Modules/EditSectionContainer";
import EditPageContainer from "../Modules/EditPageContainer";
import AddImageForm from "../Modules/AddImageForm";
import AddColumnForm from "../Modules/AddColumnForm";
import EditSections from "../Modules/EditSections";

const App = () => {
  const [page, setPage] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const { slug } = useParams();

  const getPageInfo = async () => {
    const csrftoken = Cookies.get("csrftoken");
    // axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    // axios.defaults.headers.common["Content-Type"] = "application/json";
    axios
      .get(
        `/api/page/${slug}/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        if (response.status == 200) {
          setPage(response?.data?.data);
          setHasLoaded(true);
        } else {
          console.log(response);
        }
        return response;
      });
  };

  useEffect(() => {
    getPageInfo();
  }, []);
  console.log(page);

  return (
    <Container size="xs">
      {page ? (
        <EditPageContainer page={page} getPageInfo={() => getPageInfo}>
          {hasLoaded ? (
            page?.data ? (
              Object.entries(page.data.sections).map(
                ([sectionKey, section]) => {
                  return (
                    <EditSectionContainer
                      section={section}
                      sectionKey={sectionKey}
                      page={page}
                      key={`${sectionKey}${section.name}`}
                      getPageInfo={() => getPageInfo()}
                    >
                      <EditSections
                        section={section}
                        getPageInfo={() => getPageInfo()}
                        index={sectionKey}
                      >
                        {/* <Accordion.Panel>
                        <Flex direction="column" gap="md">
                          <Title order={5}>Columns</Title>
                          <AddColumnForm
                            section={section}
                            sectionKey={sectionKey}
                            getPageInfo={() => getPageInfo()}
                          /> */}
                        {section?.columns
                          ? Object.entries(section?.columns).map(
                              ([columnKey, column]) => {
                                return (
                                  <EditColumnContainer
                                    key={`${columnKey}${column.name}`}
                                    column={column}
                                    columnKey={columnKey}
                                  >
                                    {column.components &&
                                    Object.entries(column.components).length !==
                                      0
                                      ? Object.entries(column.components).map(
                                          ([key, component]) => {
                                            return (
                                              <EditComponents
                                                component={component}
                                                index={key}
                                                key={`${key}${component.name}${page}`}
                                                sectionKey={sectionKey}
                                                columnKey={columnKey}
                                                getPageInfo={() =>
                                                  getPageInfo()
                                                }
                                                page={page}
                                              />
                                            );
                                          },
                                        )
                                      : "No Components"}
                                    <AddComponentForm
                                      sectionKey={sectionKey}
                                      columnKey={columnKey}
                                      getPageInfo={() => getPageInfo()}
                                    />
                                  </EditColumnContainer>
                                );
                              },
                            )
                          : "No Columns"}
                      </EditSections>
                    </EditSectionContainer>
                  );
                },
              )
            ) : (
              "No sections"
            )
          ) : (
            <Loader />
          )}
          <AddSectionForm getPageInfo={() => getPageInfo()} />
        </EditPageContainer>
      ) : (
        <Loader />
      )}
      <AddImageForm />
    </Container>
  );
};

export default <App />;
