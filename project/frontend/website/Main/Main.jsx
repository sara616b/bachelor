import React from "react";
import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import { Page } from "../Pages/index.jsx";
import renderPage from "../../Utils/renderPage.jsx";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={Page} />
        <Route path="/:slug" element={Page} />
        {/* <Route path="/user/create/" element={CreateUser} />
                <Route path="/user/edit/:username" element={EditUser} />
                <Route path="/users/" element={UsersOverview} />
                <Route path="/login/" element={LoginPage} /> */}
      </Routes>
    </BrowserRouter>
  );
};

renderPage("website_main", <Main />);
