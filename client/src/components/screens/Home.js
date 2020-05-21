import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
    const [data, setData] = useState([]);
    const { dispatch, state } = useContext(UserContext);
    useEffect(() => {
        fetch('/allPost', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(res => res.json())
            .then(result => {
                setData(result);
            })
    }, []);
    const likePost = (id) => {
        fetch('/like', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({ postId: id })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            }).catch(err => console.log("errr>>", err));
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({ postId: id })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            }).catch(err => console.log("errr>>", err));

    }
    const makeComment = (id, text) => {
        fetch('/comment', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({ postId: id, text })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            }).catch(err => console.log("err", err))

    }
    const deletePost = (postId) => {
        fetch(`/deletePost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id != result._id
                })
                setData(newData);
            }).catch(err => console.log(err));
    }
    const deleteComment = (id, text) => {
        fetch(`/deleteComment/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            },
            body: JSON.stringify({ text })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (result._id == item._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            }).catch(err => console.log("errr>>", err));

    }
    return (
        <div className="home">
            {data.map(item => {
                return (
                    <div className="card home-card" key={item._id}>
                        {item && item.postedBy && item.postedBy._id.toString() === state._id.toString() &&
                            <i className="material-icons" style={{ float: "right" }} onClick={() => { deletePost(item._id) }}>delete</i>
                        }
                        <h5><Link to={item.postedBy && item.postedBy._id.toString() !== state._id.toString() ? `/profile/${item.postedBy._id}` : `/profile`}>{item.postedBy.name}</Link></h5>
                        <div className="card-image">
                            <img src={item.photo} />
                        </div>
                        <div className="card-content">
                            <i className="material-icons" style={{ color: "red" }}>favorite</i>
                            {item && item.likes.includes(state._id) ?
                                <i className="material-icons" onClick={() => { unlikePost(item._id) }}>thumb_down</i> :
                                <i className="material-icons" onClick={() => { likePost(item._id) }}>thumb_up</i>
                            }
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.map(record => {
                                    return (
                                        <div>
                                            {record.postedBy && record.postedBy._id.toString() === state._id.toString() &&
                                                <i className="material-icons" style={{ float: "right" }} onClick={() => { deleteComment(item._id, record.text) }}>delete_forever</i>
                                            }
                                            <h6 key={record._id}><span style={{ fontWeight: "500", marginRight: "10px" }}>{record.postedBy.name}</span>{record.text}</h6>
                                        </div>
                                    )
                                })
                            }
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                makeComment(item._id, e.target[0].value);

                            }}>
                                <input type="text" placeholder="add a comment" />
                            </form>
                        </div>
                    </div>
                );
            })}

        </div>
    );
}

export default Home;