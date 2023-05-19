import React, { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Container, Loader } from "@mantine/core";
import axios from "axios";
import EditComponents from "../Modules/EditComponents";
import AddComponentForm from "../Modules/AddComponentForm";
import EditColumnContainer from "../Modules/EditColumnContainer";
import AddSectionForm from "../Modules/AddSectionForm";
import EditSectionContainer from "../Modules/EditSectionContainer";
import EditPageContainer from "../Modules/EditPageContainer";
import AddImageForm from "../Modules/AddImageForm";
import EditSections from "../Modules/EditSections";
import {
  AuthenticationProps,
  PageObjectProps,
} from "../../Utils/Foundation/Types";
import AddColumnForm from "../Modules/AddColumnForm";

const EditPage = () => {
  const [page, setPage] = useState<PageObjectProps | undefined>();
  const [hasLoaded, setHasLoaded] = useState(false);
  const { slug } = useParams();
  const { isLoggedIn, csrftoken } = useOutletContext<AuthenticationProps>();

  const getPageInfo = React.useCallback(async () => {
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .get(`http://127.0.0.1:8002/api/pages/${slug}/`, {})
      .then((response) => {
        if (response.status === 200) {
          setPage(response?.data?.data);
          setHasLoaded(true);
        }
      });
  }, [slug, csrftoken]);

  useEffect(() => {
    if (isLoggedIn === undefined || !isLoggedIn) return;
    getPageInfo();
  }, [getPageInfo, isLoggedIn]);

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
                      sectionKey={Number(sectionKey)}
                      page={page}
                      key={`${sectionKey}${section.name}`}
                      getPageInfo={() => getPageInfo()}
                    >
                      <EditSections
                        section={section}
                        getPageInfo={() => getPageInfo()}
                        index={Number(sectionKey)}
                      >
                        <AddColumnForm
                          section={section}
                          getPageInfo={() => getPageInfo()}
                          sectionKey={Number(sectionKey)}
                        />
                        {section?.columns
                          ? Object.entries(section?.columns).map(
                              ([columnKey, column]) => {
                                return (
                                  <EditColumnContainer
                                    key={`${columnKey}${column.name}`}
                                    column={column}
                                    columnKey={Number(columnKey)}
                                  >
                                    {column.components &&
                                    Object.entries(column.components).length !==
                                      0
                                      ? Object.entries(column.components).map(
                                          ([key, component]) => {
                                            return (
                                              <EditComponents
                                                component={component}
                                                index={Number(key)}
                                                key={`${key}${component.name}${page}`}
                                                sectionKey={Number(sectionKey)}
                                                columnKey={Number(columnKey)}
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
                                      sectionKey={Number(sectionKey)}
                                      columnKey={Number(columnKey)}
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
      <AddImageForm onSuccess={undefined} />
    </Container>
  );
};

export default EditPage;
