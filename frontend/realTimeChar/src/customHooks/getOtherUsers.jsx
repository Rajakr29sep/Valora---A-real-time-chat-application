import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setOtherUsers } from "../redux/userSlice";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData) return;

    const fetchUsers = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/others`,
          {
            withCredentials: true,
          }
        );

        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.log(
          "Other users error:",
          error.response?.data || error.message
        );
      }
    };

    fetchUsers();
  }, [dispatch, userData]);

  return null;
};

export default useGetOtherUsers;