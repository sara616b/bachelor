import React from "react";
import { NavLink } from "react-router-dom";

const CreatePage = () => {
  return (
    <main className="grid">
      <h1>Create Page</h1>
      <NavLink to="/">Frontpage</NavLink>
    </main>
  );
};

export default CreatePage;
