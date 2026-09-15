import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

function RecieverMessage({ image, message }) {
  let scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [message, image]);

  // Selected / other user
  let { selectedUser } = useSelector((state) => state.user);

  return (
    (image || message?.message) && (
      <div
        className="w-full flex items-end justify-start gap-2 mx-1 my-1 relative"
        ref={scroll}

      >
        {/* Selected User Profile Image */}
        <div className="w-[55px] h-[55px] min-w-[35px] min-h-[35px] bg-white rounded-full border-4 border-[#20c7ff] shadow-lg overflow-hidden flex-shrink-0 absolute top-0">
          <img
            src={selectedUser?.img || dp}
            alt="profile pic"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Message */}
        <div className="w-fit max-w-[min(500px,80%)] px-[20px] py-[10px] bg-pink-700 text-white text-[19px] rounded-tl-none rounded-2xl shadow-gray-400 shadow-lg gap-[10px] flex flex-col break-words whitespace-pre-wrap ml-[68px] mt-2">
          {/* Image Message */}
          {image && (
            <img
              src={image}
              className="w-auto h-auto max-w-full max-h-[300px] sm:max-h-[400px] object-contain rounded-lg"
              alt=""
            />
          )}

          {/* Text Message */}
          <span>{message?.message}</span>
        </div>
      </div>
    )
  );
}

export default RecieverMessage;
