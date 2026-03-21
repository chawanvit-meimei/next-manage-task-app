"use client";
import Image from "next/image";
import imgtask from "../../assets/images/imgtask.png";
import FooterSau from "@/components/FooterSau";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageSelected, setImageSelected] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSelected(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateClick = async () => {
    if (title === "" || detail === "") {
      Swal.fire({
        icon: "warning",
        title: "คำเตือน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if(imageSelected){


    }else{

    }

    let image_url = imagePreview; // default to existing

    if (imageSelected) {
      const new_filename = `${Date.now()}_${imageSelected.name}`;
      const { error: uploadError } = await supabase.storage
        .from("task_images")
        .upload(new_filename, imageSelected);

      if (uploadError) {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "ไม่สามารถอัปโหลดรูปภาพได้",
          confirmButtonText: "ตกลง",
        });
        return;
      }

      const { data } = await supabase.storage
        .from("task_bk")
        .getPublicUrl(new_filename);
      image_url = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        title,
        detail,
        image_url,
        is_completed: isCompleted,
      })
      .eq("id", params.id);

    if (updateError) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขงานได้",
        confirmButtonText: "ตกลง",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "แก้ไขงานเรียบร้อยแล้ว",
        confirmButtonText: "ตกลง",
      });
      router.push("/alltask");
    }
  };

  return (
    <>
      {/* ส่วนของหน้าต่างหลัก */}
      <div
        className="w-3/4 mx-auto mt-20 flex flex-col items-center border border-gray-100
                      rounded-lg shadow-xl p-10"
      >
        {/* ส่วนของหัวเพจ */}
        <Image src={imgtask} alt="imgtask" width={75} height={75} />
        <h1 className="text-xl">Manage Task App</h1>
        <h1 className="text-lg">แก้ไขงาน</h1>

        {/* ส่วนของการป้อนและเลือกข้อมูล */}
        <div className="w-full flex flex-col mt-5">
          <label>งานที่ทำ</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded"
          />

          <label className="mt-3">รายละเอียดงาน</label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full border border-gray-400 rounded"
            rows={3}
          ></textarea>

          <label className="mt-3">สถานะงาน</label>
          <select
            value={isCompleted == true ? "1" : "0"}
            onChange={(e) => setIsCompleted(e.target.value === "1")}
            className="w-full border border-gray-400 rounded p-1"
          >
            <option value="1">✅ เสร็จ</option>
            <option value="0">❌ ยังไม่เสร็จ</option>
          </select>

          <label className="mt-3">รูป</label>
          <input
            type="file"
            id="taskpicture"
            className="hidden"
            onChange={handleSelectPicture}
          />
          <label
            htmlFor="taskpicture"
            className="w-50 bg-green-600 p-2 rounded text-center
                                text-white cursor-pointer hover:bg-green-700"
          >
            คลิกเพื่อเลือกรูป
          </label>
          {/* ส่วนของการ preview รูปที่เลือก */}
          {imagePreview && (
            <div className="mt-3">
              <Image
                src={imagePreview}
                alt="Preview"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>

        {/* ส่วนของปุ่มบันทึก */}
        <button
          className="w-full p-2 bg-blue-600 mt-3 rounded text-white
                               cursor-pointer hover:bg-blue-700"
          onClick={handleUpdateClick}
        >
          บันทึกแก้ไขงาน
        </button>

        {/* ลิงค์กลับไปหน้า /alltask */}
        <Link href="/alltask" className="mt-3">
          - กลับไปหน้าหลัก -
        </Link>
      </div>

      {/* ส่วนของ FooterSAU */}
      <FooterSau />
    </>
  );
}
