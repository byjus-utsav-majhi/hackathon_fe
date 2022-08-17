import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../css/Post.css";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import config from "../../config/dev.json";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "../dialogs/alert.js";

export default function Posts(props) {
  const [editDialog,setEditDialog] = useState(false);
  const [captionDialog, setCaptionDialog] = useState();
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

  const handleEditButtonClicked = () => {
    setEditDialog(true)
  }

  const handleDialogClose = () => {
    setEditDialog(false);
  };

  const handleDialogCaptionChange = (caption) => {
    setCaptionDialog(caption);
  };

  const handleUpdateCaption = async (id) => {
    
    try {
      await axios.put(
        `${config.ruby_host}/posts/update/${id}`, 
        {
          caption: captionDialog
        },
        {
          "content-type": "application/json",
        }
      )
      .then(resp => {
        props.getAll();
        if(resp.ok){
        console.log("Response", resp);
        setEditDialog(false);
      }});
    } catch (e) {
      console.log("Error", e);
    }
  }


  const isOwnPost = props.item.uid === iop.userData.data.uid;
  return (
    <>
    <Dialog open={editDialog} onClose={handleDialogClose}>
        <DialogTitle>Add Post</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => handleDialogCaptionChange(e.target.value)}
            autoFocus
            margin="dense"
            id="caption"
            label="Post Caption"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateCaption(props.item.id)}>Update Caption</Button>
        </DialogActions>
      </Dialog>
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

        <IconButton 
        aria-label="edit"
        onClick={handleEditButtonClicked}
        >
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
    </>
  );
}
