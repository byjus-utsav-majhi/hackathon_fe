import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import { v4 as uuid } from "uuid";
import axios from "axios";
import config from "../../config/dev.json";

import "../../App.css";

export default function SignUpPage() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phone_no, setPhoneNo] = useState();
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    let cred = {
      uid: uuid(),
      email: email,
      username: username,
      password: password,
      phone_no: phone_no,
    };
    try {
      const resp = await axios.post(`${config.ruby_host}/users/create`, cred, {
        "content-type": "application/json",
      });
      console.log("Response", JSON.stringify(resp.data));
      console.log("sccessfully loggedin", JSON.stringify(resp.data));
      setIsRegistered(true);
    } catch (e) {
      console.log("Please fill all the details", e);
    }
  };

  if (isRegistered) {
    return <Navigate to="/" />;
  }

  return (
    <div className="text-center m-5-auto">
      <h2>Join us</h2>
      <h5>Create your personal account</h5>
      <form onSubmit={handleRegister} action="/">
        <p>
          <label>Username</label>
          <br />
          <input
            type="text"
            name="first_name"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </p>
        <p>
          <label>Email address</label>
          <br />
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </p>
        <p>
          <label>Phone Number</label>
          <br />
          <input
            type="text"
            name="phone"
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
        </p>
        <p>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </p>
        <p>
          <input type="checkbox" name="checkbox" id="checkbox" required />{" "}
          <span>
            I agree all statements in{" "}
            <a
              href="https://google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms of service
            </a>
          </span>
          .
        </p>
        <p>
          <button id="sub_btn" type="submit">
            Register
          </button>
        </p>
      </form>
      <footer>
        <p>
          <Link to="/">Back to LoginPage</Link>.
        </p>
      </footer>
    </div>
  );
}
