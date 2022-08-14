import React from "react";
import { Link } from "react-router-dom";
import "../../css/Post.css";
import { Avatar } from "@mui/material";
export default function Posts(props) {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="anime_pahe"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRqRyIiwYCq4s-fZi1zdmyfSuIPUvg9EyZ_Q&usqp=CAU"
        />
        <h3>anime_pahe</h3>
      </div>

      <img className="post__image" src={props.item.img_url} alt=""></img>
      <h4 className="post__text">
        <strong>anime_pahe</strong> random_user Yohoo satou gojou
      </h4>
    </div>
  );
}
