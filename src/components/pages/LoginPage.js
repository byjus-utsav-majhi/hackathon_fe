import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";


import "../../App.css";



export default function SignInPage() {

  const [isTrueUser,setTrueUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    let cred = {email,password}
    fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(cred)
    })
    .then(res => {
      if(res.ok){
        console.log("sccessfully logedin")
      }
      else {
        console.log("wrong credentials")
      }
    })
    .then(data=>console.log(data))
 
  }

  return (
    <div className="text-center m-5-auto">
      <h2>Photo Library</h2>
      <form onSubmit={handleSubmit} action="/home">
        <p>
          <label>email address</label>
          <br />
          <input 
          type="text" name="email" required
          onChange={e => setEmail(e.target.value)}
          />
        </p>
        <p>
          <label>Password</label>
          <Link to="/forget-password">
            <label className="right-label">Forget password?</label>
          </Link>
          <br />
          <input
          type="password" name="password" required
          onChange={e => setPassword(e.target.value)}
          />
        </p>
        <p >
          <button id="sub_btn" type="submit">
            Login
          </button>
        </p>
      </form>
      <footer>
        <p>
          First time? <Link to="/register">Create an account</Link>.
        </p>
      </footer>
    </div>
  );
}
