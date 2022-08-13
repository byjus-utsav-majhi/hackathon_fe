import React from "react";
import { Link } from "react-router-dom";
import Posts from "../posts/posts";
import "../../css/Homepage.css";

export default function HomePage() {
  return (
    <div className="app">
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
          alt=""
        />
      </div>
      <div className="homepage__postsmain">
        <Posts />
        <Posts />
        <Posts />
        <Posts />
      </div>
    </div>
  );
}
