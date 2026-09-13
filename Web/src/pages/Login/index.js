import React, { useContext, useState } from "react";
import { coverImage, logo } from "../../assets/helper/imagePath";
import classes from "./Login.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BaseURL } from "../../assets/helper/Urls";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveLoginUserData } from "../../store/reducers/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passType, setPassType] = useState("password");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const handleLogin = async (e) => {
    e.preventDefault();
    const params = {
      email,
      password,
    };
    for (let key in params) {
      if (params[key] === "" || params[key] === null) {
        return toast.error(`Fill the ${key} field!`);
      }
    }
    if (password.length < 8) {
      return toast.warn("Password must be atleast 8 characters");
    }

    setSubmitLoading(true);
    try {
      const apiUrl = BaseURL("auth/login");
      const response = await axios.post(apiUrl, params);
      if (response?.data) {
        console.log(response?.data);
        dispatch(saveLoginUserData(response?.data));
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
    setSubmitLoading(false);
  };
  return (
    <div className={classes.loginContainer}>
      <Row>
        <Col lg={6} className={classes.imgContainer}>
          <div className={classes.imgSection}>
            <img src={coverImage} alt="" />
          </div>
        </Col>
        <Col lg={6}>
          <div className={classes.loginSection}>
            <div className={classes.header}>
              <div className={classes.logo}>
                <img src={logo} alt="" />
              </div>
              <div className={classes.registerBtn}>
                <button onClick={() => navigate("/register")}>Register</button>
              </div>
            </div>
            <div className={classes.loginForm}>
              <h3>Login</h3>
              <form action="" onSubmit={handleLogin}>
                <div className={classes.inputField}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className={classes.inputField}>
                  <label htmlFor="password">Password</label>
                  <input
                    type={passType}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    className="me-2"
                    onChange={(e) => {
                      setPassType(passType == "password" ? "text" : "password");
                    }}
                  />
                  <label htmlFor="showPass">Show password</label>
                </div>
                <button className={classes.submitBtn}>
                  {submitLoading ? "Submitting..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
