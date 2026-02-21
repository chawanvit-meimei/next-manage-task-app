"use client";
import Image from "next/image";
import imgtask from "@/assets/images/imgtask.png";
import { useState } from "react";
import Swal from "sweetalert2"; 
import Footer from "@/components/FooterSau";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [secureCode, setSecureCode] = useState("");

  const handleclick = () => {
    if(secureCode === "sauiot") {
      router.push("/alltask");
    }else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please enter a secure code!',
      });
      return;
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

        <input
          type="text"
          placeholder="secure code"
          className="border border-gray-400 rounded-lg p-2 w-1/5 mt-5 text-center"
          value={secureCode}
          onChange={(e) => setSecureCode(e.target.value)}
        />

        <button className="bg-blue-500 hover:bg-blue-700 w-1/5 text-white 
        font-bold p-2 rounded-lg mt-5 cursor-pointer">
          login
        </button>
      </div>
      <Footer/>
    </>
  );
}
