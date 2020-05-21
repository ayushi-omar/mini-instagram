import React, { useEffect, createContext, useReducer, useContext } from 'react';
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import Signin from "./components/screens/Signin";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribeUserPost from "./components/screens/SubscribeUser";
import ResetPassword from "./components/screens/ResetPassword";
import NewPassword from "./components/screens/NewPassword";


import { initialState, reducer } from "./reducers/UserReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch, state } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log("user>>>", user);
    if (user) {
      dispatch({ type: "USER", payload: user });
      history.push("/");
    } else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push("/signin");
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/"><Home /></Route>
      <Route exact path="/profile"><Profile /></Route>
      <Route path="/signup"><Signup /></Route>
      <Route path="/signin"><Signin /></Route>
      <Route path="/create"><CreatePost /></Route>
      <Route path="/profile/:userId"><UserProfile /></Route>
      <Route path="/myFollowingPost"><SubscribeUserPost /></Route>
      <Route exact path="/reset"><ResetPassword /></Route>
      <Route path="/reset/:token"><NewPassword /></Route>

    </Switch>
  );
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
