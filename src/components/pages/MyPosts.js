import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Posts from "../posts/posts";
import "../../css/Homepage.css";
import axios from "axios";
import config from "../../config/dev.json";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { storage } from "../../firebase.js";
import { ref } from "firebase/storage";
import { getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "../dialogs/alert.js";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function MyPosts(props) {
  console.log("YOHOOOOOON MYPOSTS");
  let iop = {};
  if (localStorage.getItem("user")) {
    iop = JSON.parse(localStorage.getItem("user"));
    console.log("IOP DATA", iop);
  }
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

  const { state } = useLocation();

  const handleDialogClickOpen = () => {
    setOpenAddDialog(true);
  };

  const handleDialogClose = () => {
    setOpenAddDialog(false);
  };

  const deletePost = async (id) => {
    console.log("Deleting Id", id);
    try {
      const resp = await axios.delete(
        `${config.ruby_host}/posts/delete/${id}`,
        {
          "content-type": "application/json",
          headers: {
            uid: iop.userData.data.uid,
          },
        }
      );
      console.log("Response", resp);
    } catch (e) {
      console.log("Error", e);
    }
  };

  //To get all posts
  const getAllPosts = async () => {
    try {
      const resp = await axios.get(`${config.ruby_host}/posts/index`, {
        "content-type": "application/json",
        headers: {
          uid: iop.userData.data.uid,
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
          user_uid: iop.userData.data.uid,
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
    if (localStorage.getItem("user")) {
      iop = JSON.parse(localStorage.getItem("user"));
      console.log("IOP DATA", iop);
    }
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
    if (showAlert.visible) {
      const timer = setTimeout(() => {
        setShowAlert({
          visible: false,
          msg: "",
          title: "",
          type: "success",
        });
      }, 1);
      return () => clearTimeout(timer);
    }
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

  let navigate = useNavigate();
  const toAllpostNavigate = () => {
    let path = `/allposts`;
    navigate(path);
  };
  function toMypostNavigate() {
    let path = `/home`;
    navigate(path);
  }

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
        <div className="tabs">
          <div>
            <Button onClick={toAllpostNavigate}>All Posts</Button>
          </div>
          <div>
            <Button onClick={toMypostNavigate}>My Posts</Button>
          </div>
        </div>
      </div>
      <div className="homepage__postsmain">
        {postList
          .filter((e) => e.uid === iop.userData.data.uid)
          .map((item, index) => (
            <Posts key={index} item={item} getAll={getAllPosts} />
          ))}
      </div>
    </div>
  );
}
