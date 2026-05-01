"use client";

import Image from "next/image";
import imgtask from "@/assets/images/imgtask.png";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageSelected, setImageSelected] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลงานได้: " + error.message,
          confirmButtonText: "ตกลง",
        });
        return;
      }

      if (data) {
        setTitle(data.title || "");
        setDetail(data.detail || "");
        setIsCompleted(data.is_completed || false);
        setImagePreview(data.image_url || "");
      }
    };

    fetchTask();
  }, [id]);

  const handleSelectPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageSelected(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateClick = async () => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่พบรหัสงาน",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (title === "" || detail === "") {
      Swal.fire({
        icon: "warning",
        title: "คำเตือน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    let image_url = imagePreview || "";

    if (imageSelected) {
      const newFilename = `${Date.now()}_${imageSelected.name}`;

      const { error: uploadError } = await supabase.storage
        .from("task_image")
        .upload(newFilename, imageSelected);

      if (uploadError) {
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "ไม่สามารถอัปโหลดรูปภาพได้: " + uploadError.message,
          confirmButtonText: "ตกลง",
        });
        return;
      }

      const { data } = supabase.storage
        .from("task_image")
        .getPublicUrl(newFilename);

      image_url = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        title: title,
        detail: detail,
        image_url: image_url,
        is_completed: isCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขงานได้: " + updateError.message,
        confirmButtonText: "ตกลง",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "สำเร็จ",
      text: "แก้ไขงานเรียบร้อยแล้ว",
      confirmButtonText: "ตกลง",
    });

    router.push("/alltask");
  };

  return (
    <>
      <div className="w-3/4 mx-auto mt-20 flex flex-col items-center border border-gray-100 rounded-lg shadow-xl p-10">
        <Image src={imgtask} alt="imgtask" width={75} height={75} />

        <h1 className="text-xl mt-2">Manage Task App</h1>
        <h1 className="text-lg">แก้ไขงาน</h1>

        <div className="w-full flex flex-col mt-5">
          <label>งานที่ทำ</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded p-2 text-black"
          />

          <label className="mt-3">รายละเอียดงาน</label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full border border-gray-400 rounded p-2 text-black"
            rows={3}
          />

          <label className="mt-3">สถานะงาน</label>
          <select
            value={isCompleted ? "1" : "0"}
            onChange={(e) => setIsCompleted(e.target.value === "1")}
            className="w-full border border-gray-400 rounded p-2 text-black"
          >
            <option value="1">เสร็จ</option>
            <option value="0">ยังไม่เสร็จ</option>
          </select>

          <label className="mt-3">รูป</label>
          <input
            type="file"
            id="taskpicture"
            className="hidden"
            accept="image/*"
            onChange={handleSelectPicture}
          />

          <label
            htmlFor="taskpicture"
            className="w-50 bg-green-600 p-2 rounded text-center text-white cursor-pointer hover:bg-green-700"
          >
            คลิกเพื่อเลือกรูป
          </label>

          {imagePreview && (
            <div className="mt-3">
              <Image
                src={imagePreview}
                alt="Preview"
                width={120}
                height={120}
                className="rounded object-cover"
              />
            </div>
          )}
        </div>

        <button
          className="w-full p-2 bg-blue-600 mt-3 rounded text-white cursor-pointer hover:bg-blue-700"
          onClick={handleUpdateClick}
        >
          บันทึกแก้ไขงาน
        </button>

        <Link href="/alltask" className="mt-3 text-blue-600">
          - กลับไปหน้าหลัก -
        </Link>
      </div>
    </>
  );
}