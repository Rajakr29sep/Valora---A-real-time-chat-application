import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";

import { useDispatch, useSelector } from "react-redux";
import { setSocket, setOnlineUsers } from "./redux/userSlice";

import useGetCurrentUser from "./customHooks/getCurrentUser";
import useGetOtherUsers from "./customHooks/getOtherUsers";

import { io } from "socket.io-client";
import { serverUrl } from "./main";

function App() {
  // Get current logged-in user
  useGetCurrentUser();

  // Get all other users
  useGetOtherUsers();

  const { userData, loading } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();

  // ================= SOCKET CONNECTION =================

  useEffect(() => {
    // User abhi available nahi hai
    if (!userData?._id) {
      return;
    }

    console.log("Creating socket for user:", userData._id);

    const socketio = io(serverUrl, {
      query: {
        userId: userData._id,
      },
    });

    // Check socket connection
    socketio.on("connect", () => {
      console.log("✅ SOCKET CONNECTED:", socketio.id);
    });

    socketio.on("connect_error", (error) => {
      console.log("❌ SOCKET CONNECTION ERROR:", error.message);
    });

    // Store socket in Redux
    dispatch(setSocket(socketio));

    // Get online users
    socketio.on("getOnlineUsers", (users) => {
      console.log("ONLINE USERS:", users);

      dispatch(setOnlineUsers(users));
    });

    // Cleanup
    return () => {
      console.log("Closing socket:", socketio.id);

      socketio.close();

      dispatch(setSocket(null));
      dispatch(setOnlineUsers([]));
    };
  }, [userData, dispatch]);

  // ================= LOADING =================

  if (loading) {
    return <div>Loading...</div>;
  }

  // ================= ROUTES =================

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          !userData ? (
            <Login />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* LOGOUT */}
      <Route
        path="/logout"
        element={<Logout />}
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={
          !userData ? (
            <SignUp />
          ) : (
            <Navigate to="/profile" />
          )
        }
      />

      {/* HOME */}
      <Route
        path="/"
        element={
          userData ? (
            <Home />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={
          userData ? (
            <Profile />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

    </Routes>
  );
}

export default App;