import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Section from "../Modules/Section";
import Column from "../Modules/Column";
import ComponentWrapper from "../Modules/ComponentWrapper";
import axios from "axios";

type DataProps = {
  sections?: object;
};

type PageObjectProps = {
  data?: DataProps;
};
type ColumnObjectProps = {
  columns?: object;
  background_color: string;
  wrap_reverse?: boolean;
};
type SectionObjectProps = {
  columns?: ColumnObjectProps;
};

type PageParams = {
  slug: string;
  preview: string;
};

// type ComponentsProps = {
//   key: number,
//   component: any,
// }

const Page = () => {
  const [page, setPage] = useState<PageObjectProps>({});
  const [sections, setSections] = useState<SectionObjectProps>({});
  const { slug, preview } = useParams<PageParams>();
  // const [get, setget] = useState("none");
  // const [csrf, setcsrf] = useState("none");
  const [loaded, setLoaded] = useState<boolean>(false);

  // useEffect(() => {
  //   testRequest("GET");
  //   getCsrfToken();
  // }, []);

  // let csrfToken = "";
  // const API = "http://127.0.0.1:8002";

  // async function getCsrfToken() {
  //   if (csrfToken === "") {
  //     const response = await fetch(`${API}/api/csrf/`, {
  //       credentials: "include",
  //     });
  //     const data = await response.json();
  //     csrfToken = data.csrfToken;
  //   }
  //   setcsrf(csrfToken);
  //   return csrfToken;
  // }

  // async function testRequest(methodName: string) {
  //   const response = await fetch(`${API}/api/ping/`, {
  //     method: methodName,
  //     credentials: "include",
  //   });
  //   const data = await response.json();
  //   setget(data.result);
  //   return data.result;
  // }

  useEffect(() => {
    if (loaded === false) {
      axios
        .get(
          `http://127.0.0.1:8002/api/page/${slug}/${preview ? "preview/" : ""}`,
        )
        .then(
          (response: {
            status: number;
            data: { data: { data: { sections: object } } };
          }) => {
            if (response.status === 200) {
              setPage(response?.data?.data);
              setSections(response?.data?.data?.data?.sections);
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
        ? Object.entries(sections).map(([key, section]) => {
            return (
              <Section
                key={key}
                index={parseInt(key)}
                backgroundColor={section.background_color}
              >
                {section?.columns
                  ? Object.entries(section?.columns).map(([key, column]) => {
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
