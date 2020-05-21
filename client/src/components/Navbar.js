import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from 'materialize-css';

const Navbar = () => {
    const searchModel = useRef(null)
    const { dispatch, state } = useContext(UserContext);
    const [search, setSearch] = useState("");
    const [useList, setUserList] = useState([]);
    const history = useHistory();
    useEffect(() => {
        M.Modal.init(searchModel.current);
    }, []);
    const renderList = () => {
        // console.log("state>>", state)
        if (state) {
            return [
                <li key="1"><i data-target="modal1" className="material-icons modal-trigger" style={{ color: "black" }}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myFollowingPost">my Follow Post</Link></li>,
                <li key="5">
                    <button className="btn waves-effect waves-light #c62828 red darken-1" onClick={() => {
                        localStorage.clear();
                        dispatch({ type: "CLEAR" })
                        history.push('/signin');
                    }}>
                        Log out
                    </button>
                </li>

            ]
        } else {
            return [
                <li key="6"><Link to="/signin">Login</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUser = (query) => {
        setSearch(query);
        fetch("/search-users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        }).then(res => res.json())
            .then(result => {
                console.log("result>>", result)
                setUserList(result.user)
            })
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">InstaGram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
                <div id="modal1" className="modal" ref={searchModel} style={{ color: "black" }}>
                    <div className="modal-content">
                        <input type="text" placeholder="search User" value={search} onChange={(e) => fetchUser(e.target.value)} />

                        <ul className="collection">
                            {useList.map(item => {
                                return (
                                    <Link to={item && item._id.toString() !== state._id.toString() ? `/profile/${item._id}` : `/profile`}
                                        onClick={() => { M.Modal.getInstance(searchModel.current).close() }}
                                    >
                                        <li className="collection-item">{item.email}</li>
                                    </Link>)
                            })}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch("")}>close</button>
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Navbar;