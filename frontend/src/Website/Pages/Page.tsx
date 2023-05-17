import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Section from "../Modules/Section";
import Column from "../Modules/Column";
import ComponentWrapper from "../Modules/ComponentWrapper";
import axios from "axios";
import { PageObjectProps } from "../../Utils/Foundation/Types";

const Page = () => {
  const [page, setPage] = useState<PageObjectProps | undefined>();
  const { slug, preview } = useParams<{ [index: string]: string }>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (loaded === false) {
      axios
        .get(
          `http://127.0.0.1:8002/api/page/${slug}/${preview ? "preview/" : ""}`,
        )
        .then(
          (response: { status: number; data: { data: PageObjectProps } }) => {
            if (response.status === 200) {
              setPage(response.data.data);
              setLoaded(true);
            } else {
              console.log(response);
            }
          },
        );
    }
  }, [loaded, slug, preview]);

  return (
    <main className="grid">
      {page?.data
        ? Object.entries(page.data.sections).map(([key, section]) => {
            return (
              <Section
                key={key}
                index={parseInt(key)}
                backgroundColor={section.background_color}
              >
                {section.columns
                  ? Object.entries(section.columns).map(([key, column]) => {
                      return (
                        <Column
                          key={key}
                          index={parseInt(key)}
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

export default Page;
