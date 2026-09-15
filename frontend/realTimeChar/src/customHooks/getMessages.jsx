import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setMessageData } from "../redux/messageSlice";


const useGetMessages = () => {
    const dispatch = useDispatch();

    const { userData, selectedUser } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (!userData || !selectedUser) return;

        const fetchMessages = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/message/get/${selectedUser._id}`,
                    {
                        withCredentials: true,
                    }
                );

                // ✅ Backend returns { message: [...] }
                dispatch(setMessageData(result.data.message));

            } catch (error) {
                console.log(
                    "Get messages error:",
                    error.response?.data || error.message
                );
            }
        };

        fetchMessages();
    }, [selectedUser, userData]);
};

export default useGetMessages;