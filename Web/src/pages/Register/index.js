import React, { useState } from "react";
import { coverImage, logo } from "../../assets/helper/imagePath";
import classes from "./Register.module.css";
import { Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BaseURL } from "../../assets/helper/Urls";
import { useDispatch } from "react-redux";
import { saveLoginUserData } from "../../store/reducers/authSlice";
import axios from "axios";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [passType, setPassType] = useState("password");
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const handleRegister = async (e) => {
    e.preventDefault();
    const params = {
      name: username,
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
    if (password !== confirmPassword) {
      return toast.warn("Passwords do not match");
    }
    setSubmitLoading(true);
    const apiUrl = BaseURL("auth/register");
    try {
      const response = await axios.post(apiUrl, params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response?.data) {
        toast.success("User signedup successfully");
        dispatch(saveLoginUserData(response?.data));
        navigate("/");
      } else {
        toast.error("User already exists");
      }
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
                <button onClick={() => navigate("/login")}>Login</button>
              </div>
            </div>
            <div className={classes.loginForm}>
              <h3>Register</h3>
              <form action="" onSubmit={handleRegister}>
                <div className={classes.inputField}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className={classes.inputField}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />{" "}
                </div>
                <div className={classes.inputField}>
                  <label htmlFor="password">Password</label>
                  <input
                    type={passType}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />{" "}
                </div>
                <div className={classes.inputField}>
                  <label htmlFor="cpassword">Confirm Pasword</label>
                  <input
                    type={passType}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />{" "}
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
                  {submitLoading ? "Submitting..." : "Register"}
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
