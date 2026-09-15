import React, { useEffect, useRef, useState } from "react";

import { IoIosArrowBack } from "react-icons/io";
import dp from "../assets/dp.webp";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";

import { BsEmojiSmile } from "react-icons/bs";
import { IoIosImages } from "react-icons/io";
import { IoMdSend } from "react-icons/io";

import EmojiPicker from "emoji-picker-react";

import SenderMessage from "./SenderMessage.jsx";
import RecieverMessage from "./RecieverMessage.jsx";

import { setMessageData } from "../redux/messageSlice";

import axios from "axios";
import { serverUrl } from "../main";

import { RxCross2 } from "react-icons/rx";

function MessageAreas() {
  let { selectedUser, userData, socket, onlineUsers } = useSelector(
    (state) => state.user,
  );

  let { messages } = useSelector((state) => state.message);

  let dispatch = useDispatch();

  let [showEmoji, setShowEmoji] = useState(false);
  let [input, setInput] = useState("");

  let [frontendImage, setFrontendImage] = useState(null);
  let [backendImage, setBackendImage] = useState(null);

  let image = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "auto",
      block: "end",
    });
  }, [messages]);

  // ================= IMAGE =================

  const handleImage = (e) => {
    let file = e.target.files?.[0];

    if (!file) return;

    setFrontendImage(URL.createObjectURL(file));
    setBackendImage(file);
  };

  // ================= SEND MESSAGE =================

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    if (!input.trim() && !backendImage) return;

    try {
      let formData = new FormData();

      formData.append("message", input);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
        },
      );

      console.log("Sent message:", result.data);

      // Add sent message to current user's chat
      dispatch(setMessageData([...messages, result.data]));

      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
      setShowEmoji(false);

      // Clear file input
      if (image.current) {
        image.current.value = "";
      }
    } catch (error) {
      console.log("Send message error:", error.response?.data || error.message);
    }
  };

  // ================= RECEIVE MESSAGE =================

  useEffect(() => {
    if (!socket) {
      console.log("❌ NO SOCKET IN MESSAGE AREA");
      return;
    }

    console.log("✅ SOCKET IN MESSAGE AREA:", socket.id);

    const handleNewMessage = (newMessage) => {
      console.log("🔥 NEW MESSAGE RECEIVED:", newMessage);
      console.log("SENDER:", newMessage.sender);
      console.log("SELECTED USER:", selectedUser?._id);

      if (newMessage.sender === selectedUser?._id) {
        dispatch(setMessageData([...messages, newMessage]));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, messages, dispatch]);
  // ================= UI =================
  return (
    <div
      className={`lg:w-[70%] relative ${
        selectedUser ? "flex" : "hidden"
      } lg:block w-full h-full min-w-0 min-h-0 overflow-hidden bg-slate-400`}
    >
      {selectedUser && (
        <div className="relative w-full h-full min-w-0 min-h-0 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="w-full min-h-[80px] lg:h-[100px] bg-pink-500 rounded-b-[30px] shadow-lg flex items-center gap-3 px-3 sm:px-5 flex-shrink-0">
            <IoIosArrowBack
              className="w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] text-black cursor-pointer flex-shrink-0"
              onClick={() => dispatch(setSelectedUser(null))}
            />

            <div className="w-[45px] h-[45px] sm:w-[60px] sm:h-[60px] bg-white rounded-full border-4 border-[#20c7ff] shadow-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedUser?.img || dp}
                alt="profile pic"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="font-semibold text-[16px] sm:text-[20px] text-white truncate min-w-0">
                {selectedUser?.name || selectedUser?.userName || "Anonymous"}
              </h2>

              {onlineUsers?.includes(selectedUser?._id) && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse"></span>
                  <h3 className="text-xs sm:text-sm font-medium text-green-400">
                    Online
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* MESSAGES - ONLY THIS PART SCROLLS */}
          <div className="flex-1 mb-[45px] min-h-0 min-w-0 overflow-y-auto overflow-x-hidden hide-scrollbar flex flex-col gap-2 py-5 px-2 sm:px-5">
            {messages.map((message) => {
              if (message.sender === userData?._id) {
                return (
                  <SenderMessage
                    key={message._id}
                    image={message.image}
                    message={message}
                  />
                );
              }

              return (
                <RecieverMessage
                  key={message._id}
                  image={message.image}
                  message={message}
                />
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="absolute bottom-0 left-0 w-full flex justify-center px-2 sm:px-3 pb-3 pointer-events-none">
            {/* IMAGE PREVIEW */}
            {frontendImage && (
              <div className="absolute bottom-[70px] left-3 sm:left-[calc(50%-400px)] z-[100] pointer-events-auto">
                <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] bg-pink-500 rounded-lg p-2">
                  <RxCross2
                    onClick={() => {
                      setFrontendImage(null);
                      setBackendImage(null);

                      if (image.current) {
                        image.current.value = "";
                      }
                    }}
                    className="absolute top-1 right-1 z-10 text-white bg-black/60 rounded-full cursor-pointer text-lg"
                  />

                  <img
                    src={frontendImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSendMessage}
              className="w-full max-w-[800px] min-h-[55px] sm:min-h-[60px] rounded-[30px] bg-pink-500 shadow-lg shadow-gray-500 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 pointer-events-auto"
            >
              {/* EMOJI */}
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="w-[32px] h-[32px] sm:w-[35px] sm:h-[35px] flex-shrink-0 flex items-center justify-center text-white cursor-pointer"
              >
                <BsEmojiSmile className="text-lg sm:text-xl" />
              </button>

              {/* INPUT */}
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                className="bg-transparent outline-none flex-1 min-w-0 h-[40px] text-white placeholder-white text-sm sm:text-base"
                placeholder="Send a message..."
              />

              {/* FILE INPUT */}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={image}
                onChange={handleImage}
              />

              {/* IMAGE BUTTON */}
              <button
                type="button"
                onClick={() => image.current?.click()}
                className="w-[32px] h-[32px] sm:w-[35px] sm:h-[35px] flex-shrink-0 flex items-center justify-center text-white cursor-pointer"
              >
                <IoIosImages className="text-xl" />
              </button>

              {/* SEND */}
              <button
                type="submit"
                className="w-[32px] h-[32px] sm:w-[35px] sm:h-[35px] flex-shrink-0 flex items-center justify-center text-white cursor-pointer"
              >
                <IoMdSend className="text-xl" />
              </button>
            </form>
          </div>

          {/* EMOJI PICKER */}
          {showEmoji && (
            <div className="absolute bottom-[85px] left-2 sm:left-5 z-[100] w-[min(350px,calc(100%-16px))]">
              <EmojiPicker
                width="100%"
                height={350}
                onEmojiClick={(emojiObject) => {
                  setInput((input) => input + emojiObject.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </div>
      )}
      {!selectedUser && (
        <div className="w-full h-full relative overflow-hidden bg-slate-700 flex items-center justify-center">
          {/* ================= ANIMATED BACKGROUND ================= */}

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Moving gradient blobs */}
            <div
              className="
        absolute -top-40 -left-40
        w-[500px] h-[500px]
        rounded-full
        bg-pink-500/20
        blur-[100px]
        animate-[blob1_8s_ease-in-out_infinite]
      "
            />

            <div
              className="
        absolute -bottom-40 -right-40
        w-[500px] h-[500px]
        rounded-full
        bg-purple-500/20
        blur-[100px]
        animate-[blob2_10s_ease-in-out_infinite]
      "
            />

            <div
              className="
        absolute top-[40%] left-[45%]
        w-[250px] h-[250px]
        rounded-full
        bg-pink-400/10
        blur-[80px]
        animate-pulse
      "
            />

            {/* Grid */}
            <div
              className="
        absolute inset-0
        opacity-[0.06]
        bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
        bg-[size:45px_45px]
        [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]
      "
            />

            {/* Moving horizontal scan */}
            <div
              className="
        absolute left-0
        w-full h-[2px]
        bg-gradient-to-r
        from-transparent
        via-pink-400/40
        to-transparent
        animate-[scan_5s_linear_infinite]
      "
            />

            {/* ================= PARTICLES ================= */}

            <span className="absolute top-[12%] left-[18%] w-2 h-2 rounded-full bg-pink-300 animate-[particle1_5s_ease-in-out_infinite]" />
            <span className="absolute top-[25%] left-[75%] w-1.5 h-1.5 rounded-full bg-white animate-[particle2_4s_ease-in-out_infinite]" />
            <span className="absolute top-[70%] left-[20%] w-2 h-2 rounded-full bg-pink-400 animate-[particle3_6s_ease-in-out_infinite]" />
            <span className="absolute top-[80%] left-[80%] w-1.5 h-1.5 rounded-full bg-purple-300 animate-[particle1_7s_ease-in-out_infinite]" />
            <span className="absolute top-[45%] left-[10%] w-1 h-1 rounded-full bg-white animate-ping" />
            <span className="absolute top-[55%] right-[12%] w-1 h-1 rounded-full bg-pink-300 animate-ping [animation-delay:1s]" />
          </div>

          {/* ================= FLOATING CHAT BUBBLES ================= */}

          <div
            className="
      absolute top-[18%] left-[12%]
      px-4 py-2
      rounded-2xl rounded-bl-sm
      bg-white/10
      backdrop-blur-md
      border border-white/10
      text-white/65 text-xs
      animate-[messageFloat1_5s_ease-in-out_infinite]
    "
          >
            Hey 👋
          </div>

          <div
            className="
      absolute top-[25%] right-[13%]
      px-4 py-2
      rounded-2xl rounded-br-sm
      bg-pink-500/20
      backdrop-blur-md
      border border-pink-300/20
      text-pink-200 text-xs
      animate-[messageFloat2_6s_ease-in-out_infinite]
    "
          >
            What's up?
          </div>

          <div
            className="
      absolute bottom-[22%] left-[18%]
      px-4 py-2
      rounded-2xl rounded-bl-sm
      bg-white/10
      backdrop-blur-md
      border border-white/10
      text-white/65 text-xs
      animate-[messageFloat2_7s_ease-in-out_infinite]
    "
          >
            Let's connect ✨
          </div>

          <div
            className="
      absolute bottom-[18%] right-[18%]
      px-4 py-2
      rounded-2xl rounded-br-sm
      bg-pink-500/20
      backdrop-blur-md
      border border-pink-300/20
      text-pink-200 text-xs
      animate-[messageFloat1_6s_ease-in-out_infinite]
    "
          >
            Online ●
          </div>

          {/* ================= MAIN CONTENT ================= */}

          <div
            className="
      relative z-20
      flex flex-col
      items-center
      justify-center
      text-center
    "
          >
            {/* ================= ORBIT ================= */}

            <div
              className="
        relative
        w-[190px] h-[190px]
        sm:w-[230px] sm:h-[230px]
        flex items-center justify-center
      "
            >
              {/* Outer rotating ring */}

              <div
                className="
          absolute inset-0
          rounded-full
          border border-pink-300/20
          animate-[spin_12s_linear_infinite]
        "
              />

              {/* second ring */}

              <div
                className="
          absolute inset-[15px]
          rounded-full
          border border-white/10
          border-dashed
          animate-[spin_8s_linear_infinite_reverse]
        "
              />

              {/* third ring */}

              <div
                className="
          absolute inset-[30px]
          rounded-full
          border border-pink-400/20
          animate-[pulseRing_3s_ease-in-out_infinite]
        "
              />

              {/* Orbit dot */}

              <div
                className="
          absolute
          w-3 h-3
          bg-pink-400
          rounded-full
          shadow-[0_0_25px_rgba(244,114,182,1)]
          animate-[orbit_4s_linear_infinite]
        "
              />

              {/* ================= LOGO ================= */}

              <div
                className="
          relative
          w-[105px] h-[105px]
          sm:w-[125px] sm:h-[125px]
          rounded-[35px]
          bg-gradient-to-br
          from-pink-400
          via-pink-500
          to-rose-600
          flex items-center justify-center
          shadow-[0_0_80px_rgba(236,72,153,0.55)]
          animate-[logoFloat_3s_ease-in-out_infinite]
        "
              >
                {/* inner glow */}

                <div
                  className="
            absolute inset-2
            rounded-[30px]
            border border-white/20
            animate-pulse
          "
                />

                <span
                  className="
            relative
            text-white
            text-[65px]
            sm:text-[78px]
            font-black
            italic
            tracking-[-7px]
            drop-shadow-[0_5px_15px_rgba(0,0,0,.3)]
          "
                >
                  V
                </span>
              </div>
            </div>

            {/* ================= VALORA ================= */}

            <div className="mt-3 overflow-hidden">
              <h1
                className="
          text-white
          text-[52px]
          sm:text-[75px]
          font-black
          tracking-[-5px]
          leading-none
          animate-[titleReveal_1.5s_ease-out]
        "
              >
                Valora
              </h1>
            </div>

            {/* animated underline */}

            <div
              className="
        mt-5
        h-[3px]
        w-[100px]
        overflow-hidden
        rounded-full
        bg-white/10
      "
            >
              <div
                className="
          h-full w-[40px]
          bg-pink-400
          rounded-full
          animate-[lineMove_2s_ease-in-out_infinite]
        "
              />
            </div>

            {/* ================= TAGLINE ================= */}

            <p
              className="
        mt-6
        text-white/70
        text-xs
        sm:text-sm
        tracking-[6px]
        uppercase
        animate-[fadeUp_1.5s_ease-out]
      "
            >
              Connect · Express · Belong
            </p>

            {/* ================= BRAND MEANING ================= */}

            <div
              className="
        mt-8
        flex flex-wrap
        justify-center
        gap-3
        max-w-[600px]
      "
            >
              <div
                className="
          px-4 py-2
          rounded-full
          bg-white/5
          border border-white/10
          backdrop-blur-md
          text-xs
          text-white/65
          animate-[fadeUp_2s_ease-out]
        "
              >
                <span className="text-pink-300 font-semibold">V</span>
                elocity
              </div>

              <div
                className="
          px-4 py-2
          rounded-full
          bg-white/5
          border border-white/10
          backdrop-blur-md
          text-xs
          text-white/65
          animate-[fadeUp_2.3s_ease-out]
        "
              >
                <span className="text-pink-300 font-semibold">A</span>
                ura
              </div>

              <div
                className="
          px-4 py-2
          rounded-full
          bg-white/5
          border border-white/10
          backdrop-blur-md
          text-xs
          text-white/65
          animate-[fadeUp_2.6s_ease-out]
        "
              >
                <span className="text-pink-300 font-semibold">L</span>
                ink
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}

            <p
              className="
        mt-7
        text-white/65
        text-xs
        sm:text-sm
        max-w-[420px]
        leading-6
        animate-[fadeUp_3s_ease-out]
      "
            >
              A space where every message moves instantly, every expression has
              an aura, and every conversation becomes a connection.
            </p>

            {/* ================= STATUS ================= */}

            <div
              className="
        mt-9
        flex items-center gap-3
        px-5 py-3
        rounded-full
        bg-black/20
        border border-white/10
        backdrop-blur-xl
        animate-[fadeUp_3.5s_ease-out]
      "
            >
              <span
                className="
          relative
          flex
          w-2.5 h-2.5
        "
              >
                <span
                  className="
            absolute
            inline-flex
            w-full h-full
            rounded-full
            bg-green-400
            opacity-75
            animate-ping
          />

          <span className="
                  relative
                  inline-flex
                  w-2
                  h-2
                  rounded-full
                  bg-green-400
                />
              </span>

              <span className="text-white/65 text-xs">Valora is ready</span>
            </div>

            <p
              className="
        mt-4
        text-white/60
        text-[10px]
        tracking-[3px]
        uppercase
      "
            >
              Select a conversation to start
            </p>
          </div>

          {/* ================= CONNECTION LINES ================= */}

          <div
            className="
      absolute left-0 top-1/2
      w-[25%] h-px
      bg-gradient-to-r
      from-transparent
      via-pink-400/40
      to-transparent
      animate-pulse
    "
          />

          <div
            className="
      absolute right-0 top-1/2
      w-[25%] h-px
      bg-gradient-to-l
      from-transparent
      via-pink-400/40
      to-transparent
      animate-pulse
    "
          />

          {/* ================= BOTTOM ================= */}

          <div
            className="
      absolute bottom-5
      text-white/60
      text-[9px]
      tracking-[4px]
      uppercase
    "
          >
            VALORA • REAL TIME COMMUNICATION
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageAreas;
