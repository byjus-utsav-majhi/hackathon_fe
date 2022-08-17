import React from "react";
import { Link } from "react-router-dom";
import "../../css/Post.css";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import config from "../../config/dev.json";
import axios from "axios";

export default function Posts(props) {
  let iop = {};
  if (localStorage.getItem("user")) {
    iop = JSON.parse(localStorage.getItem("user"));
    console.log("IOP DATA", iop);
  }
  const deletePost = async (id) => {
    console.log("Deleting Id", id);
    try {
      const resp = await axios.delete(
        `${config.ruby_host}/posts/delete/${id}`,
        {
          "content-type": "application/json",
        }
      );
      console.log("Response", resp);
      props.getAll();
    } catch (e) {
      console.log("Error", e);
    }
  };

  const isOwnPost = props.item.uid === iop.userData.data.uid;
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="anime_pahe"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRqRyIiwYCq4s-fZi1zdmyfSuIPUvg9EyZ_Q&usqp=CAU"
        />
        <h3 style={{ fontWeight: "bolder" }}>{props.item.username}</h3>
        {isOwnPost && (
          <div className="post__deleteicon">
            <IconButton
              aria-label="delete"
              onClick={async () => await deletePost(props.item.id)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}

        <IconButton aria-label="edit">
          <EditIcon />
        </IconButton>
      </div>

      <img className="post__image" src={props.item.img_url} alt=""></img>
      <h4 className="post__text">
        <strong style={{ fontWeight: "bolder" }}>{props.item.username}</strong>
        {"  "}
        {props.item.caption}
      </h4>
    </div>
  );
}
