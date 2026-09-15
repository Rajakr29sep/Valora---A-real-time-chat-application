import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoSearch } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { setSearchData, setSelectedUser } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../main";

function SideBar() {
  const { userData, otherUsers, selectedUser, onlineUsers, searchData } =
    useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const handleSearch = async () => {
      try {
        let result = await axios.get(
          `${serverUrl}/api/user/search?query=${query}`,
          {
            withCredentials: true,
          },
        );
        dispatch(setSearchData(result.data));
      } catch (error) {
        console.log("search error:", error);
      }
    };
    if (query.trim() !== "") {
      handleSearch();
    }
  }, [query, dispatch]);
  return (
    <div
      className={`lg:w-[30%] w-full h-full overflow-hidden bg-slate-200 border-r-2 border-pink-600 lg:block ${!selectedUser ? "block" : "hidden"} `}
    >
      {/* Header */}
      <div className="w-full h-[300px] bg-pink-500 rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center flex-col gap-[20px] px-[25px]">
        <h1 className="font-bold text-white text-[19px] ml-[350px]">Valora</h1>

        {/* Current User */}
        <div className="flex justify-between font-bold">
          <h1>Hi, {userData?.name || "Anonymous"}</h1>

          <div
            className="w-[60px] h-[60px] bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-lg overflow-hidden cursor-pointer"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <img
              src={userData?.img || dp}
              alt="profile pic"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Search */}
        <div className="w-full flex gap-2 overflow-y-auto py-4">
          {!search ? (
            <span
              className="bg-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
              onClick={() => setSearch(true)}
            >
              <IoSearch className="text-[30px]" />
            </span>
          ) : (
            <div className=" bg-white rounded-full flex items-center w-full h-[48px] px-3 shadow-md ">
              {" "}
              <IoSearch className="text-[22px] shrink-0 text-slate-500" />{" "}
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                placeholder="Search users..."
                autoFocus
                className=" flex-1 min-w-0 outline-none px-2 text-[15px] sm:text-[17px] bg-transparent text-slate-800 "
              />{" "}
              <MdOutlineCancel
                onClick={() => {
                  setSearch(false);
                  setQuery("");
                }}
                className=" text-[23px] text-slate-500 hover:text-red-500 cursor-pointer shrink-0 "
              />{" "}
            </div>
          )}

          {!search && (
            <div className="flex hide-scrollbar">
              {otherUsers?.map(
                (user) =>
                  onlineUsers?.includes(user._id) && (
                    <div
                      className="w-[60px] h-[60px] bg-white rounded-full border-4 mx-1 border-[#20c7ff] shadow-gray-400 shadow-lg relative cursor-pointer  "
                      onClick={() => {
                        dispatch(setSelectedUser(user));
                      }}
                    >
                      {/* Image wrapper */}
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img
                          src={user?.img || dp}
                          alt="profile pic"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Online dot */}
                      <span className="absolute w-3 h-3 right-1 bottom-1 bg-green-500 rounded-full z-10"></span>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 my-2 h-[calc(100%-300px)] overflow-y-auto px-2 hide-scrollbar pb-3">
        {" "}
        {search && query.trim() !== "" ? (
          /* ================= SEARCH RESULTS ================= */ searchData?.length >
          0 ? (
            searchData.map((user) => (
              <div
                key={user._id}
                className=" w-full min-h-[65px] group py-2 px-2 bg-gray-700 rounded-2xl flex items-center hover:bg-[#45caff] cursor-pointer transition-all duration-300 active:scale-[0.98]"
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  setSearch(false);
                  setQuery("");
                }}
              >
                {" "}
                {/* Profile Image */}{" "}
                <div className=" w-[52px] h-[52px] bg-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-md relative shrink-0 ">
                  {" "}
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {" "}
                    <img
                      src={user?.img || dp}
                      alt="profile pic"
                      className="w-full h-full object-cover"
                    />{" "}
                  </div>{" "}
                  {/* Online Dot */}{" "}
                  {onlineUsers?.includes(user?._id) && (
                    <span className=" absolute w-3 h-3 right-0 bottom-0 bg-green-500 rounded-full border-2 border-white "></span>
                  )}{" "}
                </div>{" "}
                {/* User Information */}{" "}
                <div className="flex-1 min-w-0 px-3">
                  {" "}
                  <h1 className=" text-white group-hover:text-black font-semibold text-[15px] truncate ">
                    {" "}
                    {user?.name || user?.userName || "Anonymous"}{" "}
                  </h1>{" "}
                  <p className=" text-gray-400 group-hover:text-gray-800 text-[12px] truncate ">
                    {" "}
                    @{user?.userName || "user"}{" "}
                  </p>{" "}
                </div>{" "}
                {/* Search Icon */}{" "}
                <IoSearch className=" text-[#20c7ff] group-hover:text-black text-[20px] shrink-0 " />{" "}
              </div>
            ))
          ) : (
            /* ================= NO SEARCH RESULT ================= */ <div className="flex flex-col items-center justify-center h-[200px]">
              {" "}
              <IoSearch className="text-[45px] text-gray-400 mb-2" />{" "}
              <h2 className="text-gray-500 font-semibold"> No user found </h2>{" "}
              <p className="text-gray-400 text-sm">
                {" "}
                Try searching another user{" "}
              </p>{" "}
            </div>
          )
        ) : (
          /* ================= NORMAL USERS ================= */ otherUsers?.map(
            (user) => (
              <div
                key={user._id}
                className=" w-full min-h-[60px] group py-1 bg-gray-700 rounded-full flex items-center hover:bg-[#45caff] cursor-pointer transition-all duration-300 active:scale-[0.98] "
                onClick={() => {
                  dispatch(setSelectedUser(user));
                }}
              >
                {" "}
                {/* Profile Image */}{" "}
                <div className=" w-[50px] h-[50px] bg-white rounded-full border-4 mx-1 border-[#20c7ff] shadow-gray-400 shadow-lg relative shrink-0 ">
                  {" "}
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {" "}
                    <img
                      src={user?.img || dp}
                      alt="profile pic"
                      className="w-full h-full object-cover"
                    />{" "}
                  </div>{" "}
                  {/* Online Dot */}{" "}
                  {onlineUsers?.includes(user?._id) && (
                    <span className=" absolute w-3 h-3 right-0 bottom-1 bg-green-500 rounded-full border-2 border-white "></span>
                  )}{" "}
                </div>{" "}
                {/* User Name */}{" "}
                <div className="flex-1 min-w-0 px-2">
                  {" "}
                  <h1 className=" text-white pl-1 group-hover:text-black font-semibold truncate ">
                    {" "}
                    {user?.name || user?.userName || "Anonymous"}{" "}
                  </h1>{" "}
                  <p className=" text-gray-400 group-hover:text-gray-800 text-[12px] pl-1 truncate ">
                    {" "}
                    @{user?.userName || "user"}{" "}
                  </p>{" "}
                </div>{" "}
              </div>
            ),
          )
        )}{" "}
      </div>
      <div
        className="w-[60px] h-[60px] bg-white rounded-full border-4 mx-1 border-[#20c7ff] shadow-gray-400 shadow-lg overflow-hidden fixed left-1 top-4 flex justify-center items-center cursor-pointer"
        onClick={() => {
          navigate("/logout");
        }}
      >
        <RiLogoutCircleLine className="text-[30px] rounded-full" />
      </div>
    </div>
  );
}

export default SideBar;
