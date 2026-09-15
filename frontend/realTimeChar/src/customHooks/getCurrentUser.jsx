import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../main";
import {
    setUserData,
    clearUserData
} from "../redux/userSlice";

const useGetCurrentUser = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/user/current`,
                    {
                        withCredentials: true
                    }
                );

                dispatch(setUserData(result.data));

            } catch (error) {
                console.log("Current user error:", error);

                dispatch(clearUserData());
            }
        };

        fetchUser();
    }, [dispatch]);
};

export default useGetCurrentUser;