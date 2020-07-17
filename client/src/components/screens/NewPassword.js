import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const NewPassword = () => {
  const history = useHistory();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  // console.log("instokenide>>>", token);

  const PostData = () => {
    // console.log("inside>>>");
    fetch("/newPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, token }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("data>>", data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          M.toast({ html: data.msg, classes: "#4caf50 green" });
          history.push("/signin");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <div className="myCard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>

        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Update
        </button>
        <h6>
          <Link to="/signup">Dont have an account?</Link>
        </h6>
      </div>
    </div>
  );
};

export default NewPassword;
