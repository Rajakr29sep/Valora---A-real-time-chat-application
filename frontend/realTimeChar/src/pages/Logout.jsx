import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearUserData } from "../redux/userSlice";
import { serverUrl } from "../main";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.get(`${serverUrl}/api/user/logout`, {
          withCredentials: true,
        });

        dispatch(clearUserData());
        navigate("/login");
      } catch (error) {
        console.log("Logout error:", error);
      }
    };

    logoutUser();
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
}

export default Logout;