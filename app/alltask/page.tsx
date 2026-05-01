"use client";
import Image from "next/image";
import imgtask from "@/assets/images/imgtask.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
import FooterSau from "@/components/FooterSau";

type Task = {
  id: string;
  createdAt: string;
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  updatedAt: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase.from("tasks").select("*");

        if (error) {
          throw error;
        }

        if (data) {
          setTasks(
            data.map((row: any) => ({
              id: row.id,
              createdAt: row.created_at || row.createdAt,
              title: row.title,
              detail: row.detail,
              image_url: row.image_url,
              is_completed: row.is_completed,
              updatedAt: row.updated_at || row.updatedAt,
            })) as Task[],
          );
        }
      } catch (err: any) {
        console.error("fetchTasks error", err);
        Swal.fire({
          icon: "error",
          title: "คำเตือน",
          text:
            "พบปัญหาในการดึงข้อมูล: " + (err?.message || JSON.stringify(err)),
          confirmButtonText: "ตกลง",
        });
      }
    };
    fetchTasks();
  }, []);

  const handleDeleteClick = async (id: string, image_url: string) => {
    // confirm with user
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "รายการนี้จะถูกลบอย่างถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) {
      return; // nothing to do
    }

    // delete task row
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      Swal.fire({
        icon: "error",
        title: "คำเตือน",
        text: "ไม่สามารถลบข้อมูลได้: " + error.message,
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // optionally delete associated image
    if (image_url) {
      const { error: deleteImgErr } = await supabase.storage
        .from("task_bk")
        .remove([image_url.split('/').pop()as string]);
      if (deleteImgErr) {
        console.warn("failed to remove image:", deleteImgErr);
      }
    }

    // update front-end state
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      {/*--------------header-----------------*/}
      <div
        className="w-2/4 mx-auto flex flex-col items-center
     border-gray-500 rounded-lg shadow-xl p-10"
      >
        <Image src={imgtask} alt="imgtask" width={150} height={150} priority />
        <h1 className=" text-xl">Manage Tasks</h1>
        <h1 className=" text-lg">งานทั้งหมด</h1>
        <div className="w-full flex justify-end mt-5 mb-5">
          <Link
            href="/addtask"
            className="px-3 py-2 bg-blue-500 text-white rounded"
          >
            เพิ่มงาน
          </Link>
        </div>

        {/*-------------show data--------------*/}
        <table className="w-full border border-gray-500 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-500 bg-gray-400 p-2">รูป</th>
              <th className="border border-gray-500 bg-gray-400 p-2">
                ชื่องาน
              </th>
              <th className="border border-gray-500 bg-gray-400 p-2">
                รายละเอียดงาน
              </th>
              <th className="border border-gray-500 bg-gray-400 p-2">
                วันที่เพิ่มงาน
              </th>
              <th className="border border-gray-500 bg-gray-400 p-2">
                สถานะงาน
              </th>
              <th className="border border-gray-500 bg-gray-400 p-2">
                วันที่แก้ไขงาน
              </th>
              <th className="border border-gray-500 bg-gray-400 p-2">
                update/delete
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-500 p-2">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="mx-auto"
                  />
                </td>
                <td className="border border-gray-500 p-2">{item.title}</td>
                <td className="border border-gray-500 p-2">{item.detail}</td>
                <td className="border border-gray-500 p-2">
                  {item.is_completed == true ? "เสร็จสิ้น" : "ยังไม่เสร็จ"}
                </td>
                <td className="border border-gray-500 p-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-500 p-2">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-500 p-2">
                  <Link
                    href={"/edittask/" + item.id}
                    className="cursor-pointer text-green-500"
                  >
                    แก้ไข
                  </Link>
                  |
                  <button
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDeleteClick(item.id, item.image_url)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
