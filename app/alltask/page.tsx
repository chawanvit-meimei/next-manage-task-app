"use client";

import Image from "next/image";
import imgtask from "@/assets/images/imgtask.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";

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
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "คำเตือน",
        text: "พบปัญหาในการดึงข้อมูล: " + error.message,
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (data) {
      setTasks(
        data.map((row: any) => ({
          id: row.id,
          createdAt: row.created_at,
          title: row.title,
          detail: row.detail,
          image_url: row.image_url,
          is_completed: row.is_completed,
          updatedAt: row.updated_at,
        })),
      );
    }
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split("/").pop() || "";
  };

  const handleDeleteClick = async (id: string, image_url: string) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "รายการนี้จะถูกลบอย่างถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

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

    if (image_url) {
      const fileName = getFileNameFromUrl(image_url);

      await supabase.storage.from("TASK_IMAGE").remove([fileName]);
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));

    Swal.fire({
      icon: "success",
      title: "สำเร็จ",
      text: "ลบงานเรียบร้อยแล้ว",
      confirmButtonText: "ตกลง",
    });
  };

  return (
    <>
      <div className="w-11/12 mx-auto mt-10 flex flex-col items-center border-gray-500 rounded-lg shadow-xl p-10">
        <Image src={imgtask} alt="imgtask" width={120} height={120} priority />

        <h1 className="text-xl mt-2">Manage Tasks</h1>
        <h1 className="text-lg">งานทั้งหมด</h1>

        <div className="w-full flex justify-end mt-5 mb-5">
          <Link
            href="/addtask"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            เพิ่มงาน
          </Link>
        </div>

        <div className="w-full overflow-x-auto">
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
                  จัดการ
                </th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-gray-500 p-5 text-center"
                  >
                    ยังไม่มีข้อมูลงาน
                  </td>
                </tr>
              ) : (
                tasks.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-gray-500 p-2 text-center">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="mx-auto rounded object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="border border-gray-500 p-2">{item.title}</td>

                    <td className="border border-gray-500 p-2">
                      {item.detail}
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("th-TH")
                        : "-"}
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                      {item.is_completed ? "เสร็จสิ้น" : "ยังไม่เสร็จ"}
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString("th-TH")
                        : "-"}
                    </td>

                    <td className="border border-gray-500 p-2 text-center">
                      <Link
                        href={"/edittask/" + item.id}
                        className="cursor-pointer text-green-600 hover:underline"
                      >
                        แก้ไข
                      </Link>

                      <span className="mx-2">|</span>

                      <button
                        className="cursor-pointer text-red-600 hover:underline"
                        onClick={() =>
                          handleDeleteClick(item.id, item.image_url)
                        }
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
