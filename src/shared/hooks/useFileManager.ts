import { useState, useEffect } from "react";
import { deleteFileById } from "shared/api/files";
import type { FileItem } from "shared/UI/ProjectFiles/ProjectFiles";
import { getCookie } from "shared/utils/cookies";

export function useFileManager(
  initialFiles: FileItem[],
  uploadFn: (file: File, ownerId: number) => Promise<FileItem>,
  ownerId: number,
  fileType: "client" | "specialist" | "project" | "admin",
  refreshFn?: () => void
) {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    setFiles(initialFiles || []);
  }, [initialFiles]);

  const handleFileSelect = async (file: File) => {
    if (!ownerId) return;
    try {
      const uploaded = await uploadFn(file, ownerId);
      if (uploaded && uploaded.id) {
        // Обновляем локальное состояние
        setFiles((prev) => [...prev, uploaded]);
        // Вызываем refreshFn, если он предоставлен
        if (refreshFn) {
          refreshFn();
        }
      }
    } catch (e) {
      console.error("Ошибка загрузки файла:", e);
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    try {
      await deleteFileById(fileType, file.id);
      // Обновляем локальное состояние
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      // Вызываем refreshFn, если он предоставлен
      if (refreshFn) {
        refreshFn();
      }
    } catch (e) {
      console.error("Ошибка удаления файла:", e);
    }
  };

  return { files, handleFileSelect, handleDeleteFile };
}