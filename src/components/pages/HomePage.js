import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Posts from "../posts/posts";
import "../../css/Homepage.css";
import axios from "axios";
import config from "../../config/dev.json";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { storage, ref } from "../../firebase.js";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "../dialogs/alert.js";

export default function HomePage() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [postList, setPostList] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [captionDialog, setCaptionDialog] = useState();
  const [showAlert, setShowAlert] = useState({
    visible: false,
    msg: "",
    title: "",
    type: "success",
  });

  const handleDialogClickOpen = () => {
    setOpenAddDialog(true);
  };

  const handleDialogClose = () => {
    setOpenAddDialog(false);
  };

  //To get all posts
  const getAllPosts = async () => {
    try {
      const resp = await axios.get(`${config.ruby_host}/posts/index`, {
        "content-type": "application/json",
        headers: {
          uid: "testHeader",
        },
      });
      console.log("Response", resp);
      setPostList(resp.data.data);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const savePost = async (imgUrl, caption) => {
    try {
      const resp = await axios.post(
        `${config.ruby_host}/posts/create`,
        {
          user_uid: "test213138191",
          img_url: imgUrl,
          caption: caption,
        },
        {
          "content-type": "application/json",
          headers: {
            uid: "testHeader",
          },
        }
      );
      console.log("Response", resp);
      await getAllPosts();
      return { status: "Success" };
    } catch (e) {
      console.log("Error", e);
      return { status: "Error" };
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const handleDialogCaptionChange = (caption) => {
    setCaptionDialog(caption);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert({
        visible: false,
        msg: "",
        title: "",
        type: "success",
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [showAlert]);

  const handleUpload = () => {
    const newdate = new Date();
    let imgName = selectedImage.name + newdate.toISOString();
    const storageRef = ref(storage, `posts/${imgName}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("Download URL", url);
          savePost(url, captionDialog).then((res) => {
            if (res.status === "Success") {
              setShowAlert({
                visible: true,
                msg: "Successfully added your post :)",
                title: "Success",
                type: "success",
              });

              handleDialogClose();
            } else {
              setShowAlert({
                visible: true,
                msg: "Error while saving your post :(",
                title: "Error",
                type: "error",
              });
              handleDialogClose();
            }
          });
        });
      }
    );
  };

  return (
    <div className="app">
      {showAlert.visible && (
        <Alert
          title={showAlert.title}
          msg={showAlert.msg}
          type={showAlert.type}
        />
      )}
      <Dialog open={openAddDialog} onClose={handleDialogClose}>
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
          <input type="file" onChange={handleChange}></input>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleUpload}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Fab
        color="primary"
        onClick={handleDialogClickOpen}
        aria-label="add"
        style={{
          margin: 0,
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto",
          position: "fixed",
        }}
      >
        <AddIcon />
      </Fab>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1280px-Instagram_logo.svg.png"
          alt=""
        />
      </div>
      <div className="homepage__postsmain">
        {postList.map((item, index) => (
          <Posts key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
