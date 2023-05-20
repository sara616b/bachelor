import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Section from "../Modules/Section";
import Column from "../Modules/Column";
import ComponentWrapper from "../Modules/ComponentWrapper";
import { PageObjectProps } from "../../Utils/Foundation/Types";

const Page = () => {
  const [page, setPage] = useState<PageObjectProps | undefined>();
  const { slug, preview } = useParams<{ [index: string]: string }>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (loaded === false) {
      axios
        .get(`${process.env.REACT_APP_API_HOST}/api/pages/${slug}/online/`)
        .then(
          (response: { status: number; data: { data: PageObjectProps } }) => {
            if (response.status === 200) {
              setPage(response.data.data);
              setLoaded(true);
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
