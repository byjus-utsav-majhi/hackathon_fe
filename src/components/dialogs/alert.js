import React from "react";
import { Link } from "react-router-dom";

import "../../App.css";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function alert(props) {
  return (
    <Alert severity={props.type}>
      <AlertTitle>{props.title}</AlertTitle>
      {props.msg}
    </Alert>
  );
}
