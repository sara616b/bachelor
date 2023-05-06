import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Section from "../Modules/Section";
import Column from "../Modules/Column";
import ComponentWrapper from "../Modules/ComponentWrapper";
import axios from "axios";

const App = () => {
  const [page, setPage] = useState({});
  const { slug, preview } = useParams();

  useEffect(() => {
    axios
      .get(`/api/page/${slug}/${preview ? "preview/" : ""}`)
      .then((response) => {
        if (response.status == 200) {
          setPage(response?.data?.data);
        } else {
          console.log(response);
        }
      });
  }, []);

  return (
    <main className="grid">
      {page?.data
        ? Object.entries(page.data.sections).map(([key, section]) => {
            return (
              <Section
                props={section}
                key={key}
                index={key}
                backgroundColor={section.background_color}
              >
                {section?.columns
                  ? Object.entries(section?.columns).map(([key, column]) => {
                      return (
                        <Column
                          column={column}
                          key={key}
                          index={key}
                          alignContent={column.alignContent || ""}
                          wrapReverse={section.wrap_reverse || false}
                        >
                          {column.components
                            ? Object.entries(column.components).map(
                                ([key, component]) => {
                                  return (
                                    <ComponentWrapper
                                      component={component}
                                      key={key}
                                    ></ComponentWrapper>
                                  );
                                },
                              )
                            : "An error occured"}
                        </Column>
                      );
                    })
                  : "An error occured"}
              </Section>
            );
          })
        : "An error occured"}
    </main>
  );
};

export default <App />;
