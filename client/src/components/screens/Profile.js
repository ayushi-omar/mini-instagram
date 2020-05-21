import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
    const [myPic, setPic] = useState([]);
    const [photo, setPhoto] = useState("");
    const [url, setUrl] = useState(undefined);
    const { state = {}, dispatch } = useContext(UserContext);
    // console.log("sttate", JSON.stringify(state));
    useEffect(() => {
        fetch('/myPost', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(res => res.json())
            .then(result => {
                // console.log("result>>", JSON.stringify(result));
                // console.log("myPic>>", JSON.stringify(myPic));
                setPic(result);
            })
    }, []);
    useEffect(() => {
        console.log("photo>>", photo);
        if (photo) {
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
                    // setUrl(result.url);
                    fetch('/uploadProfile', {
                        method: "PUT",
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                        },
                        body: JSON.stringify({ url: result.url })
                    }).then(res => res.json())
                        .then(resultData => {
                            console.log("resuly>>>", resultData);
                            localStorage.setItem("user", JSON.stringify({ ...state, profile: resultData.profile }))
                            dispatch({ type: "UPDATEPIC", payload: resultData.profile })
                        })
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, [photo]);
    const uploadPic = (file) => {
        console.log("inside>uploadPic>", file);
        setPhoto(file);
    }
    return (
        <div style={{ maxWidth: "550px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div>
                    <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                        src={state ? state.profile : "#"}
                    />
                    <div className="file-field input-field">
                        <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                            <span>Upload Profile</span>
                            <input type="file" onChange={(e) => uploadPic(e.target.files[0])} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    {/* <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => uploadPic()}>
                        upload
                    </button> */}
                </div>
                <div>
                    <h1> {state ? state.name : "loading"}</h1>
                    <h5> {state ? state.email : "loading"}</h5>

                    <div style={{ display: "flex", justifyContent: "space-between", marginRight: "50px", width: "100%" }}>
                        <h6>{myPic.length} post</h6>
                        <h6>{state && state.followers && state.followers.length} Follower</h6>
                        <h6>{state && state.followings && state.followings.length} Following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery">
                {myPic.map(item => {
                    return (
                        <img className="item" src={item.photo} alt={item.title} key={item._id} />
                    )
                })}
            </div>
        </div>
    );
}


export default Profile;


// https://images.unsplash.com/photo-1564923630403-2284b87c0041?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60