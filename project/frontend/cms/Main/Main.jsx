import React from "react";
import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import {
  CreatePage,
  PageOverview,
  EditPage,
  CreateUser,
  EditUser,
  UsersOverview,
  Frontpage,
  LoginPage,
} from "../Pages/index.jsx";
import renderPage from "../../Utils/renderPage.jsx";
import Navigation from "../Modules/Navigation.jsx";

const Main = () => {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route exact path="/" element={Frontpage} />
        <Route path="/page/create/" element={CreatePage} />
        <Route path="/page/all/" element={PageOverview} />
        <Route path="/page/edit/:slug" element={EditPage} />
        <Route path="/user/create/" element={CreateUser} />
        <Route path="/user/edit/:username" element={EditUser} />
        <Route path="/users/" element={UsersOverview} />
        <Route path="/login/" element={LoginPage} />
      </Routes>
    </BrowserRouter>
  );
};

renderPage("cms_main", <Main />);
