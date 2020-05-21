import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const [userProfile, setProfile] = useState([]);
    const { state = {}, dispatch } = useContext(UserContext);
    const { userId } = useParams();
    const [showFollow, setFollow] = useState(state ? state.followings.includes(userId) : false); // not working

    useEffect(() => {
        fetch(`/user/${userId}`, {
            // method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(res => res.json())
            .then(result => {
                console.log("result>>", JSON.stringify(result));
                console.log("setProfile>>", JSON.stringify(setProfile));
                setProfile(result);
            })
    }, []);
    const followUser = () => {
        fetch('/follow', {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followId: userId })
        }).then(res => res.json())
            .then(result => {
                dispatch({ type: "UPDATE", payload: { followers: result.user.followers, followings: result.user.followings } })
                localStorage.setItem("user", JSON.stringify(result.user))

                console.log("adta>", JSON.stringify(result));
                setProfile(previousState => {
                    return {
                        ...previousState,
                        user: result.searchUser
                    }

                })
                setFollow(false);
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followId: userId })
        }).then(res => res.json())
            .then(result => {
                dispatch({ type: "UPDATE", payload: { followers: result.user.followers, followings: result.user.followings } })
                localStorage.setItem("user", JSON.stringify(result.user))

                console.log("adta>", JSON.stringify(result));
                setProfile(previousState => {
                    return {
                        ...previousState,
                        user: result.searchUser
                    }
                })
                setFollow(true);
            })
    }
    return (
        <>
            {!userProfile || !userProfile.user ?
                <h2>Loading</h2> :
                <div style={{ maxWidth: "550px", margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={userProfile && userProfile.user ? userProfile.user.profile : "#"}
                            />
                        </div>
                        <div>
                            <h1> {userProfile && userProfile.user ? userProfile.user.name : "loading"}</h1>
                            <h5> {userProfile && userProfile.user && userProfile.user.email}</h5>
                            <div style={{ display: "flex", justifyContent: "space-between", marginRight: "50px", width: "100%" }}>
                                <h6>{userProfile.posts && userProfile.posts.length} post</h6>
                                <h6>{userProfile.user.followers && userProfile.user.followers.length} Follower</h6>
                                <h6>{userProfile.user.followings && userProfile.user.followings.length} Following</h6>
                            </div>
                            {showFollow ?
                                <button style={{ margin: "15px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => followUser()}>
                                    Follow
                                </button> :
                                <button style={{ margin: "15px" }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => unfollowUser()}>
                                    Unfollow
                                </button>
                            }
                        </div>
                    </div>

                    <div className="gallery">
                        {userProfile.posts.map(item => {
                            return (
                                <img className="item" src={item.photo} alt={item.title} key={item._id} />
                            )
                        })}
                    </div>
                </div>
            }
        </>
    );
}


export default UserProfile;