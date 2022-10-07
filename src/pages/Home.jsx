import "./css/Home.css";

import React, { Component }  from 'react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Constants from "../Constants";


export default function Header() {

  // if ((!value.token && !value.currentUser) || value.currentUser) {
    return (
      <main className="container main m-0">
        <div className="d-flex cont-home">
          <h1>Hola Roni</h1>
        </div>
      </main>
    );
  // }
}

// export default Header;
