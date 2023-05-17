export type PageObjectProps = {
  online: boolean;
  title: string;
  slug: string;
  thumbnail_url: string;
  page_slug: string;
  page_title: string;
  data: {
    sections: {
      [index: number]: {
        name: string;
        wrap_reverse: boolean;
        background_color: string;
        columns: {
          [index: number]: {
            name: string;
            alignContent: string;
            components: {
              [index: number]: {
                name: string;
              };
            };
          };
        };
      };
    };
  };
};

export type UserObjectProps = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
};
