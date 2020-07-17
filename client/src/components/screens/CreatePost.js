import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      fetch("/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ title, body, url }),
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log("data>>", data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#e53935 red darken-1" });
          } else {
            M.toast({
              html: "Create post successfully",
              classes: "#4caf50 green",
            });
            history.push("/");
          }
        })
        .catch((error) => {
          console.error("Error::", error);
        });
    }
  }, [url]);

  const postDetails = () => {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "instagram-clone");
    data.append("cloud_name", "mini-instagram");
    fetch("https://api.cloudinary.com/v1_1/mini-instagram/image/upload", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log('Success:', result);
        setUrl(result.url);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div
      className="card input-filed"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={() => postDetails()}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
