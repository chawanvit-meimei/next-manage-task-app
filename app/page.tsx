"use client";
import Image from "next/image";
import imgtask from "@/assets/images/imgtask.png";
import { useState } from "react";
import Swal from "sweetalert2"; 
import Footer from "@/components/FooterSau";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    if (password === "sauiot") {
      router.push("/alltask");
    } else {
      Swal.fire({
        icon: "error",
        title: "Access denied",
        text: "Password is incorrect, please try again.",
      });
    }
  };

  return (
    <>
      <div className="w-2/4 mx-auto flex flex-col items-center
     border-gray-500 rounded-lg shadow-xl p-10">
        <Image
          src={imgtask}
          alt="Task illustration"
          width={150}
          height={150}
          priority
        />
        <h1>Welcome to Task Management App!</h1>

        <div className="flex flex-col items-center w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border border-gray-400 rounded-lg p-2 w-1/5 mt-5 text-center"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="mt-2 text-sm">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((s) => !s)}
              className="mr-1"
            />
            แสดงรหัสผ่าน
          </label>
        </div>

        <button
          onClick={handleClick}
          className="bg-blue-500 hover:bg-blue-700 w-1/5 text-white 
        font-bold p-2 rounded-lg mt-5 cursor-pointer"
        >
          เข้าสู่ระบบ
        </button>
      </div>
      <Footer/>
    </>
  );
}
