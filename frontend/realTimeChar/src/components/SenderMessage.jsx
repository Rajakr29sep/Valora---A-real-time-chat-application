
import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

function SenderMessage({ image, message }) {
  let scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [message, image]);

  let { userData } = useSelector((state) => state.user);

  return (
    (image || message?.message) && (
      <div
        className="w-full flex items-end justify-end gap-2 mx-1 my-1 relative"
        ref={scroll}
      >
        {/* Message */}
        <div className="w-fit max-w-[500px] px-[20px] py-[10px] bg-pink-500 text-white text-[19px] rounded-tr-none rounded-2xl shadow-gray-400 shadow-lg break-words whitespace-pre-wrap  mr-[68px] mt-2">
                {image && (
            <img
              src={image}
              className="w-auto h-auto max-w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
              alt=""
            />
          )}
          <span>{message?.message}</span>
        </div>

        {/* Profile Image */}
    <div className="w-[55px] h-[55px] min-w-[35px] min-h-[35px] bg-white rounded-full border-4 border-[#20c7ff] shadow-lg overflow-hidden flex-shrink-0  absolute top-0">
          <img
            src={userData?.img || dp}
            alt="profile pic"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    )
  );
}

export default SenderMessage;
