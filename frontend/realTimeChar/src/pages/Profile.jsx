
import React, { useEffect, useRef, useState } from "react";
import dp from "../assets/dp.webp";
import { FaCamera, FaCheck, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";

function Profile() {
  let { userData } = useSelector((state) => state.user);

  let dispatch = useDispatch();
  let navigate = useNavigate();

  let [name, setName] = useState(userData?.name || "");

  const [frontendImage, setFrontendImage] = useState(
    userData?.img || dp
  );

  let [saving, setSaving] = useState(false);
  let [backendImage, setBackendImage] = useState(null);

  let image = useRef();

  useEffect(() => {
    if (userData?.img) {
      setFrontendImage(userData.img);
    }

    if (userData?.name) {
      setName(userData.name);
    }
  }, [userData?.img, userData?.name]);

  const handleImage = (e) => {
    let file = e.target.files[0];

    if (!file) return;

    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    setSaving(true);

    try {
      let formData = new FormData();

      formData.append("name", name.trim());

      if (backendImage) {
        formData.append("image", backendImage);
      }

      let result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));

      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-pink-500/10 rounded-full blur-[100px] -top-32 -left-32"></div>

      <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-cyan-400/10 rounded-full blur-[100px] -bottom-32 -right-32"></div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 sm:top-7 sm:left-7 z-20 
        w-11 h-11 sm:w-12 sm:h-12 rounded-full
        bg-white/10 backdrop-blur-xl border border-white/10
        flex items-center justify-center
        text-white/70 hover:text-white
        hover:bg-white/20
        transition-all duration-300
        hover:-translate-x-1"
      >
        <IoIosArrowBack className="text-2xl" />
      </button>

      {/* Main Card */}
      <div
        className="relative z-10 w-full max-w-[850px]
        bg-white/[0.06] backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        p-5 sm:p-8 md:p-10"
      >

        {/* Heading */}
        <div className="text-center mb-7 sm:mb-9">

          <div className="flex items-center justify-center gap-2 mb-2">
            <FaUser className="text-pink-400 text-sm" />

            <span className="text-pink-400 text-xs sm:text-sm font-semibold uppercase tracking-[3px]">
              Account
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            Your Profile
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Customize your profile and keep your identity up to date.
          </p>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">

          <div
            onClick={() => image.current.click()}
            className="group relative cursor-pointer
            w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44
            rounded-full p-[3px]
            bg-gradient-to-br from-cyan-400 via-blue-500 to-pink-500
            shadow-[0_0_35px_rgba(34,211,238,0.2)]
            hover:shadow-[0_0_50px_rgba(236,72,153,0.3)]
            transition-all duration-500"
          >

            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">

              <img
                src={frontendImage}
                alt="profile pic"
                className="w-full h-full object-cover
                group-hover:scale-110 transition-transform duration-500"
              />

              {/* Image Overlay */}
              <div
                className="absolute inset-0
                bg-black/50 opacity-0
                group-hover:opacity-100
                transition-all duration-300
                flex flex-col items-center justify-center"
              >
                <FaCamera className="text-white text-xl sm:text-2xl mb-1" />

                <span className="text-white text-[10px] sm:text-xs">
                  Change Photo
                </span>
              </div>

            </div>

            {/* Camera Badge */}
            <div
              className="absolute bottom-1 right-1
              sm:bottom-2 sm:right-2
              w-9 h-9 sm:w-11 sm:h-11
              rounded-full
              bg-pink-500
              border-4 border-slate-950
              flex items-center justify-center
              text-white
              shadow-lg
              group-hover:scale-110
              transition-transform duration-300"
            >
              <FaCamera className="text-xs sm:text-sm" />
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />

          <p className="text-slate-500 text-[11px] sm:text-xs mt-3">
            Click your photo to change it
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleProfile}
          className="w-full flex flex-col gap-4 sm:gap-5"
        >

          {/* Name */}
          <div className="w-full">
            <label className="text-slate-300 text-xs sm:text-sm mb-2 block">
              Display Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full h-14 sm:h-16
              px-4 sm:px-5
              rounded-xl
              bg-slate-900/60
              border border-white/10
              text-white
              placeholder:text-slate-600
              outline-none
              focus:border-pink-400/70
              focus:ring-2 focus:ring-pink-400/10
              transition-all duration-300"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </div>

          {/* Username + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-slate-300 text-xs sm:text-sm mb-2 block">
                Username
              </label>

              <input
                type="text"
                className="w-full h-14 sm:h-16
                px-4 sm:px-5
                rounded-xl
                bg-slate-900/40
                border border-white/5
                text-slate-400
                outline-none
                cursor-not-allowed"
                value={userData?.userName || ""}
                readOnly
              />
            </div>

            <div>
              <label className="text-slate-300 text-xs sm:text-sm mb-2 block">
                Email
              </label>

              <input
                type="email"
                className="w-full h-14 sm:h-16
                px-4 sm:px-5
                rounded-xl
                bg-slate-900/40
                border border-white/5
                text-slate-400
                outline-none
                cursor-not-allowed"
                value={userData?.email || ""}
                readOnly
              />
            </div>

          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full h-14 sm:h-16
            mt-3
            rounded-xl
            bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500
            hover:from-pink-400 hover:via-fuchsia-400 hover:to-purple-400
            text-white
            font-semibold
            text-sm sm:text-base
            shadow-[0_10px_30px_rgba(236,72,153,0.2)]
            hover:shadow-[0_15px_40px_rgba(236,72,153,0.35)]
            active:scale-[0.98]
            transition-all duration-300
            disabled:opacity-60
            disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span
                  className="w-5 h-5 border-2 border-white/30
                  border-t-white rounded-full animate-spin"
                ></span>

                Saving...
              </>
            ) : (
              <>
                <FaCheck className="text-sm" />
                Save Profile
              </>
            )}
          </button>

        </form>

        {/* Bottom Accent */}
        <div className="mt-7 flex justify-center">
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500"></div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
