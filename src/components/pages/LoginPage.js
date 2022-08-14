import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navigate } from 'react-router';
import axios from "axios";
import config from "../../config/dev.json";

import "../../App.css";



export default function SignInPage() {
  const [udata,setUdata] = useState();
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const iop = {
    isUserLoggedIn: isLoggedIn,
    userData: udata
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(iop));
  }, [iop]);

  const handleSubmit = async e => {
    e.preventDefault();
    let cred = {email : email, password: password}
    try {
      const resp = await axios.post(
        `${config.ruby_host}/users/login`,
        cred,
        {
          "content-type": "application/json",
        }
      );
      console.log("Response", JSON.stringify(resp.data));
      console.log("sccessfully logedin",JSON.stringify(resp.data))
      setUdata(resp.data);
      setIsLoggedIn(true);
      
    } catch (e) {
      console.log("WRONG CREDENTIALS", e);
    }

    

    
    
    // fetch('http://localhost:3000/users/login', {
    // method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json'
    // },
    // body: JSON.stringify(cred)
    // })
    // .then(res => {
    //   if(res.ok){
    //     console.log("sccessfully logedin",res)
    //     data = res
    //     setIsLoggedIn(true);
    //   }
    //   else {
    //     console.log("wrong credentials")
    //   }
    // })
 
  }
  if(isLoggedIn) {
    console.log(iop);
    return (<Navigate to="/home" state={{iop}}/>);
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
