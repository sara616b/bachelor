import React from "react";
import { Route, Routes, Link, BrowserRouter } from "react-router-dom";
import { CreateUser, EditUser, UsersOverview, Frontpage, LoginPage } from "../Pages/index.jsx";
import renderPage from "../../Utils/renderPage.jsx";
import Navigation from "../Modules/Navigation.jsx";

const Main = () => {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route exact path="/" element={Frontpage} />
                <Route path="/user/create/" element={CreateUser} />
                <Route path="/user/edit/:username" element={EditUser} />
                <Route path="/users/" element={UsersOverview} />
                <Route path="/login/" element={LoginPage} />
            </Routes>
        </BrowserRouter>
    )
}

renderPage('cms_main', <Main />)
