import React, { useState,useEffect } from "react";
import UserContext from "./UserContext";
import { BaseURL } from "../assets/helper/Urls";
import axios from "axios";
const UserState = (props) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const login = async (params) => {
    const apiUrl = BaseURL("auth/login");
    const response = await axios.post(apiUrl, params);
    console.log(response);
    setUser(response.data);
  };
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser, login }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
