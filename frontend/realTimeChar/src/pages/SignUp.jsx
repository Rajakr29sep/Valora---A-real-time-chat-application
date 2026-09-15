
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../main";
import "./Login.css";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
} from "react-icons/fa";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");

  let navigate = useNavigate();
  let dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessages("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMessages("");

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          username,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(result);

      dispatch(setUserData(result.data));

      setLoading(false);

      navigate("/");
    } catch (err) {
      setLoading(false);

      console.log("Signup Error:", err);

      if (err.response) {
        console.log("Response:", err.response);
        console.log("Data:", err.response.data);
        console.log("Status:", err.response.status);

        setErrorMessages(
          err.response.data?.message || "Signup failed. Please try again."
        );
      } else if (err.request) {
        console.log("Request was sent but no response received");

        setErrorMessages(
          "Server is not responding. Please try again."
        );
      } else {
        console.log("Error:", err.message);

        setErrorMessages(
          err.message || "Something went wrong."
        );
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-slate-950
      flex items-center justify-center
      px-4 py-8 sm:px-6
      relative overflow-hidden"
    >

      {/* ================= BACKGROUND EFFECTS ================= */}

      <div
        className="absolute
        w-[250px] h-[250px]
        sm:w-[400px] sm:h-[400px]
        bg-pink-500/20
        rounded-full
        blur-[100px]
        -top-32 -left-32"
      ></div>

      <div
        className="absolute
        w-[250px] h-[250px]
        sm:w-[400px] sm:h-[400px]
        bg-cyan-400/10
        rounded-full
        blur-[100px]
        -bottom-32 -right-32"
      ></div>

      <div
        className="absolute
        w-[150px] h-[150px]
        bg-purple-500/10
        rounded-full
        blur-[80px]
        top-[45%] left-[45%]"
      ></div>


      {/* ================= MAIN CARD ================= */}

      <div
        className="relative z-10
        w-full max-w-[560px]
        bg-white/[0.07]
        backdrop-blur-2xl
        border border-white/10
        rounded-3xl
        overflow-hidden
        shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
      >

        {/* ================= HEADER ================= */}

        <div
          className="relative
          w-full
          min-h-[190px]
          sm:min-h-[220px]
          bg-gradient-to-br
          from-pink-500
          via-fuchsia-500
          to-purple-600
          flex flex-col
          items-center
          justify-center
          px-5
          overflow-hidden"
        >

          {/* Header circles */}

          <div
            className="absolute
            w-32 h-32
            rounded-full
            bg-white/10
            -top-16 -right-10"
          ></div>

          <div
            className="absolute
            w-24 h-24
            rounded-full
            bg-black/10
            -bottom-12 -left-8"
          ></div>

          <div
            className="relative z-10
            w-14 h-14
            sm:w-16 sm:h-16
            rounded-2xl
            bg-white/20
            backdrop-blur-md
            border border-white/30
            flex items-center justify-center
            mb-4
            shadow-xl
            rotate-3"
          >
            <FaUser
              className="text-white
              text-xl sm:text-2xl
              -rotate-3"
            />
          </div>

          <h1
            className="relative z-10
            text-2xl sm:text-3xl
            font-extrabold
            text-slate-900
            tracking-tight"
          >
            Welcome to{" "}
            <span className="text-white">
              Velora
            </span>
          </h1>

          <p
            className="relative z-10
            text-pink-950/80
            text-xs sm:text-sm
            font-semibold
            mt-2"
          >
            Velocity • Aura • Valor
          </p>

        </div>


        {/* ================= FORM AREA ================= */}

        <div
          className="px-5 py-7
          sm:px-8 sm:py-9
          md:px-10"
        >

          <div className="mb-6 sm:mb-7">

            <h2
              className="text-xl sm:text-2xl
              font-bold text-white"
            >
              Create your account
            </h2>

            <p
              className="text-slate-400
              text-xs sm:text-sm
              mt-1"
            >
              Join Velora and start connecting.
            </p>

          </div>


          <form
            onSubmit={handleSignUp}
            className="flex flex-col gap-4"
          >

            {/* ================= USERNAME ================= */}

            <div className="relative group">

              <FaUser
                className="absolute
                left-4 top-1/2
                -translate-y-1/2
                text-slate-500
                group-focus-within:text-pink-400
                transition-colors"
              />

              <input
                className="w-full
                h-14 sm:h-16
                pl-11 pr-4
                rounded-xl
                bg-slate-900/70
                border border-white/10
                text-white
                placeholder:text-slate-600
                outline-none
                focus:border-pink-400/70
                focus:ring-2
                focus:ring-pink-400/10
                transition-all duration-300"
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />

            </div>


            {/* ================= EMAIL ================= */}

            <div className="relative group">

              <FaEnvelope
                className="absolute
                left-4 top-1/2
                -translate-y-1/2
                text-slate-500
                group-focus-within:text-pink-400
                transition-colors"
              />

              <input
                className="w-full
                h-14 sm:h-16
                pl-11 pr-4
                rounded-xl
                bg-slate-900/70
                border border-white/10
                text-white
                placeholder:text-slate-600
                outline-none
                focus:border-pink-400/70
                focus:ring-2
                focus:ring-pink-400/10
                transition-all duration-300"
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

            </div>


            {/* ================= PASSWORD ================= */}

            <div
              className="flex items-center
              w-full
              h-14 sm:h-16
              rounded-xl
              bg-slate-900/70
              border border-white/10
              overflow-hidden
              focus-within:border-pink-400/70
              focus-within:ring-2
              focus-within:ring-pink-400/10
              transition-all duration-300"
            >

              <FaLock
                className="ml-4
                text-slate-500
                shrink-0"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Password"
                className="flex-1
                min-w-0
                h-full
                px-3
                bg-transparent
                text-white
                placeholder:text-slate-600
                outline-none"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="w-12 sm:w-14
                h-full
                flex items-center justify-center
                text-slate-500
                hover:text-pink-400
                transition-colors
                shrink-0"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>


            {/* ================= ERROR ================= */}

            {errorMessages && (
              <div
                className="w-full
                px-4 py-3
                rounded-xl
                bg-red-500/10
                border border-red-500/20
                text-red-400
                text-xs sm:text-sm
                text-center
                animate-pulse"
              >
                {errorMessages}
              </div>
            )}


            {/* ================= SIGNUP BUTTON ================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full
              h-14 sm:h-16
              mt-2
              rounded-xl
              bg-gradient-to-r
              from-pink-500
              via-fuchsia-500
              to-purple-500
              text-white
              font-semibold
              text-sm sm:text-base
              flex items-center justify-center gap-3
              shadow-[0_10px_30px_rgba(236,72,153,0.2)]
              hover:shadow-[0_15px_40px_rgba(236,72,153,0.35)]
              hover:-translate-y-0.5
              active:scale-[0.98]
              transition-all duration-300
              disabled:opacity-60
              disabled:cursor-not-allowed
              disabled:hover:translate-y-0"
            >

              {loading ? (
                <>
                  <span
                    className="w-5 h-5
                    border-2
                    border-white/30
                    border-t-white
                    rounded-full
                    animate-spin"
                  ></span>

                  Creating Account...
                </>
              ) : (
                <>
                  Create Account

                  <FaArrowRight
                    className="text-xs
                    transition-transform
                    group-hover:translate-x-1"
                  />
                </>
              )}

            </button>

          </form>


          {/* ================= LOGIN ================= */}

          <p
            className="text-center
            text-slate-500
            text-xs sm:text-sm
            mt-6"
          >
            Already have an account?{" "}

            <span
              onClick={() => navigate("/login")}
              className="text-pink-400
              hover:text-pink-300
              font-semibold
              cursor-pointer
              transition-colors"
            >
              Login
            </span>
          </p>


          {/* Bottom Accent */}

          <div className="flex justify-center mt-6">
            <div
              className="w-14 h-1
              rounded-full
              bg-gradient-to-r
              from-cyan-400
              to-pink-500"
            ></div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default SignUp;
