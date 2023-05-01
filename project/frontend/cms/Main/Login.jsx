import React from "react";
import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import { LoginPage } from "../Pages/index.jsx";
import renderPage from "../../Utils/renderPage.jsx";

const Main = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login/" element={LoginPage} />
      </Routes>
    </BrowserRouter>
  );
};

renderPage("cms_login", <Main />);
