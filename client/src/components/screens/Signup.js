import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState("");
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url])

    const PostData = () => {
        if (photo) {
            uploadPic();
        } else {
            uploadFields();
        }
    }
    const uploadFields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email", classes: "#e53935 red darken-1" })
            return;
        }
        console.log("inside>>>");
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, url }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" })
                } else {
                    M.toast({ html: data.message, classes: "#4caf50 green" });
                    history.push('/signin')
                }
                console.log("data>>", data);
            }).catch((error) => {
                console.error('Error:', error);
            });
    }

    const uploadPic = () => {
        // console.log("inside>>");
        const data = new FormData();
        data.append('file', photo);
        data.append('upload_preset', "instagram-clone");
        data.append("cloud_name", "mini-instagram");
        fetch("https://api.cloudinary.com/v1_1/mini-instagram/image/upload", {
            method: "POST",
            body: data
        }).then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                setUrl(result.url);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="myCard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                        <span>Upload Profile</span>
                        <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => PostData()}>
                    Signup
                </button>
                <h6>
                    <Link to="/signin" >Alread have account?</Link>
                </h6>
            </div>
        </div>
    );
}

export default Signup;