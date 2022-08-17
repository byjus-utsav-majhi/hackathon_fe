import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import ForgetPasswordPage from "./components/pages/ForgetPasswordPage";
import "./App.css";
import MyPosts from "./components/pages/MyPosts";
import AllPosts from "./components/pages/AllPosts";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/home" element={<MyPosts />} />
        <Route path="/allposts" element={<AllPosts />} />
      </Routes>
    </Router>
  );
}
export default App;
