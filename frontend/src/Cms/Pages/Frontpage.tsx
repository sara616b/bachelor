import React from "react";
import { Link, NavLink } from "react-router-dom";

const Frontpage = () => {
  return (
    <main className="grid">
      <h1>HELLO FROM !!</h1>
      <NavLink to="/page/create/">Create Page</NavLink>
    </main>
  );
};

export default Frontpage;
